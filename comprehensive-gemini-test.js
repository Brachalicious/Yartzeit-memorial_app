// Comprehensive Gemini API test script
// Tests new API key with different models and features
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testModels() {
  console.log('🔧 Comprehensive Gemini API Test');
  console.log('=================================');
  
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('🔑 Using API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'Not found');
  
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.log('❌ No valid Gemini API key found!');
    return;
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Test different models
  const modelsToTest = [
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-pro',
    'gemini-1.0-pro'
  ];
  
  for (const modelName of modelsToTest) {
    console.log(`\n🧪 Testing model: ${modelName}`);
    console.log('─'.repeat(40));
    
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const prompt = "Please provide a short Jewish blessing for studying Torah, in both Hebrew and English.";
      console.log('📤 Sending test prompt...');
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('✅ SUCCESS!');
      console.log('📝 Response length:', text.length, 'characters');
      console.log('🔤 First 100 chars:', text.substring(0, 100) + '...');
      
    } catch (error) {
      console.log('❌ FAILED:', error.message);
      if (error.status) {
        console.log('🔢 Status:', error.status);
      }
    }
  }
  
  console.log('\n🎯 Testing Chofetz Chaim Bot specific prompt...');
  console.log('─'.repeat(50));
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const chofetzChaimPrompt = `You are the Chofetz Chaim Bot, providing guidance on Shmiras HaLashon (guarding one's speech) based on the teachings of the Chofetz Chaim. Please respond to this question with warmth and specific halachic guidance:

"What should I do if I accidentally spoke lashon hara about someone?"

Please cite specific sources from the Chofetz Chaim's works when possible.`;
    
    console.log('📤 Sending Chofetz Chaim prompt...');
    
    const result = await model.generateContent(chofetzChaimPrompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Chofetz Chaim Bot test SUCCESS!');
    console.log('📝 Response preview:', text.substring(0, 200) + '...');
    
  } catch (error) {
    console.log('❌ Chofetz Chaim Bot test FAILED:', error.message);
  }
  
  console.log('\n🏁 Test completed!');
}

testModels().catch(console.error);
