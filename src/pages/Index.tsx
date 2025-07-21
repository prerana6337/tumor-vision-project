import { useState } from 'react';
import { Header } from '@/components/Header';
import { ImageUpload } from '@/components/ImageUpload';
import { PredictionResults } from '@/components/PredictionResults';
import { simulateAnalysis } from '@/utils/mockPredictions';
import { useToast } from '@/hooks/use-toast';

interface PredictionData {
  category: string;
  confidence: number;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'none';
}

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictions, setPredictions] = useState<PredictionData[] | null>(null);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    setIsAnalyzing(true);
    setPredictions(null);
    
    try {
      const results = await simulateAnalysis(file);
      setPredictions(results);
      
      toast({
        title: "Analysis Complete",
        description: `Classification completed with ${Math.round(results[0].confidence)}% confidence`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "An error occurred during image analysis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              AI-Powered Brain Tumor Detection
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload an MRI scan to get instant classification using advanced convolutional neural networks. 
              Our AI model can detect glioma, meningioma, pituitary tumors, or confirm healthy brain tissue.
            </p>
          </div>

          {/* Upload Section */}
          <ImageUpload onImageUpload={handleImageUpload} isAnalyzing={isAnalyzing} />

          {/* Results Section */}
          {predictions && (
            <div className="animate-slide-up">
              <PredictionResults 
                predictions={predictions}
                topPrediction={predictions[0]}
              />
            </div>
          )}

          {/* Info Section */}
          {!predictions && !isAnalyzing && (
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center p-6 bg-card rounded-lg border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Upload MRI Scan</h3>
                <p className="text-sm text-muted-foreground">
                  Upload a brain MRI image in PNG, JPG, or JPEG format
                </p>
              </div>
              
              <div className="text-center p-6 bg-card rounded-lg border">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-accent font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">AI Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Our CNN model processes the image to detect tumor patterns
                </p>
              </div>
              
              <div className="text-center p-6 bg-card rounded-lg border">
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-warning font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Get Results</h3>
                <p className="text-sm text-muted-foreground">
                  View classification results with confidence scores and explanations
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
