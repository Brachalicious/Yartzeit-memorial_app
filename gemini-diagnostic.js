import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = 'AIzaSyBU1vmyAaOlz7n-ayA86xratt1qecpeKvA';

console.log('🔧 Gemini API Diagnostic Tool');
console.log('🔑 Testing API Key:', API_KEY.substring(0, 20) + '...');

async function testAPI() {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    console.log('\n📋 Attempting to list available models...');
    
    // Try to list models first
    try {
      const models = await genAI.listModels();
      console.log('✅ Available models:');
      for await (const model of models) {
        console.log(`  - ${model.name}`);
      }
    } catch (listError) {
      console.log('❌ Cannot list models:', listError.message);
    }
    
    // Try different model names
    const modelsToTest = [
      'gemini-1.5-flash',
      'gemini-1.5-pro', 
      'gemini-pro',
      'models/gemini-1.5-flash',
      'models/gemini-1.5-pro',
      'models/gemini-pro'
    ];
    
    console.log('\n🤖 Testing individual models...');
    
    for (const modelName of modelsToTest) {
      try {
        console.log(`\nTesting: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Say 'Hello from " + modelName + "'");
        const response = await result.response;
        console.log(`✅ ${modelName} works! Response:`, response.text());
        break; // If one works, we're good
      } catch (error) {
        console.log(`❌ ${modelName} failed:`, error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ General API error:', error.message);
    
    if (error.message.includes('403')) {
      console.log('\n💡 403 Forbidden suggests:');
      console.log('   1. Enable the Generative AI API in Google Cloud Console');
      console.log('   2. Set up billing for the project');
      console.log('   3. Check API key restrictions');
      console.log('   4. Verify project permissions');
    }
  }
}

testAPI();
