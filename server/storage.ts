import { 
  type Product, type InsertProduct, 
  type Transaction, type InsertTransaction,
  type FeatureCategory, type InsertFeatureCategory,
  type Feature, type InsertFeature,
  type FeatureRequest, type InsertFeatureRequest,
  products, transactions, featureCategories, features, featureRequests
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  
  // Transactions
  getTransactions(): Promise<Transaction[]>;
  getTransaction(id: string): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransactionStatus(id: string, status: string): Promise<Transaction | undefined>;

  // Feature Categories
  getFeatureCategories(): Promise<FeatureCategory[]>;
  getFeatureCategory(id: string): Promise<FeatureCategory | undefined>;
  createFeatureCategory(category: InsertFeatureCategory): Promise<FeatureCategory>;
  updateFeatureCategory(id: string, category: Partial<InsertFeatureCategory>): Promise<FeatureCategory | undefined>;
  deleteFeatureCategory(id: string): Promise<boolean>;

  // Features
  getFeatures(categoryId?: string): Promise<Feature[]>;
  getFeature(id: string): Promise<Feature | undefined>;
  createFeature(feature: InsertFeature): Promise<Feature>;
  updateFeature(id: string, feature: Partial<InsertFeature>): Promise<Feature | undefined>;
  deleteFeature(id: string): Promise<boolean>;

  // Feature Requests
  getFeatureRequests(): Promise<FeatureRequest[]>;
  getFeatureRequest(id: string): Promise<FeatureRequest | undefined>;
  createFeatureRequest(request: InsertFeatureRequest): Promise<FeatureRequest>;
  updateFeatureRequest(id: string, request: Partial<InsertFeatureRequest>): Promise<FeatureRequest | undefined>;
  deleteFeatureRequest(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private transactions: Map<string, Transaction>;
  private featureCategories: Map<string, FeatureCategory>;
  private features: Map<string, Feature>;
  private featureRequests: Map<string, FeatureRequest>;

  constructor() {
    this.products = new Map();
    this.transactions = new Map();
    this.featureCategories = new Map();
    this.features = new Map();
    this.featureRequests = new Map();
    this.initializeDefaultProducts();
    this.initializeFeatureCatalog();
  }

  private initializeDefaultProducts() {
    const defaultProducts: Product[] = [
      {
        id: "1",
        name: "Cloud Server Pro",
        description: "เซิร์ฟเวอร์คลาวด์ประสิทธิภาพสูง 4 CPU, 8GB RAM",
        price: 1299,
        category: "server",
        icon: "fas fa-server",
        color: "from-blue-500 to-blue-600",
        active: 1,
        createdAt: new Date(),
      },
      {
        id: "2",
        name: "Database Premium",
        description: "ฐานข้อมูลความเร็วสูง SSD 100GB พร้อม Backup",
        price: 899,
        category: "database",
        icon: "fas fa-database",
        color: "from-green-500 to-green-600",
        active: 1,
        createdAt: new Date(),
      },
      {
        id: "3",
        name: "Security Suite",
        description: "ระบบรักษาความปลอดภัยและ SSL Certificate",
        price: 599,
        category: "security",
        icon: "fas fa-shield-alt",
        color: "from-purple-500 to-purple-600",
        active: 1,
        createdAt: new Date(),
      },
      {
        id: "4",
        name: "CDN Accelerator",
        description: "เร่งความเร็วเว็บไซต์ด้วย Global CDN",
        price: 399,
        category: "cdn",
        icon: "fas fa-rocket",
        color: "from-orange-500 to-orange-600",
        active: 1,
        createdAt: new Date(),
      },
    ];

    defaultProducts.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.active === 1);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      ...insertProduct,
      id,
      active: insertProduct.active ?? 1,
      createdAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updateProduct: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updated = { ...product, ...updateProduct };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async getTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getTransaction(id: string): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const now = new Date();
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      status: insertTransaction.status ?? "pending",
      createdAt: now,
      updatedAt: now,
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransactionStatus(id: string, status: string): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;

    const updated = { ...transaction, status, updatedAt: new Date() };
    this.transactions.set(id, updated);
    return updated;
  }

  // Feature Categories implementation
  async getFeatureCategories(): Promise<FeatureCategory[]> {
    return Array.from(this.featureCategories.values())
      .filter(c => c.active === 1)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async getFeatureCategory(id: string): Promise<FeatureCategory | undefined> {
    return this.featureCategories.get(id);
  }

  async createFeatureCategory(insertCategory: InsertFeatureCategory): Promise<FeatureCategory> {
    const id = randomUUID();
    const category: FeatureCategory = {
      ...insertCategory,
      id,
      active: insertCategory.active ?? 1,
      sortOrder: insertCategory.sortOrder ?? 0,
      createdAt: new Date(),
    };
    this.featureCategories.set(id, category);
    return category;
  }

  async updateFeatureCategory(id: string, updateCategory: Partial<InsertFeatureCategory>): Promise<FeatureCategory | undefined> {
    const category = this.featureCategories.get(id);
    if (!category) return undefined;

    const updated = { ...category, ...updateCategory };
    this.featureCategories.set(id, updated);
    return updated;
  }

  async deleteFeatureCategory(id: string): Promise<boolean> {
    return this.featureCategories.delete(id);
  }

  // Features implementation
  async getFeatures(categoryId?: string): Promise<Feature[]> {
    const features = Array.from(this.features.values()).filter(f => f.active === 1);
    if (categoryId) {
      return features.filter(f => f.categoryId === categoryId);
    }
    return features.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getFeature(id: string): Promise<Feature | undefined> {
    return this.features.get(id);
  }

  async createFeature(insertFeature: InsertFeature): Promise<Feature> {
    const id = randomUUID();
    const now = new Date();
    const feature: Feature = {
      ...insertFeature,
      id,
      active: insertFeature.active ?? 1,
      status: insertFeature.status ?? "planned",
      createdAt: now,
      updatedAt: now,
    };
    this.features.set(id, feature);
    return feature;
  }

  async updateFeature(id: string, updateFeature: Partial<InsertFeature>): Promise<Feature | undefined> {
    const feature = this.features.get(id);
    if (!feature) return undefined;

    const updated = { ...feature, ...updateFeature, updatedAt: new Date() };
    this.features.set(id, updated);
    return updated;
  }

  async deleteFeature(id: string): Promise<boolean> {
    return this.features.delete(id);
  }

  // Feature Requests implementation
  async getFeatureRequests(): Promise<FeatureRequest[]> {
    return Array.from(this.featureRequests.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getFeatureRequest(id: string): Promise<FeatureRequest | undefined> {
    return this.featureRequests.get(id);
  }

  async createFeatureRequest(insertRequest: InsertFeatureRequest): Promise<FeatureRequest> {
    const id = randomUUID();
    const now = new Date();
    const request: FeatureRequest = {
      ...insertRequest,
      id,
      featureId: insertRequest.featureId ?? null,
      status: insertRequest.status ?? "pending",
      createdAt: now,
      updatedAt: now,
    };
    this.featureRequests.set(id, request);
    return request;
  }

  async updateFeatureRequest(id: string, updateRequest: Partial<InsertFeatureRequest>): Promise<FeatureRequest | undefined> {
    const request = this.featureRequests.get(id);
    if (!request) return undefined;

    const updated = { ...request, ...updateRequest, updatedAt: new Date() };
    this.featureRequests.set(id, updated);
    return updated;
  }

  async deleteFeatureRequest(id: string): Promise<boolean> {
    return this.featureRequests.delete(id);
  }

  private initializeFeatureCatalog() {
    // Initialize 20 main categories
    const categories: FeatureCategory[] = [
      {
        id: "cat-1",
        name: "ระบบจัดการผู้ใช้และความปลอดภัย",
        description: "ระบบจัดการบัญชี, สิทธิ์, การล็อกอิน 2FA, Biometric",
        icon: "fas fa-users-cog",
        color: "from-blue-500 to-blue-600",
        sortOrder: 1,
        active: 1,
        createdAt: new Date(),
      },
      {
        id: "cat-2", 
        name: "ระบบแจ้งเตือนและจัดการเวลา",
        description: "Push Notification, Email, SMS, การตั้งเวลาส่ง",
        icon: "fas fa-bell",
        color: "from-yellow-500 to-yellow-600",
        sortOrder: 2,
        active: 1,
        createdAt: new Date(),
      },
      {
        id: "cat-3",
        name: "ระบบจัดการไฟล์และสื่อ",
        description: "อัปโหลด, แปลงไฟล์, บีบอัด, แปลงภาพ, OCR",
        icon: "fas fa-file-alt",
        color: "from-green-500 to-green-600",
        sortOrder: 3,
        active: 1,
        createdAt: new Date(),
      },
      {
        id: "cat-4",
        name: "ปัญญาประดิษฐ์และการประมวลผลภาษา",
        description: "Chatbot AI, NLP, วิเคราะห์ความรู้สึก, แปลภาษา",
        icon: "fas fa-robot",
        color: "from-purple-500 to-purple-600",
        sortOrder: 4,
        active: 1,
        createdAt: new Date(),
      },
      {
        id: "cat-5",
        name: "ระบบวิเคราะห์ข้อมูลและรายงาน",
        description: "Dashboard, สถิติแบบเรียลไทม์, Alert, การแสดงผล",
        icon: "fas fa-chart-line",
        color: "from-indigo-500 to-indigo-600",
        sortOrder: 5,
        active: 1,
        createdAt: new Date(),
      }
    ];

    categories.forEach(category => {
      this.featureCategories.set(category.id, category);
    });

    // Initialize sample features for each category
    const sampleFeatures: Feature[] = [
      {
        id: "feat-1",
        categoryId: "cat-1",
        name: "ระบบล็อกอินด้วย Biometric",
        description: "ระบบยืนยันตัวตนด้วยลายนิ้วมือ หรือ Face ID สำหรับความปลอดภัยสูง",
        codeExample: `// Biometric Authentication
const authenticateUser = async () => {
  const supported = await LocalAuthentication.hasHardwareAsync();
  if (supported) {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'ยืนยันตัวตน',
      biometryType: LocalAuthentication.AuthenticationType.FINGERPRINT
    });
    return result.success;
  }
  return false;
};`,
        difficulty: "intermediate",
        estimatedHours: 24,
        technologies: ["React Native", "Expo", "Biometrics API"],
        price: 15000,
        status: "planned",
        priority: "high",
        tags: ["security", "mobile", "authentication"],
        active: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "feat-2",
        categoryId: "cat-2",
        name: "ระบบแจ้งเตือนแบบ Smart",
        description: "ระบบแจ้งเตือนที่เรียนรู้พฤติกรรมผู้ใช้และส่งในเวลาที่เหมาะสม",
        codeExample: `// Smart Notification System
class SmartNotificationEngine {
  constructor() {
    this.userPreferences = new Map();
    this.mlModel = new NotificationTimingModel();
  }
  
  async scheduleOptimalNotification(userId, message, urgency) {
    const userPattern = await this.getUserActivityPattern(userId);
    const optimalTime = this.mlModel.predictBestTime(userPattern, urgency);
    
    return this.scheduleNotification(userId, message, optimalTime);
  }
}`,
        difficulty: "advanced",
        estimatedHours: 40,
        technologies: ["Node.js", "Machine Learning", "Firebase", "WebSocket"],
        price: 25000,
        status: "in_progress",
        priority: "medium",
        tags: ["ai", "notification", "machine-learning"],
        active: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "feat-3",
        categoryId: "cat-3",
        name: "ระบบแปลงไฟล์อัตโนมัติ",
        description: "แปลงไฟล์หลากหลายรูปแบบ PDF, Word, Excel, รูปภาพ ด้วย AI",
        codeExample: `// File Conversion Service
const convertFile = async (inputFile, targetFormat) => {
  const converter = new UniversalConverter();
  
  try {
    const result = await converter.convert({
      input: inputFile,
      output: targetFormat,
      quality: 'high',
      aiEnhancement: true
    });
    
    return {
      success: true,
      outputFile: result.file,
      metadata: result.info
    };
  } catch (error) {
    throw new ConversionError(error.message);
  }
};`,
        difficulty: "intermediate",
        estimatedHours: 32,
        technologies: ["Node.js", "FFmpeg", "ImageMagick", "LibreOffice"],
        price: 20000,
        status: "completed",
        priority: "medium",
        tags: ["file-processing", "conversion", "automation"],
        active: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    sampleFeatures.forEach(feature => {
      this.features.set(feature.id, feature);
    });
  }
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.active, 1));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async updateProduct(id: string, updateProduct: Partial<InsertProduct>): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set(updateProduct)
      .where(eq(products.id, id))
      .returning();
    return product || undefined;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount > 0;
  }

  // Transactions
  async getTransactions(): Promise<Transaction[]> {
    return await db.select().from(transactions);
  }

  async getTransaction(id: string): Promise<Transaction | undefined> {
    const [transaction] = await db.select().from(transactions).where(eq(transactions.id, id));
    return transaction || undefined;
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values(insertTransaction)
      .returning();
    return transaction;
  }

  async updateTransactionStatus(id: string, status: string): Promise<Transaction | undefined> {
    const [transaction] = await db
      .update(transactions)
      .set({ status, updatedAt: new Date() })
      .where(eq(transactions.id, id))
      .returning();
    return transaction || undefined;
  }

  // Feature Categories
  async getFeatureCategories(): Promise<FeatureCategory[]> {
    return await db.select().from(featureCategories).where(eq(featureCategories.active, 1));
  }

  async getFeatureCategory(id: string): Promise<FeatureCategory | undefined> {
    const [category] = await db.select().from(featureCategories).where(eq(featureCategories.id, id));
    return category || undefined;
  }

  async createFeatureCategory(insertCategory: InsertFeatureCategory): Promise<FeatureCategory> {
    const [category] = await db
      .insert(featureCategories)
      .values(insertCategory)
      .returning();
    return category;
  }

  async updateFeatureCategory(id: string, updateCategory: Partial<InsertFeatureCategory>): Promise<FeatureCategory | undefined> {
    const [category] = await db
      .update(featureCategories)
      .set(updateCategory)
      .where(eq(featureCategories.id, id))
      .returning();
    return category || undefined;
  }

  async deleteFeatureCategory(id: string): Promise<boolean> {
    const result = await db.delete(featureCategories).where(eq(featureCategories.id, id));
    return result.rowCount > 0;
  }

  // Features
  async getFeatures(categoryId?: string): Promise<Feature[]> {
    if (categoryId) {
      return await db.select().from(features)
        .where(eq(features.categoryId, categoryId));
    }
    return await db.select().from(features).where(eq(features.active, 1));
  }

  async getFeature(id: string): Promise<Feature | undefined> {
    const [feature] = await db.select().from(features).where(eq(features.id, id));
    return feature || undefined;
  }

  async createFeature(insertFeature: InsertFeature): Promise<Feature> {
    const [feature] = await db
      .insert(features)
      .values(insertFeature)
      .returning();
    return feature;
  }

  async updateFeature(id: string, updateFeature: Partial<InsertFeature>): Promise<Feature | undefined> {
    const [feature] = await db
      .update(features)
      .set({ ...updateFeature, updatedAt: new Date() })
      .where(eq(features.id, id))
      .returning();
    return feature || undefined;
  }

  async deleteFeature(id: string): Promise<boolean> {
    const result = await db.delete(features).where(eq(features.id, id));
    return result.rowCount > 0;
  }

  // Feature Requests
  async getFeatureRequests(): Promise<FeatureRequest[]> {
    return await db.select().from(featureRequests);
  }

  async getFeatureRequest(id: string): Promise<FeatureRequest | undefined> {
    const [request] = await db.select().from(featureRequests).where(eq(featureRequests.id, id));
    return request || undefined;
  }

  async createFeatureRequest(insertRequest: InsertFeatureRequest): Promise<FeatureRequest> {
    const [request] = await db
      .insert(featureRequests)
      .values(insertRequest)
      .returning();
    return request;
  }

  async updateFeatureRequest(id: string, updateRequest: Partial<InsertFeatureRequest>): Promise<FeatureRequest | undefined> {
    const [request] = await db
      .update(featureRequests)
      .set({ ...updateRequest, updatedAt: new Date() })
      .where(eq(featureRequests.id, id))
      .returning();
    return request || undefined;
  }

  async deleteFeatureRequest(id: string): Promise<boolean> {
    const result = await db.delete(featureRequests).where(eq(featureRequests.id, id));
    return result.rowCount > 0;
  }
}

// Use DatabaseStorage instead of MemStorage
export const storage = new DatabaseStorage();
