import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProductSchema, 
  insertTransactionSchema,
  insertFeatureCategorySchema,
  insertFeatureSchema,
  insertFeatureRequestSchema,
  insertAIToolSchema
} from "@shared/schema";
import QRCode from "qrcode";
import { generatePromptPayPayload } from "../client/src/lib/promptpay";
import { importAIToolsFromExcel } from "./importAITools";

export async function registerRoutes(app: Express): Promise<Server> {
  // Products API
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: "Invalid product data" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, validatedData);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: "Invalid product data" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const success = await storage.deleteProduct(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Transactions API
  app.get("/api/transactions", async (req, res) => {
    try {
      const transactions = await storage.getTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.get("/api/transactions/:id", async (req, res) => {
    try {
      const transaction = await storage.getTransaction(req.params.id);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transaction" });
    }
  });

  // Create transaction and generate QR code
  app.post("/api/checkout", async (req, res) => {
    try {
      const { productId, promptpayId } = req.body;

      if (!productId || !promptpayId) {
        return res.status(400).json({ error: "Product ID and PromptPay ID are required" });
      }

      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Generate PromptPay payload
      const payload = generatePromptPayPayload(promptpayId, product.price);
      
      // Generate QR code
      const qrCode = await QRCode.toDataURL(payload);

      // Create transaction
      const transactionData = {
        productId,
        amount: product.price,
        promptpayId,
        qrCode,
        status: "pending",
      };

      const transaction = await storage.createTransaction(transactionData);

      res.json({
        transaction,
        product,
        qrCode,
      });
    } catch (error) {
      console.error("Checkout error:", error);
      res.status(500).json({ error: "Failed to create transaction" });
    }
  });

  // Update transaction status (webhook simulation)
  app.post("/api/transactions/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      
      if (!["pending", "completed", "failed"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const transaction = await storage.updateTransactionStatus(req.params.id, status);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }

      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: "Failed to update transaction status" });
    }
  });

  // Feature Categories API
  app.get("/api/feature-categories", async (req, res) => {
    try {
      const categories = await storage.getFeatureCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch feature categories" });
    }
  });

  app.post("/api/feature-categories", async (req, res) => {
    try {
      const validatedData = insertFeatureCategorySchema.parse(req.body);
      const category = await storage.createFeatureCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ error: "Invalid category data" });
    }
  });

  // Features API
  app.get("/api/features", async (req, res) => {
    try {
      const { categoryId, status, difficulty } = req.query;
      let features = await storage.getFeatures(categoryId as string);
      
      // Apply filters
      if (status && status !== "all") {
        features = features.filter(f => f.status === status);
      }
      if (difficulty && difficulty !== "all") {
        features = features.filter(f => f.difficulty === difficulty);
      }
      
      res.json(features);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch features" });
    }
  });

  app.get("/api/features/:id", async (req, res) => {
    try {
      const feature = await storage.getFeature(req.params.id);
      if (!feature) {
        return res.status(404).json({ error: "Feature not found" });
      }
      res.json(feature);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch feature" });
    }
  });

  app.post("/api/features", async (req, res) => {
    try {
      const validatedData = insertFeatureSchema.parse(req.body);
      const feature = await storage.createFeature(validatedData);
      res.status(201).json(feature);
    } catch (error) {
      res.status(400).json({ error: "Invalid feature data" });
    }
  });

  app.put("/api/features/:id", async (req, res) => {
    try {
      const validatedData = insertFeatureSchema.partial().parse(req.body);
      const feature = await storage.updateFeature(req.params.id, validatedData);
      if (!feature) {
        return res.status(404).json({ error: "Feature not found" });
      }
      res.json(feature);
    } catch (error) {
      res.status(400).json({ error: "Invalid feature data" });
    }
  });

  // Feature Requests API
  app.get("/api/feature-requests", async (req, res) => {
    try {
      const requests = await storage.getFeatureRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch feature requests" });
    }
  });

  app.post("/api/feature-requests", async (req, res) => {
    try {
      const validatedData = insertFeatureRequestSchema.parse(req.body);
      const request = await storage.createFeatureRequest(validatedData);
      res.status(201).json(request);
    } catch (error) {
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  // Feature request for custom development
  app.post("/api/request-feature/:id", async (req, res) => {
    try {
      const { clientName, clientEmail, customRequirements, budget, deadline } = req.body;
      
      if (!clientName || !clientEmail) {
        return res.status(400).json({ error: "Client name and email are required" });
      }

      const feature = await storage.getFeature(req.params.id);
      if (!feature) {
        return res.status(404).json({ error: "Feature not found" });
      }

      const requestData = {
        featureId: req.params.id,
        clientName,
        clientEmail,
        customRequirements,
        budget: budget || feature.price,
        deadline: deadline ? new Date(deadline) : undefined,
        status: "pending" as const,
        notes: `Request for: ${feature.name}`,
      };

      const request = await storage.createFeatureRequest(requestData);
      res.status(201).json(request);
    } catch (error) {
      res.status(500).json({ error: "Failed to create feature request" });
    }
  });

  // AI Tools API
  app.get("/api/ai-tools", async (req, res) => {
    try {
      const { category, search, featured, popular, page = 1, limit = 50 } = req.query;
      let tools = await storage.getAITools({
        category: category as string,
        search: search as string,
        featured: featured === 'true',
        popular: popular === 'true',
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      });
      res.json(tools);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch AI tools" });
    }
  });

  // AI Tools Categories API
  app.get("/api/ai-tools/categories", async (req, res) => {
    try {
      const categories = await storage.getAIToolCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch AI tool categories" });
    }
  });

  app.get("/api/ai-tools/:id", async (req, res) => {
    try {
      const tool = await storage.getAITool(req.params.id);
      if (!tool) {
        return res.status(404).json({ error: "AI tool not found" });
      }
      res.json(tool);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch AI tool" });
    }
  });

  app.post("/api/ai-tools", async (req, res) => {
    try {
      const validatedData = insertAIToolSchema.parse(req.body);
      const tool = await storage.createAITool(validatedData);
      res.status(201).json(tool);
    } catch (error) {
      res.status(400).json({ error: "Invalid AI tool data" });
    }
  });

  app.put("/api/ai-tools/:id", async (req, res) => {
    try {
      const validatedData = insertAIToolSchema.partial().parse(req.body);
      const tool = await storage.updateAITool(req.params.id, validatedData);
      if (!tool) {
        return res.status(404).json({ error: "AI tool not found" });
      }
      res.json(tool);
    } catch (error) {
      res.status(400).json({ error: "Invalid AI tool data" });
    }
  });

  app.delete("/api/ai-tools/:id", async (req, res) => {
    try {
      const success = await storage.deleteAITool(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "AI tool not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete AI tool" });
    }
  });

  // Bulk import AI tools
  app.post("/api/ai-tools/import", async (req, res) => {
    try {
      const { tools } = req.body;
      if (!Array.isArray(tools)) {
        return res.status(400).json({ error: "Tools must be an array" });
      }
      
      const results = await storage.bulkCreateAITools(tools);
      res.json({ 
        message: `Successfully imported ${results.length} AI tools`,
        imported: results.length 
      });
    } catch (error) {
      console.error("Import error:", error);
      res.status(500).json({ error: "Failed to import AI tools" });
    }
  });

  // Bulk import AI tools from Excel
  app.post("/api/ai-tools/import-excel", async (req, res) => {
    try {
      console.log('Starting AI tools import from Excel...');
      await importAIToolsFromExcel();
      res.json({ 
        message: "Successfully imported AI tools from Excel file",
        success: true
      });
    } catch (error) {
      console.error("Excel import error:", error);
      res.status(500).json({ 
        error: "Failed to import AI tools from Excel",
        message: error.message
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
