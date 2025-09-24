import { storage } from "./storage";
import type { InsertAITool } from "@shared/schema";
import * as fs from "fs";
import * as path from "path";

// Exchange rate USD to THB (you can update this or make it dynamic)
const USD_TO_THB_RATE = 35;

export async function importAIToolsFromExcel(): Promise<void> {
  try {
    console.log('Reading Excel file and converting to JSON...');
    
    // สร้าง Python script สำหรับแปลง Excel เป็น JSON
    const pythonScript = `
import pandas as pd
import json
import sys

try:
    # อ่านไฟล์ Excel
    print("Reading Excel file...")
    df = pd.read_excel('ai_tools_5000_full.xlsx')
    print(f"Found {len(df)} rows in Excel file")
    
    # แปลงเป็น JSON
    tools_data = []
    for index, row in df.iterrows():
        tool = {
            'toolId': int(row['ID']) if pd.notna(row['ID']) else 0,
            'toolName': str(row['Tool Name']) if pd.notna(row['Tool Name']) else f'Tool {index + 1}',
            'category': str(row['Category']) if pd.notna(row['Category']) else 'General',
            'description': str(row['Description']) if pd.notna(row['Description']) else 'No description available',
            'url': str(row['URL']) if pd.notna(row['URL']) and str(row['URL']).startswith('http') else None,
            'priceUSD': float(row['Price USD']) if pd.notna(row['Price USD']) and row['Price USD'] != 'N/A' else 0.0,
            'licenseType': str(row['License Type']) if pd.notna(row['License Type']) else 'Unknown'
        }
        tools_data.append(tool)
    
    # เขียนไฟล์ JSON
    with open('ai_tools_data.json', 'w', encoding='utf-8') as f:
        json.dump(tools_data, f, ensure_ascii=False, indent=2)
        
    print(f"Successfully converted {len(tools_data)} tools to JSON")
    
except Exception as e:
    print(f"Error: {str(e)}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
`;

    // เขียน Python script ลงไฟล์
    const fs = await import('fs');
    fs.writeFileSync('/app/convert_excel.py', pythonScript);
    
    // รัน Python script
    const { execSync } = require('child_process');
    execSync('cd /app && python3 convert_excel.py', { stdio: 'inherit' });
    
    // อ่าน JSON ที่สร้างขึ้น
    const jsonData = JSON.parse(fs.readFileSync('/app/ai_tools_data.json', 'utf-8'));
    
    console.log(`Loading ${jsonData.length} AI tools into database...`);
    
    // เตรียมข้อมูลสำหรับ database
    const aiToolsData: InsertAITool[] = jsonData.map((tool: any) => ({
      toolId: tool.toolId,
      toolName: tool.toolName,
      category: tool.category,
      description: tool.description,
      url: tool.url,
      priceUSD: tool.priceUSD || 0,
      priceTHB: (tool.priceUSD || 0) * USD_TO_THB_RATE,
      licenseType: tool.licenseType,
      tags: getTags(tool.category, tool.toolName, tool.description),
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // Random rating 3.0-5.0
      reviewCount: Math.floor(Math.random() * 10000) + 100,
      isPopular: Math.random() > 0.7 ? 1 : 0, // 30% chance of being popular
      isFeatured: Math.random() > 0.85 ? 1 : 0, // 15% chance of being featured
      active: 1,
    }));
    
    // Import เป็น batch เพื่อประสิทธิภาพ
    const batchSize = 50;
    let imported = 0;
    
    for (let i = 0; i < aiToolsData.length; i += batchSize) {
      const batch = aiToolsData.slice(i, i + batchSize);
      try {
        await storage.bulkCreateAITools(batch);
        imported += batch.length;
        console.log(`Imported ${imported}/${aiToolsData.length} tools...`);
      } catch (error) {
        console.error(`Error importing batch ${i}-${i + batchSize}:`, error);
        // Continue with next batch
      }
    }
    
    console.log(`Successfully imported ${imported} AI tools!`);
    
    // ลบไฟล์ temporary
    try {
      fs.unlinkSync('/app/convert_excel.py');
      fs.unlinkSync('/app/ai_tools_data.json');
    } catch (e) {
      // Ignore cleanup errors
    }
    
  } catch (error) {
    console.error('Error importing AI tools:', error);
    throw error;
  }
}

// Helper function to generate tags based on category and name
function getTags(category: string, toolName: string, description: string): string[] {
  const tags: string[] = ['AI', 'software'];
  
  // Add category-based tags
  const categoryLower = category.toLowerCase();
  if (categoryLower.includes('image')) tags.push('image', 'visual');
  if (categoryLower.includes('video')) tags.push('video', 'multimedia');
  if (categoryLower.includes('text') || categoryLower.includes('content')) tags.push('text', 'content');
  if (categoryLower.includes('code')) tags.push('coding', 'development');
  if (categoryLower.includes('conversation')) tags.push('chatbot', 'communication');
  if (categoryLower.includes('productivity')) tags.push('productivity', 'workflow');
  
  // Add tags based on tool name and description
  const combinedText = `${toolName} ${description}`.toLowerCase();
  if (combinedText.includes('chat') || combinedText.includes('bot')) tags.push('chatbot');
  if (combinedText.includes('image') || combinedText.includes('photo')) tags.push('image');
  if (combinedText.includes('text') || combinedText.includes('writing')) tags.push('text');
  if (combinedText.includes('video')) tags.push('video');
  if (combinedText.includes('audio') || combinedText.includes('voice')) tags.push('audio');
  if (combinedText.includes('code') || combinedText.includes('program')) tags.push('coding');
  if (combinedText.includes('design')) tags.push('design');
  if (combinedText.includes('market')) tags.push('marketing');
  if (combinedText.includes('analytics') || combinedText.includes('analysis')) tags.push('analytics');
  
  // Remove duplicates and limit to 5 tags
  return [...new Set(tags)].slice(0, 5);
}

// Export function for manual use
export { importAIToolsFromExcel as importAITools };