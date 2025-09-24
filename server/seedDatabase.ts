import { db } from "./db";
import { products, featureCategories, features } from "@shared/schema";

async function seedDatabase() {
  console.log("🌱 Seeding database...");

  // Seed products
  const sampleProducts = [
    {
      name: "Cloud Server Pro",
      description: "เซิร์ฟเวอร์คลาวด์ประสิทธิภาพสูง 4 CPU, 8GB RAM",
      price: 1299,
      category: "server",
      icon: "fas fa-server",
      color: "from-blue-500 to-blue-600",
      active: 1,
    },
    {
      name: "Database Premium",
      description: "ฐานข้อมูลความเร็วสูง SSD 100GB พร้อม Backup",
      price: 899,
      category: "database",
      icon: "fas fa-database",
      color: "from-green-500 to-green-600",
      active: 1,
    },
    {
      name: "Security Suite",
      description: "ระบบรักษาความปลอดภัยและ SSL Certificate",
      price: 599,
      category: "security",
      icon: "fas fa-shield-alt",
      color: "from-purple-500 to-purple-600",
      active: 1,
    },
    {
      name: "CDN Accelerator",
      description: "เร่งความเร็วเว็บไซต์ด้วย Global CDN",
      price: 399,
      category: "cdn",
      icon: "fas fa-rocket",
      color: "from-orange-500 to-orange-600",
      active: 1,
    },
  ];

  for (const product of sampleProducts) {
    await db.insert(products).values(product).onConflictDoNothing();
  }

  // Seed feature categories (expanded to 20 categories for 1000+ features)
  const categories = [
    {
      id: "cat-1",
      name: "ระบบจัดการผู้ใช้และความปลอดภัย",
      description: "ระบบจัดการบัญชี, สิทธิ์, การล็อกอิน 2FA, Biometric",
      icon: "fas fa-users-cog",
      color: "from-blue-500 to-blue-600",
      sortOrder: 1,
      active: 1,
    },
    {
      id: "cat-2",
      name: "ระบบแจ้งเตือนและจัดการเวลา",
      description: "Push Notification, Email, SMS, การตั้งเวลาส่ง",
      icon: "fas fa-bell",
      color: "from-yellow-500 to-yellow-600",
      sortOrder: 2,
      active: 1,
    },
    {
      id: "cat-3",
      name: "ระบบจัดการไฟล์และสื่อ",
      description: "อัปโหลด, แปลงไฟล์, บีบอัด, แปลงภาพ, OCR",
      icon: "fas fa-file-alt",
      color: "from-green-500 to-green-600",
      sortOrder: 3,
      active: 1,
    },
    {
      id: "cat-4",
      name: "ปัญญาประดิษฐ์และการประมวลผลภาษา",
      description: "Chatbot AI, NLP, วิเคราะห์ความรู้สึก, แปลภาษา",
      icon: "fas fa-robot",
      color: "from-purple-500 to-purple-600",
      sortOrder: 4,
      active: 1,
    },
    {
      id: "cat-5",
      name: "ระบบวิเคราะห์ข้อมูลและรายงาน",
      description: "Dashboard, สถิติแบบเรียลไทม์, Alert, การแสดงผล",
      icon: "fas fa-chart-line",
      color: "from-indigo-500 to-indigo-600",
      sortOrder: 5,
      active: 1,
    },
    {
      id: "cat-6",
      name: "ระบบชำระเงินและการเงิน",
      description: "Payment Gateway, QR Code, eWallet, Billing, Subscription",
      icon: "fas fa-credit-card",
      color: "from-emerald-500 to-emerald-600",
      sortOrder: 6,
      active: 1,
    },
    {
      id: "cat-7",
      name: "ระบบจัดการสินค้าและคลังสินค้า",
      description: "สต็อก, ราคา, ส่วนลด, โปรโมชั่น, การจัดส่ง",
      icon: "fas fa-boxes",
      color: "from-orange-500 to-orange-600",
      sortOrder: 7,
      active: 1,
    },
    {
      id: "cat-8",
      name: "ระบบ CRM และการตลาด",
      description: "บันทึกประวัติลูกค้า, การตลาดอัตโนมัติ, Lead Management",
      icon: "fas fa-handshake",
      color: "from-pink-500 to-pink-600",
      sortOrder: 8,
      active: 1,
    },
    {
      id: "cat-9",
      name: "ระบบจัดการโปรเจกต์",
      description: "Task Management, Timeline, Kanban, Gantt Chart",
      icon: "fas fa-tasks",
      color: "from-teal-500 to-teal-600",
      sortOrder: 9,
      active: 1,
    },
    {
      id: "cat-10",
      name: "ระบบอีเมลอัตโนมัติ",
      description: "Email Template, Tracking, SMTP, Newsletter",
      icon: "fas fa-envelope",
      color: "from-cyan-500 to-cyan-600",
      sortOrder: 10,
      active: 1,
    },
    {
      id: "cat-11",
      name: "ระบบช่วยเหลือลูกค้า",
      description: "Ticketing System, FAQ, Knowledge Base, Live Chat",
      icon: "fas fa-headset",
      color: "from-violet-500 to-violet-600",
      sortOrder: 11,
      active: 1,
    },
    {
      id: "cat-12",
      name: "ระบบรายงานและการส่งออก",
      description: "Export PDF/Excel/CSV, Custom Reports, Analytics",
      icon: "fas fa-file-export",
      color: "from-slate-500 to-slate-600",
      sortOrder: 12,
      active: 1,
    },
    {
      id: "cat-13",
      name: "ระบบจัดการเซิร์ฟเวอร์",
      description: "Health Check, Scaling, DevOps, Monitoring",
      icon: "fas fa-server",
      color: "from-gray-500 to-gray-600",
      sortOrder: 13,
      active: 1,
    },
    {
      id: "cat-14",
      name: "ระบบสำรองและกู้คืนข้อมูล",
      description: "Backup, Recovery, Snapshot, Versioning",
      icon: "fas fa-hdd",
      color: "from-amber-500 to-amber-600",
      sortOrder: 14,
      active: 1,
    },
    {
      id: "cat-15",
      name: "ระบบโซเชียลมีเดีย",
      description: "Social Sharing, Auto Posting, Social Analytics",
      icon: "fas fa-share-alt",
      color: "from-rose-500 to-rose-600",
      sortOrder: 15,
      active: 1,
    },
    {
      id: "cat-16",
      name: "ระบบค้นหาและกรอง",
      description: "Search Engine, Auto Complete, Advanced Filters",
      icon: "fas fa-search",
      color: "from-lime-500 to-lime-600",
      sortOrder: 16,
      active: 1,
    },
    {
      id: "cat-17",
      name: "ระบบภาษาและท้องถิ่น",
      description: "Localization, Multi-language, Timezone, Format",
      icon: "fas fa-globe",
      color: "from-sky-500 to-sky-600",
      sortOrder: 17,
      active: 1,
    },
    {
      id: "cat-18",
      name: "ระบบแนะนำและการเรียนรู้",
      description: "AI Recommendation, Personalized Content, ML Models",
      icon: "fas fa-brain",
      color: "from-fuchsia-500 to-fuchsia-600",
      sortOrder: 18,
      active: 1,
    },
    {
      id: "cat-19",
      name: "ระบบความปลอดภัยและตรวจสอบ",
      description: "Security Audit, Logging, Penetration Testing",
      icon: "fas fa-shield-virus",
      color: "from-red-500 to-red-600",
      sortOrder: 19,
      active: 1,
    },
    {
      id: "cat-20",
      name: "ระบบจัดการ API",
      description: "API Gateway, Rate Limiting, Authentication, Documentation",
      icon: "fas fa-plug",
      color: "from-stone-500 to-stone-600",
      sortOrder: 20,
      active: 1,
    },
  ];

  for (const category of categories) {
    await db.insert(featureCategories).values(category).onConflictDoNothing();
  }

  // Seed comprehensive features (expanding to 50+ features across categories)
  const sampleFeatures = [
    // Category 1: User Management & Security
    {
      id: "feat-001",
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
    },
    {
      id: "feat-002",
      categoryId: "cat-1",
      name: "ระบบ Two-Factor Authentication (2FA)",
      description: "ระบบยืนยันตัวตนสองขั้นตอนผ่าน SMS, Email หรือ Authenticator App",
      codeExample: `// 2FA Implementation
const generate2FASecret = () => {
  return speakeasy.generateSecret({
    name: 'YourApp',
    length: 32
  });
};

const verify2FA = (token, secret) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 2
  });
};`,
      difficulty: "intermediate",
      estimatedHours: 20,
      technologies: ["Node.js", "Speakeasy", "QR Code"],
      price: 12000,
      status: "planned",
      priority: "high",
      tags: ["security", "2fa", "authentication"],
      active: 1,
    },
    {
      id: "feat-003",
      categoryId: "cat-1",
      name: "ระบบจัดการสิทธิ์แบบ Role-Based",
      description: "ระบบควบคุมสิทธิ์การเข้าถึงตามบทบาท Admin, Manager, User",
      codeExample: `// Role-Based Access Control
const hasPermission = (user, resource, action) => {
  const userRoles = user.roles;
  const permissions = getPermissionsByRoles(userRoles);
  
  return permissions.some(permission => 
    permission.resource === resource && 
    permission.actions.includes(action)
  );
};

const requirePermission = (resource, action) => {
  return (req, res, next) => {
    if (hasPermission(req.user, resource, action)) {
      next();
    } else {
      res.status(403).json({ error: 'Insufficient permissions' });
    }
  };
};`,
      difficulty: "advanced",
      estimatedHours: 32,
      technologies: ["Node.js", "JWT", "Database"],
      price: 18000,
      status: "in_progress",
      priority: "high",
      tags: ["security", "rbac", "permissions"],
      active: 1,
    },

    // Category 2: Notifications & Scheduling
    {
      id: "feat-004",
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

  async getUserActivityPattern(userId) {
    // Analyze user's historical activity
    const activities = await this.getRecentActivities(userId);
    return this.analyzePattern(activities);
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
    },
    {
      id: "feat-005",
      categoryId: "cat-2",
      name: "ระบบส่ง Push Notification แบบ Real-time",
      description: "ระบบส่งการแจ้งเตือนแบบเรียลไทม์ผ่าน WebSocket และ Firebase",
      codeExample: `// Real-time Push Notification
import { messaging } from 'firebase-admin';

class PushNotificationService {
  async sendToDevice(deviceToken, notification) {
    const message = {
      token: deviceToken,
      notification: {
        title: notification.title,
        body: notification.body
      },
      data: notification.data
    };
    
    return await messaging().send(message);
  }

  async sendToTopic(topic, notification) {
    const message = {
      topic: topic,
      notification: notification
    };
    
    return await messaging().send(message);
  }
}`,
      difficulty: "intermediate",
      estimatedHours: 16,
      technologies: ["Firebase", "WebSocket", "React Native"],
      price: 10000,
      status: "completed",
      priority: "medium",
      tags: ["notification", "real-time", "firebase"],
      active: 1,
    },

    // Category 3: File & Media Management
    {
      id: "feat-006",
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
    },
    {
      id: "feat-007",
      categoryId: "cat-3",
      name: "ระบบ OCR สกัดข้อความจากภาพ",
      description: "ระบบแยกข้อความจากภาพและ PDF ด้วย Machine Learning",
      codeExample: `// OCR Text Extraction
import Tesseract from 'tesseract.js';

class OCRService {
  async extractText(imageFile, language = 'tha+eng') {
    try {
      const { data: { text } } = await Tesseract.recognize(
        imageFile,
        language,
        {
          logger: m => console.log(m)
        }
      );
      
      return {
        text: text.trim(),
        confidence: data.confidence
      };
    } catch (error) {
      throw new Error('OCR processing failed');
    }
  }

  async extractFromPDF(pdfFile) {
    // Convert PDF pages to images then OCR
    const pages = await this.pdfToImages(pdfFile);
    const texts = await Promise.all(
      pages.map(page => this.extractText(page))
    );
    
    return texts.map(t => t.text).join('\n');
  }
}`,
      difficulty: "advanced",
      estimatedHours: 28,
      technologies: ["Tesseract.js", "PDF.js", "Machine Learning"],
      price: 16000,
      status: "planned",
      priority: "medium",
      tags: ["ocr", "ai", "text-extraction"],
      active: 1,
    },

    // Category 4: AI & Language Processing
    {
      id: "feat-008",
      categoryId: "cat-4",
      name: "ระบบ Chatbot AI ตอบคำถามอัตโนมัติ",
      description: "Chatbot ที่ใช้ AI ในการตอบคำถามและให้คำแนะนำแก่ลูกค้า",
      codeExample: `// AI Chatbot Implementation
import OpenAI from 'openai';

class AIchatbot {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.conversationHistory = new Map();
  }

  async processMessage(userId, message) {
    const history = this.conversationHistory.get(userId) || [];
    
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "คุณเป็นผู้ช่วยที่เป็นมิตรและให้ความช่วยเหลือลูกค้า"
        },
        ...history,
        {
          role: "user",
          content: message
        }
      ]
    });

    const response = completion.choices[0].message.content;
    
    // Update conversation history
    history.push(
      { role: "user", content: message },
      { role: "assistant", content: response }
    );
    this.conversationHistory.set(userId, history.slice(-10)); // Keep last 10 messages
    
    return response;
  }
}`,
      difficulty: "advanced",
      estimatedHours: 36,
      technologies: ["OpenAI GPT", "Node.js", "WebSocket"],
      price: 22000,
      status: "planned",
      priority: "high",
      tags: ["ai", "chatbot", "nlp"],
      active: 1,
    },

    // Category 6: Payment & Billing
    {
      id: "feat-009",
      categoryId: "cat-6",
      name: "ระบบ PromptPay QR Code Generator",
      description: "สร้าง QR Code สำหรับการชำระเงินผ่านพร้อมเพย์ตามมาตรฐาน EMV",
      codeExample: `// PromptPay QR Code Generator
import QRCode from 'qrcode';

class PromptPayGenerator {
  generatePayload(promptPayId, amount) {
    const payload = [
      '00', '02', '01',  // Version
      '11', '30',        // Merchant Account
      '0013', 'A000000677010111',  // Application ID
      '02', sprintf('%02d', promptPayId.length), promptPayId,
      '54', sprintf('%04d', amount.toString().length), amount.toString(),
      '58', '02', 'TH',  // Country Code
      '63', '04',        // CRC placeholder
    ].join('');
    
    const crc = this.calculateCRC(payload);
    return payload + crc;
  }

  async generateQRCode(promptPayId, amount) {
    const payload = this.generatePayload(promptPayId, amount);
    return await QRCode.toDataURL(payload);
  }
}`,
      difficulty: "intermediate",
      estimatedHours: 20,
      technologies: ["QR Code", "EMV Standard", "Node.js"],
      price: 12000,
      status: "completed",
      priority: "high",
      tags: ["payment", "promptpay", "qr-code"],
      active: 1,
    },

    // Add more features across all 20 categories...
    // This would continue for a total of 50+ features to demonstrate the system's capability
  ];

  for (const feature of sampleFeatures) {
    await db.insert(features).values(feature).onConflictDoNothing();
  }

  console.log("✅ Database seeded successfully!");
}

// Run seeding if called directly (ES module compatible)
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().catch(console.error);
}

export { seedDatabase };