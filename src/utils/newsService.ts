// Mock API endpoints for development
// In a real application, these would be actual API endpoints or Supabase Edge Functions

export const processWithOpenAI = async (query: string, apiKey: string) => {
  // Mock OpenAI processing for demo purposes
  // In production, this would call OpenAI API to understand intent
  
  const lowercaseQuery = query.toLowerCase();
  
  // Simple intent recognition based on keywords
  let category = 'general';
  let searchQuery = '';
  
  if (lowercaseQuery.includes('business') || lowercaseQuery.includes('finance') || lowercaseQuery.includes('economy')) {
    category = 'business';
  } else if (lowercaseQuery.includes('sport') || lowercaseQuery.includes('football') || lowercaseQuery.includes('basketball')) {
    category = 'sports';
  } else if (lowercaseQuery.includes('tech') || lowercaseQuery.includes('technology') || lowercaseQuery.includes('ai')) {
    category = 'technology';
  } else if (lowercaseQuery.includes('health') || lowercaseQuery.includes('medical')) {
    category = 'health';
  } else if (lowercaseQuery.includes('science')) {
    category = 'science';
  } else if (lowercaseQuery.includes('entertainment') || lowercaseQuery.includes('celebrity')) {
    category = 'entertainment';
  }
  
  // Extract specific search terms
  const searchTerms = ['covid', 'election', 'climate', 'bitcoin', 'ai', 'ukraine', 'nasa'];
  for (const term of searchTerms) {
    if (lowercaseQuery.includes(term)) {
      searchQuery = term;
      break;
    }
  }
  
  return {
    category,
    query: searchQuery,
    intent: `User wants ${category} news${searchQuery ? ` about ${searchQuery}` : ''}`,
  };
};

export const generateSpeech = async (text: string, apiKey: string): Promise<Blob> => {
  // Mock ElevenLabs API call
  // In production, this would call ElevenLabs API
  
  // For demo purposes, we'll use browser's built-in speech synthesis
  // and return a mock blob
  return new Promise((resolve) => {
    // Create a simple audio buffer for demo
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const buffer = audioContext.createBuffer(1, 44100, 44100);
    
    // Fill with silence for demo
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < channelData.length; i++) {
      channelData[i] = 0;
    }
    
    // Convert to blob
    const arrayBuffer = new ArrayBuffer(channelData.length * 2);
    const view = new Int16Array(arrayBuffer);
    
    for (let i = 0; i < channelData.length; i++) {
      view[i] = channelData[i] * 0x7FFF;
    }
    
    const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
    resolve(blob);
  });
};