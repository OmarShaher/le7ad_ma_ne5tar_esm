import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Languages, Minimize2, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchMessages as apiFetchMessages, sendChat } from "@/lib/api";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  language: 'en' | 'ar';
}

const initialMessages: Message[] = [
  {
    id: '1',
    text: 'Hello! I\'m your AI learning assistant. Feel free to ask me any questions about computer science, AI, or programming in Arabic or English.',
    isBot: true,
    timestamp: new Date(),
    language: 'en'
  },
  {
    id: '2', 
    text: 'مرحباً! أنا مساعدك الذكي للتعلم. يمكنك أن تسألني أي أسئلة حول علوم الحاسوب أو البرمجة.',
    isBot: true,
    timestamp: new Date(),
    language: 'ar'
  }
];

const suggestedQuestions = [
  { text: "What is the difference between Stack and Queue?", language: "en" },
  { text: "ما هو الفرق بين المصفوفة والقائمة المترابطة؟", language: "ar" },
  { text: "How do I prepare for coding interviews?", language: "en" },
  { text: "شرح خوارزمية البحث الثنائي", language: "ar" }
];

export function ChatbotPanel() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const serverMessages = await apiFetchMessages();
        if (!isMounted) return;
        if (serverMessages.length > 0) {
          setMessages(serverMessages);
        }
      } catch (e) {
        // Ignore and keep local initial messages
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date(),
      language: /[\u0600-\u06FF]/.test(inputText) ? 'ar' : 'en'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const { botMessage } = await sendChat(userMessage.text);
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Fallback to local simulation if server is unavailable
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: userMessage.language === 'ar' 
          ? 'شكراً لسؤالك! هذا سؤال ممتاز. دعني أوضح لك...' 
          : 'Great question! Let me explain this concept to you...',
        isBot: true,
        timestamp: new Date(),
        language: userMessage.language
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputText(question);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4">
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full w-14 h-14 bg-gradient-primary shadow-glow hover:shadow-elegant"
        >
          <Bot className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md h-[600px] flex flex-col bg-gradient-card border-0 shadow-elegant">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Tutor</CardTitle>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-level-beginner rounded-full"></div>
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Badge variant="secondary" className="text-xs">
              <Languages className="w-3 h-3 mr-1" />
              AR/EN
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(true)}
              className="h-8 w-8"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.isBot ? "justify-start" : "justify-end"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] p-3 rounded-2xl",
                    message.isBot
                      ? "bg-muted text-foreground"
                      : "bg-gradient-primary text-primary-foreground",
                    message.language === 'ar' ? "text-right" : "text-left"
                  )}
                  dir={message.language === 'ar' ? 'rtl' : 'ltr'}
                >
                  <p className="text-sm">{message.text}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    {message.isBot ? (
                      <Bot className="w-3 h-3 opacity-70" />
                    ) : (
                      <User className="w-3 h-3 opacity-70" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted p-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Suggested Questions */}
        <div className="px-4 py-2 border-t border-border">
          <div className="text-xs text-muted-foreground mb-2">Suggested questions:</div>
          <div className="flex flex-wrap gap-1">
            {suggestedQuestions.slice(0, 2).map((question, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="text-xs h-6 px-2 text-muted-foreground hover:text-foreground"
                onClick={() => handleSuggestedQuestion(question.text)}
              >
                {question.text.slice(0, 25)}...
              </Button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex space-x-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a question in Arabic or English..."
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              className="bg-gradient-primary hover:opacity-90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}