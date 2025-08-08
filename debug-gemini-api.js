// Simple test script to check if Gemini API is working
// Run with: node debug-gemini-api.js

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testGeminiAPI() {
  console.log('🔧 Testing Gemini API connection...');
  
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.log('❌ No Gemini API key found!');
    console.log('📝 Please add your API key to the .env file');
    console.log('🌐 Get your key from: https://aistudio.google.com/app/apikey');
    return;
  }
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = "Hello, this is a test message. Please respond with a short greeting.";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini API is working!');
    console.log('🤖 Test response:', text);
    console.log('🎉 Your chatbot should now be responsive!');
    
  } catch (error) {
    console.log('❌ Gemini API error:', error.message);
    console.log('🔑 Please check your API key in the .env file');
  }
}

testGeminiAPI();
