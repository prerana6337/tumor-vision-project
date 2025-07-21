import { Brain, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface PredictionData {
  category: string;
  confidence: number;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'none';
}

interface PredictionResultsProps {
  predictions: PredictionData[];
  topPrediction: PredictionData;
}

export const PredictionResults = ({ predictions, topPrediction }: PredictionResultsProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      case 'none': return 'accent';
      default: return 'secondary';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <TrendingUp className="h-4 w-4" />;
      case 'low': return <Brain className="h-4 w-4" />;
      case 'none': return <CheckCircle2 className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Prediction */}
      <Card className="border-2 border-primary/20 shadow-medical">
        <CardHeader className="bg-medical-gradient text-white rounded-t-lg">
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6" />
            <span>Primary Diagnosis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-foreground">{topPrediction.category}</h3>
              <p className="text-muted-foreground">{topPrediction.description}</p>
            </div>
            <Badge 
              variant={getSeverityColor(topPrediction.severity) as any}
              className="flex items-center space-x-1"
            >
              {getSeverityIcon(topPrediction.severity)}
              <span>{Math.round(topPrediction.confidence)}% confidence</span>
            </Badge>
          </div>
          <Progress 
            value={topPrediction.confidence} 
            className="h-3"
          />
        </CardContent>
      </Card>

      {/* All Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Classification Probabilities</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {predictions.map((prediction, index) => (
              <div 
                key={prediction.category}
                className={`
                  p-4 rounded-lg border transition-all animate-slide-up
                  ${index === 0 ? 'border-primary/30 bg-primary/5' : 'border-border bg-card'}
                `}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getSeverityIcon(prediction.severity)}
                    <span className="font-medium text-foreground">{prediction.category}</span>
                  </div>
                  <span className="font-semibold text-foreground">
                    {Math.round(prediction.confidence)}%
                  </span>
                </div>
                <Progress 
                  value={prediction.confidence} 
                  className="h-2 mb-2"
                />
                <p className="text-xs text-muted-foreground">{prediction.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Medical Disclaimer */}
      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="p-4">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">Medical Disclaimer</p>
              <p className="text-muted-foreground">
                This is a demonstration of AI-based image classification technology. 
                Results should not be used for actual medical diagnosis. Always consult 
                qualified healthcare professionals for medical advice and diagnosis.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};