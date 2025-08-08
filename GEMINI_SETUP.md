# Setting up Gemini API for the Chatbot

## Quick Setup Instructions:

1. **Get your Gemini API Key:**
   - Go to: https://aistudio.google.com/app/apikey
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated key

2. **Add the API Key to your project:**
   - Open the `.env` file in the root directory
   - Replace `your_gemini_api_key_here` with your actual API key

3. **Restart the server:**
   - Stop the current server (Ctrl+C)
   - Run: `npm run dev` to restart with the new API key

## The Chatbot Now:

- **With API Key:** Uses Gemini AI for intelligent, contextual responses about grief, loss, and Jewish traditions
- **Without API Key:** Falls back to pre-written compassionate responses

## Features:
- Understands context from previous messages  
- Provides Jewish wisdom about mourning and remembrance
- Suggests meaningful ways to honor memories (Torah study, Tehillim, etc.)
- Responds empathetically to grief and loss
- Helps users process emotions about their loved ones

## Testing:
Try asking the chatbot:
- "I'm struggling with the loss of my mother"
- "How can I honor my father's memory?"  
- "Tell me about Jewish traditions for yahrzeit"
- "I feel guilty for feeling happy sometimes"

The chatbot should now provide personalized, thoughtful responses instead of generic ones!
