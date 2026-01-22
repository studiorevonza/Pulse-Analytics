import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, BarChart3, TrendingUp, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatMessage } from '@/types/data';
import { cn } from '@/lib/utils';
import { useData } from '@/contexts/DataContext';

const suggestedQueries = [
  { icon: BarChart3, text: "Show me trends in my data" },
  { icon: TrendingUp, text: "What predictions can you make?" },
  { icon: Lightbulb, text: "Find insights in my dataset" },
];



export const AIChatPanel = () => {
  const { currentDataset, stats, insights, predictions } = useData();
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm your AI data analyst. I've loaded your **${currentDataset?.name || 'Uploaded'}** dataset with ${currentDataset?.rowCount || 0} records.

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
      // Generate trend analysis based on actual data
      const salesStat = stats.find(s => s.column.toLowerCase().includes('sales') || s.column.toLowerCase().includes('revenue')) || null;
      const profitStat = stats.find(s => s.column.toLowerCase().includes('profit')) || null;
      
      return `Based on your data analysis, here are the key trends:

📈 **Overall Analysis**: 
${salesStat ? `Sales show mean value of $${salesStat.mean?.toLocaleString()} with a range from $${salesStat.min?.toLocaleString()} to $${salesStat.max?.toLocaleString()}` : 'No sales data found'}

${currentDataset ? `**Dataset Info**: ${currentDataset.name} has ${currentDataset.rowCount} records with ${currentDataset.columns.length} columns` : 'Dataset info unavailable'}

${insights.length > 0 ? `**Key Insights**: ${insights[0].title} - ${insights[0].description}` : 'No insights generated yet'}`;
    }
    
    if (lowerQuery.includes('predict') || lowerQuery.includes('forecast') || lowerQuery.includes('q1')) {
      // Generate prediction based on actual predictions
      return `Based on historical patterns and trend analysis, here's my forecast:\n\n🔮 **Prediction Summary**: \n${predictions.length > 0 ? `Predictions available for ${predictions.map(p => p.column).join(', ')} with ${predictions[0].accuracy ? (predictions[0].accuracy * 100).toFixed(0) + '%' : 'unknown'} accuracy` : 'No predictions generated yet'}\n\n${currentDataset ? `**Dataset**: ${currentDataset.name} (${currentDataset.rowCount} records)` : 'Dataset info unavailable'}\n\n📊 **Recommendation**: Upload more data for better predictions.`;
    }
    
    if (lowerQuery.includes('anomal') || lowerQuery.includes('unusual') || lowerQuery.includes('outlier')) {
      // Generate anomaly detection based on actual insights
      return `I've analyzed your dataset for anomalies:\n\n⚠️ **Anomaly Detection Results**: \n${insights.length > 0 ? insights.slice(0, 3).map(i => `• ${i.title}: ${i.description}`).join('\n') : 'No anomalies detected or insights generated yet'}\n\n${currentDataset ? `**Dataset**: ${currentDataset.name} (${currentDataset.rowCount} records)` : 'Dataset info unavailable'}\n\nWould you like me to dive deeper into any of these?`;
    }
    
    // Default response with actual dataset info
    return `I've analyzed your dataset and here's what I found:

📊 **Dataset Summary**: 
${currentDataset ? `- Name: ${currentDataset.name}` : '- No dataset loaded'}
${currentDataset ? `- Records: ${currentDataset.rowCount}` : ''}
${currentDataset ? `- Columns: ${currentDataset.columns.length}` : ''}
${stats.length > 0 ? `- Numeric columns: ${stats.filter(s => s.type === 'number').length}` : ''}

${insights.length > 0 ? `💡 **Key Insights**: ${insights[0].title || 'No title'}` : 'Upload data to generate insights'}

What specific aspect would you like me to explore?`;
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
