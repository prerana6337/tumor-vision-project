import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { VoiceInterface } from '@/components/VoiceInterface';
import { NewsDisplay } from '@/components/NewsDisplay';
import { ApiKeySettings } from '@/components/ApiKeySettings';
import { useToast } from '@/hooks/use-toast';
import { NewsArticle, ApiKeys } from '@/types';

const Index = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    newsApi: '',
    openai: '',
    elevenlabs: ''
  });
  const [showSettings, setShowSettings] = useState(true);
  const { toast } = useToast();

  // Check if all API keys are provided
  const hasAllKeys = apiKeys.newsApi && apiKeys.openai && apiKeys.elevenlabs;

  useEffect(() => {
    if (hasAllKeys) {
      setShowSettings(false);
    }
  }, [hasAllKeys]);

  const handleVoiceQuery = async (query: string) => {
    setIsProcessing(true);
    setTranscript(query);
    
    try {
      // Process with OpenAI to understand intent and extract news category
      const intent = await processWithOpenAI(query);
      
      // Fetch news based on intent
      const newsData = await fetchNews(intent.category, intent.query);
      setNews(newsData);
      
      // Generate audio response
      const response = generateNewsResponse(newsData, intent.category);
      await speakText(response);
      
      toast({
        title: "News Retrieved",
        description: `Found ${newsData.length} articles about ${intent.category}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processWithOpenAI = async (query: string) => {
    // Simple intent recognition for demo
    const lowercaseQuery = query.toLowerCase();
    let category = 'general';
    
    if (lowercaseQuery.includes('business') || lowercaseQuery.includes('finance')) {
      category = 'business';
    } else if (lowercaseQuery.includes('sport') || lowercaseQuery.includes('football')) {
      category = 'sports';
    } else if (lowercaseQuery.includes('tech') || lowercaseQuery.includes('technology')) {
      category = 'technology';
    } else if (lowercaseQuery.includes('health') || lowercaseQuery.includes('medical')) {
      category = 'health';
    }
    
    return { category, query: '', intent: `User wants ${category} news` };
  };

  const fetchNews = async (category: string, searchQuery?: string): Promise<NewsArticle[]> => {
    // Mock news data for demo purposes
    const mockNews: NewsArticle[] = [
      {
        title: `Breaking: Latest ${category} development shakes industry`,
        description: `A significant development in the ${category} sector has emerged today, with experts calling it a game-changer for the industry.`,
        url: 'https://example.com/news1',
        publishedAt: new Date().toISOString(),
        source: { name: 'News Source' }
      },
      {
        title: `${category.charAt(0).toUpperCase() + category.slice(1)} market sees unprecedented growth`,
        description: `Market analysts report surprising growth in the ${category} sector, exceeding all previous forecasts.`,
        url: 'https://example.com/news2',
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        source: { name: 'Market Times' }
      },
      {
        title: `Innovation in ${category}: What experts are saying`,
        description: `Leading experts weigh in on the latest innovations and trends shaping the ${category} landscape.`,
        url: 'https://example.com/news3',
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        source: { name: 'Tech Today' }
      }
    ];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockNews;
  };

  const generateNewsResponse = (articles: NewsArticle[], category: string): string => {
    if (articles.length === 0) {
      return `I couldn't find any ${category} news at the moment. Please try again later.`;
    }

    const headlines = articles.slice(0, 3).map(article => article.title).join('. ');
    return `Here are the top ${category} headlines: ${headlines}`;
  };

  const speakText = async (text: string) => {
    setIsSpeaking(true);
    
    try {
      // Use browser's built-in speech synthesis for demo
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Speech synthesis failed:', error);
      setIsSpeaking(false);
    }
  };

  if (showSettings || !hasAllKeys) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                🎙️ Voice News Assistant
              </h2>
              <p className="text-muted-foreground">
                Configure your API keys to start using the voice news interface
              </p>
            </div>
            <ApiKeySettings 
              apiKeys={apiKeys}
              onApiKeysChange={setApiKeys}
              onClose={() => hasAllKeys && setShowSettings(false)}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onSettingsClick={() => setShowSettings(true)} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              🎙️ Voice-Powered News Assistant
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ask for news using your voice and get instant audio responses. 
              Try saying "Tell me today's business news" or "What's happening in sports?"
            </p>
          </div>

          {/* Voice Interface */}
          <VoiceInterface
            isListening={isListening}
            isSpeaking={isSpeaking}
            isProcessing={isProcessing}
            transcript={transcript}
            onVoiceQuery={handleVoiceQuery}
            onListeningChange={setIsListening}
          />

          {/* News Display */}
          {news.length > 0 && (
            <div className="animate-fade-in">
              <NewsDisplay articles={news} />
            </div>
          )}

          {/* Features Section */}
          {news.length === 0 && !isProcessing && (
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center p-6 bg-card rounded-lg border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-lg">🎤</span>
                </div>
                <h3 className="font-semibold mb-2">Voice Commands</h3>
                <p className="text-sm text-muted-foreground">
                  Speak naturally: "Business news", "Sports updates", "Tech headlines"
                </p>
              </div>
              
              <div className="text-center p-6 bg-card rounded-lg border">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-accent font-bold text-lg">🧠</span>
                </div>
                <h3 className="font-semibold mb-2">AI Processing</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced AI understands your intent and finds relevant news
                </p>
              </div>
              
              <div className="text-center p-6 bg-card rounded-lg border">
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-warning font-bold text-lg">🔊</span>
                </div>
                <h3 className="font-semibold mb-2">Audio Response</h3>
                <p className="text-sm text-muted-foreground">
                  High-quality text-to-speech reads headlines aloud
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;