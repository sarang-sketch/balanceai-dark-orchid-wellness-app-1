"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Brain, Send, Camera, Image as ImageIcon, Mic, Paperclip, Sparkles, Bot, User } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  image?: string;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your BalanceAI wellness assistant. I'm here to help you with nutrition advice, fitness tips, mental health support, and more. How can I assist you today?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showImageScanner, setShowImageScanner] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { text: "Track my meal", icon: "🍎" },
    { text: "Log exercise", icon: "💪" },
    { text: "Mood check-in", icon: "😊" },
    { text: "Sleep analysis", icon: "😴" },
    { text: "Stress relief tips", icon: "🧘" },
    { text: "Healthy recipes", icon: "🥗" }
  ];

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("stress") || lowerMessage.includes("anxious") || lowerMessage.includes("anxiety")) {
      return "I understand you're feeling stressed. Here are some quick techniques:\n\n1. Deep breathing: Try the 4-7-8 technique (inhale 4s, hold 7s, exhale 8s)\n2. Progressive muscle relaxation\n3. Take a short walk outside\n4. Listen to calming music\n\nWould you like me to guide you through a 5-minute meditation?";
    }
    
    if (lowerMessage.includes("sleep") || lowerMessage.includes("insomnia")) {
      return "Good sleep is crucial for wellness! Here are my recommendations:\n\n✓ Maintain a consistent sleep schedule\n✓ Create a relaxing bedtime routine\n✓ Limit screen time 1 hour before bed\n✓ Keep your bedroom cool (65-68°F)\n✓ Try our guided sleep meditation\n\nYour average sleep time this week is 7.2 hours. Would you like personalized sleep improvement tips?";
    }
    
    if (lowerMessage.includes("food") || lowerMessage.includes("meal") || lowerMessage.includes("eat") || lowerMessage.includes("nutrition")) {
      return "Great question about nutrition! For optimal wellness, focus on:\n\n🥗 Whole foods and vegetables\n🥑 Healthy fats (avocado, nuts, olive oil)\n🐟 Lean proteins (fish, chicken, legumes)\n💧 Stay hydrated (8+ glasses of water)\n\nWould you like me to analyze a photo of your meal for nutritional insights? Just click the camera icon!";
    }
    
    if (lowerMessage.includes("exercise") || lowerMessage.includes("workout") || lowerMessage.includes("fitness")) {
      return "Let's get moving! Based on your fitness level, I recommend:\n\n🏃 Cardio: 150 min/week moderate activity\n💪 Strength: 2-3 sessions per week\n🧘 Flexibility: Daily stretching\n\nYou've completed 3 workouts this week - you're doing great! Want to see your personalized exercise plan?";
    }
    
    if (lowerMessage.includes("water") || lowerMessage.includes("hydration") || lowerMessage.includes("drink")) {
      return "Hydration is key! 💧\n\nYou've had 5 glasses today - 3 more to reach your goal!\n\nBenefits of proper hydration:\n✓ Better energy levels\n✓ Improved focus\n✓ Healthier skin\n✓ Better digestion\n\nI can send you reminders throughout the day. Would you like that?";
    }
    
    if (lowerMessage.includes("weight") || lowerMessage.includes("lose")) {
      return "Healthy weight management is about sustainable habits, not quick fixes.\n\nKey principles:\n📊 Track your calories mindfully\n🍽️ Practice portion control\n⏰ Eat regularly (don't skip meals)\n🚶 Stay active daily\n😴 Get adequate sleep\n\nYour current trend shows a healthy progress of 0.5 lbs/week. Keep up the great work!";
    }
    
    if (lowerMessage.includes("mood") || lowerMessage.includes("feeling") || lowerMessage.includes("happy") || lowerMessage.includes("sad")) {
      return "Thank you for sharing how you're feeling. Emotional wellness is just as important as physical health.\n\n🌟 Your mood score this week: 7.8/10\n📈 Trend: Improving\n\nActivities that boost your mood:\n✓ Spend time with loved ones\n✓ Exercise releases endorphins\n✓ Practice gratitude journaling\n✓ Get sunlight exposure\n\nWould you like to do a mood journaling session now?";
    }
    
    return "I'm here to help with your wellness journey! I can assist with:\n\n🥗 Nutrition & meal planning\n💪 Fitness & exercise guidance\n😴 Sleep optimization\n🧠 Mental health support\n💧 Hydration tracking\n📊 Progress analysis\n\nFeel free to ask me anything or upload a photo for food/health analysis!";
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputValue),
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    setInputValue(action);
    handleSendMessage();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        
        const userMessage: Message = {
          id: Date.now().toString(),
          text: "Please analyze this image",
          sender: "user",
          timestamp: new Date(),
          image: imageUrl
        };

        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);

        setTimeout(() => {
          const botResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: "📸 Image Analysis Complete!\n\n🥗 Detected Food: Grilled chicken salad with mixed greens\n\nNutritional Estimate:\n• Calories: ~320 kcal\n• Protein: 35g\n• Carbs: 12g\n• Fats: 15g\n• Fiber: 4g\n\n✅ Great choice! This is a balanced, healthy meal high in protein and low in calories. Perfect for your wellness goals!\n\n💡 Tip: Add some healthy fats like avocado or nuts for better satiety.",
            sender: "bot",
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botResponse]);
          setIsTyping(false);
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--orchid-neon)]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-[var(--orchid-neon)] animate-pulse-glow" />
              <span className="text-xl font-bold neon-text">BalanceAI</span>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-[var(--dark-orchid)] to-[var(--orchid-neon)] hover:opacity-90">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-4 neon-border">
              <Sparkles className="w-5 h-5 text-[var(--orchid-neon)]" />
              <span className="text-sm font-bold text-[var(--orchid-neon)]">AI-Powered Assistant</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 neon-text">Chat with BalanceAI</h1>
            <p className="text-gray-400">Your personal wellness companion, available 24/7</p>
          </motion.div>

          {/* Chat Container */}
          <Card className="glass rounded-3xl overflow-hidden neon-border">
            {/* Messages Area */}
            <div className="h-[500px] overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex gap-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      {/* Avatar */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === "bot" 
                          ? "bg-gradient-to-br from-[var(--dark-orchid)] to-[var(--orchid-neon)]" 
                          : "bg-gray-700"
                      }`}>
                        {message.sender === "bot" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                      </div>

                      {/* Message Bubble */}
                      <div>
                        <div className={`rounded-2xl p-4 ${
                          message.sender === "bot" 
                            ? "glass-light" 
                            : "bg-gradient-to-br from-[var(--dark-orchid)] to-[var(--orchid-neon)]"
                        }`}>
                          {message.image && (
                            <img 
                              src={message.image} 
                              alt="Uploaded" 
                              className="rounded-xl mb-2 max-w-full h-auto"
                            />
                          )}
                          <p className="text-sm whitespace-pre-line">{message.text}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 px-2">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--dark-orchid)] to-[var(--orchid-neon)] flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="glass-light rounded-2xl p-4">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-[var(--orchid-neon)] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-[var(--orchid-neon)] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 bg-[var(--orchid-neon)] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-6 py-4 border-t border-[var(--orchid-neon)]/20">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action.text)}
                    className="border-[var(--orchid-neon)]/50 hover:bg-[var(--orchid-neon)]/20 whitespace-nowrap"
                  >
                    <span className="mr-2">{action.icon}</span>
                    {action.text}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-[var(--orchid-neon)]/20">
              <div className="flex gap-3 items-end">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-[var(--orchid-neon)]/50 hover:bg-[var(--orchid-neon)]/20 flex-shrink-0"
                >
                  <Camera className="w-5 h-5" />
                </Button>

                <div className="flex-1 glass-light rounded-2xl px-4 py-3">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask me anything about your wellness..."
                    className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                  />
                </div>

                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="bg-gradient-to-r from-[var(--dark-orchid)] to-[var(--orchid-neon)] hover:opacity-90 flex-shrink-0"
                  size="icon"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>

              <p className="text-xs text-gray-500 mt-3 text-center">
                💡 Tip: Upload a food image for instant nutritional analysis
              </p>
            </div>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <Card className="glass rounded-2xl p-4 text-center">
              <ImageIcon className="w-8 h-8 text-[var(--orchid-neon)] mx-auto mb-2" />
              <h3 className="font-bold mb-1">Food Scanner</h3>
              <p className="text-xs text-gray-400">Analyze meals instantly</p>
            </Card>
            <Card className="glass rounded-2xl p-4 text-center">
              <Sparkles className="w-8 h-8 text-[var(--orchid-neon)] mx-auto mb-2" />
              <h3 className="font-bold mb-1">AI Insights</h3>
              <p className="text-xs text-gray-400">Personalized recommendations</p>
            </Card>
            <Card className="glass rounded-2xl p-4 text-center">
              <Brain className="w-8 h-8 text-[var(--orchid-neon)] mx-auto mb-2" />
              <h3 className="font-bold mb-1">24/7 Support</h3>
              <p className="text-xs text-gray-400">Always here to help</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}