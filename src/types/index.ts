export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

export interface ApiKeys {
  newsApi: string;
  openai: string;
  elevenlabs: string;
}