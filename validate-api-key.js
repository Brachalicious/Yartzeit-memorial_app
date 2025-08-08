// Simple API key validation test
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

async function validateAPIKey() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('🔑 Testing API Key:', apiKey ? `${apiKey.substring(0, 15)}...` : 'Not found');
  
  if (!apiKey) {
    console.log('❌ No API key found in .env file');
    return;
  }
  
  // Test with a simple list models request
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    console.log('📡 Making request to list models...');
    const response = await fetch(url);
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers));
    
    const data = await response.text();
    console.log('📄 Raw response (first 500 chars):', data.substring(0, 500));
    
    if (response.ok) {
      console.log('✅ API key is valid!');
      try {
        const jsonData = JSON.parse(data);
        if (jsonData.models) {
          console.log('📋 Available models:');
          jsonData.models.forEach(model => {
            console.log(`  - ${model.name}`);
          });
        }
      } catch (e) {
        console.log('⚠️ Could not parse JSON response');
      }
    } else {
      console.log('❌ API key validation failed');
    }
    
  } catch (error) {
    console.log('💥 Request failed:', error.message);
  }
}

validateAPIKey();
