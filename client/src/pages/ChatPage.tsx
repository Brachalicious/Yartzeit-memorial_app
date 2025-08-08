import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { MessageCircle, Send, Upload, Mic, Heart, Camera, FileText, Bot, Settings } from 'lucide-react';
import { ChatMessage } from '../components/chat/ChatMessage';
import { useChatbot } from '../hooks/useChatbot';
import { AIProvider } from '../types/chat';

export function ChatPage() {
  const { messages, sendMessage, isTyping, aiProvider, setAIProvider } = useChatbot();
  const [input, setInput] = React.useState('');
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordingTime, setRecordingTime] = React.useState(0);
  const [audioLevels, setAudioLevels] = React.useState<number[]>([]);
  const [recordedAudio, setRecordedAudio] = React.useState<Blob | null>(null);
  const [showSaveDialog, setShowSaveDialog] = React.useState(false);
  const [memoryToSave, setMemoryToSave] = React.useState<{files: File[], audio: Blob | null, description: string} | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const analyserRef = React.useRef<AnalyserNode | null>(null);
  const animationRef = React.useRef<number | null>(null);
  const recordingTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && selectedFiles.length === 0 && !recordedAudio) return;
    
    const messageText = input.trim() || "Please analyze this content and share your thoughts.";
    await sendMessage(messageText, selectedFiles, recordedAudio || undefined);
    
    // Clear everything after sending
    setInput('');
    setSelectedFiles([]);
    setRecordedAudio(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // Set up audio context for visualization
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      // Start timer
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Start audio level monitoring
      const updateAudioLevels = () => {
        if (analyserRef.current && isRecording) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          
          // Create 8 bars for visualization
          const bars = 8;
          const barWidth = Math.floor(dataArray.length / bars);
          const levels = [];
          
          for (let i = 0; i < bars; i++) {
            let sum = 0;
            for (let j = 0; j < barWidth; j++) {
              sum += dataArray[i * barWidth + j];
            }
            levels.push(Math.floor((sum / barWidth) / 255 * 100));
          }
          
          setAudioLevels(levels);
          animationRef.current = requestAnimationFrame(updateAudioLevels);
        }
      };
      updateAudioLevels();
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        setRecordedAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
        
        // Cleanup
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
        }
        setAudioLevels([]);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingTime(0);
    }
  };

  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveAndDiscuss = () => {
    if (selectedFiles.length > 0 || recordedAudio) {
      setMemoryToSave({
        files: selectedFiles,
        audio: recordedAudio,
        description: input || 'A memory I want to discuss'
      });
      setShowSaveDialog(true);
    }
  };

  const confirmSaveMemory = async () => {
    if (!memoryToSave) return;
    
    // Save memory with files and audio for AI analysis
    console.log('Saving memory:', memoryToSave);
    
    // Send message with files and audio for AI to analyze
    const memoryDescription = `I'd like to discuss this memory: ${memoryToSave.description}. Please analyze the uploaded content and help me process my feelings about it.`;
    await sendMessage(memoryDescription, memoryToSave.files, memoryToSave.audio || undefined);
    
    // Clear the upload state
    setSelectedFiles([]);
    setRecordedAudio(null);
    setInput('');
    setShowSaveDialog(false);
    setMemoryToSave(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const cancelSaveMemory = () => {
    setShowSaveDialog(false);
    setMemoryToSave(null);
  };

  const clearUploads = () => {
    setSelectedFiles([]);
    setRecordedAudio(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
          Comfort & Guidance
        </h1>
        <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-3">
          A caring space for your heart
        </h2>
        <p className="text-lg text-purple-600 dark:text-purple-400 italic">
          Share your feelings and find comfort in wisdom about special souls
        </p>
      </div>

      {/* Enhanced Memory Upload Section */}
      <Card className="max-w-4xl mx-auto bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Heart className="h-5 w-5 text-pink-500" />
            Share a Memory to Discuss
          </CardTitle>
          <p className="text-sm text-purple-600">
            Upload photos, videos, or record your voice to share precious memories and discuss them with our comfort companion
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Upload */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-purple-600" />
              <label className="text-sm font-medium text-purple-800">Photos & Videos</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="flex items-center gap-2 text-purple-700 border-purple-300 hover:bg-purple-50"
              >
                <Upload className="h-4 w-4" />
                Choose Files
              </Button>
              {selectedFiles.length > 0 && (
                <span className="text-sm text-purple-600">
                  {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
                </span>
              )}
            </div>
            
            {selectedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="bg-purple-100 px-3 py-1 rounded-full text-xs text-purple-700">
                    {file.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Voice Recording */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-purple-600" />
              <label className="text-sm font-medium text-purple-800">Voice Recording</label>
            </div>
            
            {/* Recording Controls */}
            <div className="flex items-center gap-3">
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  variant="outline"
                  className="flex items-center gap-2 text-purple-700 border-purple-300 hover:bg-purple-50"
                >
                  <Mic className="h-4 w-4" />
                  Record Voice
                </Button>
              ) : (
                <Button
                  onClick={stopRecording}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white"
                >
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Stop Recording
                </Button>
              )}
              {recordedAudio && !isRecording && (
                <span className="text-sm text-purple-600">Voice recording ready</span>
              )}
            </div>

            {/* Recording Visualization */}
            {isRecording && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-700 font-medium">Recording...</span>
                  </div>
                  <div className="text-red-600 font-mono text-lg">
                    {formatTime(recordingTime)}
                  </div>
                </div>
                
                {/* Sound Wave Visualization */}
                <div className="flex items-center justify-center gap-1 h-12 bg-white rounded-md p-2">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 bg-gradient-to-t from-red-400 to-red-600 rounded-full transition-all duration-100"
                      style={{
                        height: `${Math.max(4, (audioLevels[i] || 0) * 0.4 + 10)}px`,
                        opacity: audioLevels[i] ? 0.8 + (audioLevels[i] / 100) * 0.2 : 0.3
                      }}
                    />
                  ))}
                </div>
                
                <p className="text-xs text-red-600 text-center mt-2">
                  Speak clearly into your microphone
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {(selectedFiles.length > 0 || recordedAudio) && (
            <div className="flex gap-3 pt-2 border-t border-purple-200">
              <Button
                onClick={handleSaveAndDiscuss}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <MessageCircle className="h-4 w-4" />
                Save & Discuss This Memory
              </Button>
              <Button
                onClick={clearUploads}
                variant="outline"
                className="text-gray-600 border-gray-300 hover:bg-gray-50"
              >
                Clear All
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Memory Dialog */}
      {showSaveDialog && memoryToSave && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-md mx-4 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <FileText className="h-5 w-5" />
                Save This Memory
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                You're about to save and discuss this memory with our comfort companion:
              </p>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-purple-800">{memoryToSave.description}</p>
                {memoryToSave.files.length > 0 && (
                  <p className="text-xs text-purple-600 mt-1">
                    📸 {memoryToSave.files.length} file{memoryToSave.files.length > 1 ? 's' : ''}
                  </p>
                )}
                {memoryToSave.audio && (
                  <p className="text-xs text-purple-600 mt-1">🎤 Voice recording included</p>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={confirmSaveMemory}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Save & Discuss
                </Button>
                <Button
                  onClick={cancelSaveMemory}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chat Section */}
      <div className="max-w-4xl mx-auto">
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-purple-600" />
                  Comfort Companion
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  A gentle space to process grief and find comfort
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-gray-500" />
                <Select value={aiProvider} onValueChange={(value: AIProvider) => setAIProvider(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        ChatGPT
                      </div>
                    </SelectItem>
                    <SelectItem value="gemini">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        Gemini
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  Comfort Companion is typing...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your heart..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput("I'm struggling with losing my mother")}
                className="text-xs"
              >
                I'm struggling with grief
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput("Tell me about special souls")}
                className="text-xs"
              >
                Tell me about special souls
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput("How do I honor her memory?")}
                className="text-xs"
              >
                How to honor her memory
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
