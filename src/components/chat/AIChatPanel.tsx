import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, BarChart3, TrendingUp, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatMessage } from '@/types/data';
import { cn } from '@/lib/utils';

const suggestedQueries = [
  { icon: BarChart3, text: "Show me sales trends by month" },
  { icon: TrendingUp, text: "What will Q1 2025 sales look like?" },
  { icon: Lightbulb, text: "Find anomalies in the data" },
];

const mockResponses: Record<string, string> = {
  "sales trends": `Based on your data analysis, here are the key sales trends:

📈 **Overall Trend**: Sales have shown a strong upward trajectory with 23% YoY growth

**Monthly Breakdown:**
- **Q1**: Average $35,000/month - seasonal low
- **Q2**: Average $43,000/month - recovery phase  
- **Q3**: Average $48,500/month - growth acceleration
- **Q4**: Average $57,000/month - peak season

**Key Insight**: December showed the highest performance at $62,000, driven by holiday demand in Electronics and Clothing categories.`,

  "q1 2025": `Based on historical patterns and trend analysis, here's my Q1 2025 forecast:

🔮 **Prediction Summary**:

| Month | Predicted Sales | Confidence |
|-------|----------------|------------|
| Jan 2025 | $48,000 | 92% |
| Feb 2025 | $52,000 | 88% |
| Mar 2025 | $58,000 | 85% |

**Total Q1 2025**: ~$158,000 (vs $105,000 in Q1 2024)

📊 **Growth Driver**: The upward trend is primarily driven by Electronics (+31%) and the expansion into the Western region.`,

  "anomalies": `I've detected 3 significant anomalies in your dataset:

⚠️ **Anomaly 1: March Sales Spike**
- Value: $45,000 (45% above expected)
- Likely cause: Spring promotion campaign
- Confidence: 87%

⚠️ **Anomaly 2: Electronics Q4 Surge**
- Value: +31% above trend
- Likely cause: New product launch + holiday season
- Confidence: 91%

⚠️ **Anomaly 3: Western Region Underperformance**
- Pattern: 15% below other regions in Q2
- Possible cause: Distribution issues
- Recommendation: Investigate supply chain

Would you like me to dive deeper into any of these?`,

  default: `I've analyzed your data and here's what I found:

📊 **Quick Summary:**
- Total Records: 240 rows across 6 columns
- Time Range: January - December 2024
- Key Metrics: Sales, Profit, Units

The data shows healthy growth patterns with seasonal variations. Electronics category leads with 28% of total revenue.

What specific aspect would you like me to explore?`
};

export const AIChatPanel = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm your AI data analyst. I've loaded your **Sales Data 2024** dataset with 240 records.

I can help you:
- 📊 Analyze trends and patterns
- 🔮 Generate predictions
- 🔍 Find anomalies
- 📈 Create visualizations

What would you like to explore?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('trend') || lowerQuery.includes('sales')) {
      return mockResponses['sales trends'];
    }
    if (lowerQuery.includes('q1') || lowerQuery.includes('2025') || lowerQuery.includes('predict') || lowerQuery.includes('forecast')) {
      return mockResponses['q1 2025'];
    }
    if (lowerQuery.includes('anomal') || lowerQuery.includes('unusual') || lowerQuery.includes('outlier')) {
      return mockResponses['anomalies'];
    }
    return mockResponses['default'];
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1500));

    const response = getResponse(input);
    
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages(prev => [...prev, assistantMessage]);
  };

  const handleSuggestionClick = (text: string) => {
    setInput(text);
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold">AI Data Analyst</h2>
            <p className="text-xs text-muted-foreground">Ask anything about your data</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "animate-slide-up",
              message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'
            )}
          >
            <div className="prose prose-sm prose-invert max-w-none">
              {message.content.split('\n').map((line, i) => (
                <p key={i} className={cn(
                  "text-sm leading-relaxed",
                  line.startsWith('**') && "font-semibold",
                  line.startsWith('|') && "font-mono text-xs"
                )}>
                  {line.replace(/\*\*/g, '')}
                </p>
              ))}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="chat-bubble-ai">
            <div className="typing-indicator">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {suggestedQueries.map((query, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(query.text)}
                className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <query.icon className="w-3 h-3" />
                {query.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your data..."
            className="flex-1 bg-secondary/50 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isTyping}
            variant="glow"
            size="icon"
            className="rounded-xl"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
