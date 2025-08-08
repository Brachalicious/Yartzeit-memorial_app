import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { generateComfortingResponse, detectEmotion } from '../services/neshamaBot.js';
const router = express.Router();
// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: (req, file, cb) => {
        // Allow images, videos, and audio files
        const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi|mp3|wav|m4a|ogg/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            cb(new Error('Only image, video, and audio files are allowed'));
        }
    }
});
// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});
// Helper function to convert file to base64
async function fileToBase64(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    return fileBuffer.toString('base64');
}
// Helper function to analyze file content
async function analyzeFile(filePath, filename) {
    const ext = path.extname(filename).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
        return `Image file: ${filename}. This appears to be a photograph or image that may contain meaningful visual memories.`;
    }
    else if (['.mp4', '.mov', '.avi'].includes(ext)) {
        return `Video file: ${filename}. This is a video recording that likely contains precious visual and audio memories.`;
    }
    else if (['.mp3', '.wav', '.m4a', '.ogg'].includes(ext)) {
        return `Audio file: ${filename}. This is an audio recording that may contain voices, music, or sounds with emotional significance.`;
    }
    return `File: ${filename}. Uploaded content for discussion.`;
}
// Enhanced chat endpoint for comfort and grief support with multiple AI providers and file analysis
router.post('/', upload.fields([
    { name: 'files', maxCount: 10 },
    { name: 'audio', maxCount: 1 }
]), async (req, res) => {
    const { message, context, relationship, aiProvider = 'gemini' } = req.body;
    try {
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        // Process uploaded files
        let fileAnalysis = '';
        const uploadedFiles = req.files;
        if (uploadedFiles) {
            const analyses = [];
            // Process regular files
            if (uploadedFiles.files) {
                for (const file of uploadedFiles.files) {
                    const analysis = await analyzeFile(file.path, file.originalname);
                    analyses.push(analysis);
                    // For images, we can add them to OpenAI vision API later
                    if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(path.extname(file.originalname).toLowerCase())) {
                        // Mark as image for potential vision analysis
                        analyses[analyses.length - 1] += ' (Image content available for visual analysis)';
                    }
                }
            }
            // Process audio files
            if (uploadedFiles.audio) {
                for (const audioFile of uploadedFiles.audio) {
                    const analysis = await analyzeFile(audioFile.path, audioFile.originalname);
                    analyses.push(analysis);
                }
            }
            if (analyses.length > 0) {
                fileAnalysis = `\n\nUploaded Content Analysis:\n${analyses.join('\n')}`;
            }
        }
        // Check if the selected AI provider's API key is configured
        if (aiProvider === 'openai') {
            if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
                return res.status(500).json({ error: 'OpenAI API key not configured' });
            }
        }
        else if (aiProvider === 'gemini') {
            if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
                return res.status(500).json({ error: 'Gemini API key not configured' });
            }
        }
        // Get model based on selected AI provider
        let aiResponse;
        let responseSource;
        if (aiProvider === 'openai') {
            // OpenAI ChatGPT Implementation
            const systemPrompt = `You are a deeply compassionate grief counselor and spiritual guide for a Yahrzeit memorial app dedicated to the memory of Chaya Sara Leah bat Uri. You combine professional grief counseling with Jewish spiritual wisdom.

Your role is to:
- Provide comprehensive, heartfelt support for grief, loss, and mourning
- Share detailed Jewish wisdom, stories, and teachings about remembrance and honoring loved ones
- Help users deeply process complex emotions about their departed loved ones
- Offer specific, meaningful ways to honor memories (learning specific Torah portions, particular Tehillim chapters, detailed acts of kindness)
- Integrate Jewish traditions around mourning, yahrzeit observance, and the soul's journey
- Provide comfort while honestly acknowledging the profound reality of loss
- Share relevant Jewish stories, parables, or teachings that relate to their situation
- Offer practical spiritual guidance for different stages of grief

Response Guidelines:
- Write responses that are substantial (4-6 meaningful paragraphs, 300+ words)
- Always lead with deep empathy and emotional validation
- Include specific Jewish concepts, stories, or teachings (neshamah, olam haba, zechut, tzaddik, kaddish, etc.)
- Suggest very specific, actionable ways to honor memories with detailed explanations
- Reference particular Tehillim chapters, Torah portions, or Jewish practices with context
- Share wisdom from Jewish sages, Chassidic teachings, or relevant Jewish stories
- Acknowledge that grief is sacred work and a form of love
- Ask meaningful, thoughtful questions that invite deeper sharing
- Create a sense of spiritual connection and eternal bonds
- Be warm, wise, and deeply caring - like speaking with a beloved rabbi or spiritual mentor

${context && context.length > 0 ? `
Past conversation context: ${context}

CRITICAL: You must provide a NEW, UNIQUE response that is completely different from any previous responses. DO NOT repeat yourself.
` : ''}

${relationship ? `User's relationship to deceased: ${relationship}. Use this to personalize your response appropriately.` : ''}

${fileAnalysis ? `
IMPORTANT - Uploaded Content to Analyze:${fileAnalysis}

Please provide specific, thoughtful analysis of the uploaded content. If it's an image, describe what you observe and how it might relate to their memories and emotions. If it's audio or video, acknowledge the emotional significance of preserving voices and moments. Connect your analysis to Jewish concepts about memory, legacy, and the eternal nature of love.
` : ''}

Current user message: "${message}"

Respond with deep empathy, specific analysis of any uploaded content, Jewish wisdom, detailed memorial suggestions, and caring questions. Write 4-6 substantial paragraphs.`;
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message + (fileAnalysis || '') }
                ],
                temperature: 0.8,
                max_tokens: 800
            });
            aiResponse = completion.choices[0].message.content;
            responseSource = 'openai';
        }
        else {
            // Enhanced Gemini AI Implementation using NeshamaBot
            console.log('🤖 Using enhanced NeshamaBot (Gemini) for response...');
            // Detect emotion for better response
            const detectedEmotion = detectEmotion(message);
            console.log(`😊 Detected emotion: ${detectedEmotion}`);
            // Create enhanced message with context and file analysis
            const enhancedMessage = `
User's emotional state: ${detectedEmotion}
Message: ${message}
${context ? `\nConversation context: ${context}` : ''}
${fileAnalysis ? `\nUploaded content analysis: ${fileAnalysis}` : ''}
${relationship ? `\nRelationship to deceased: ${relationship}` : ''}

Please provide a deeply compassionate response using Jewish wisdom and spiritual comfort.`;
            aiResponse = await generateComfortingResponse(enhancedMessage);
            responseSource = 'gemini-neshama';
            console.log('🕯️ NeshamaBot response generated successfully');
        }
        res.json({
            message: aiResponse,
            timestamp: new Date().toISOString(),
            source: responseSource,
            aiProvider: aiProvider
        });
        // Clean up uploaded files after processing
        if (uploadedFiles) {
            const allFiles = [
                ...(uploadedFiles.files || []),
                ...(uploadedFiles.audio || [])
            ];
            allFiles.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }
    }
    catch (error) {
        console.error('AI API error:', error);
        res.status(500).json({
            error: `Failed to generate response from ${aiProvider} AI`,
            details: error.message
        });
    }
});
export default router;
