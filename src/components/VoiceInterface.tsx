import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceInterfaceProps {
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  transcript: string;
  onVoiceQuery: (query: string) => void;
  onListeningChange: (listening: boolean) => void;
}

export const VoiceInterface = ({
  isListening,
  isSpeaking,
  isProcessing,
  transcript,
  onVoiceQuery,
  onListeningChange,
}: VoiceInterfaceProps) => {
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      onListeningChange(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onVoiceQuery(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      onListeningChange(false);
      
      if (event.error === 'not-allowed') {
        toast({
          title: "Microphone Access Denied",
          description: "Please allow microphone access to use voice commands.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Speech Recognition Error",
          description: "Please try again.",
          variant: "destructive"
        });
      }
    };

    recognition.onend = () => {
      onListeningChange(false);
    };

    setRecognition(recognition);

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [onVoiceQuery, onListeningChange, toast]);

  const startListening = () => {
    if (recognition && !isListening && !isSpeaking) {
      try {
        recognition.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        toast({
          title: "Error",
          description: "Failed to start voice recognition.",
          variant: "destructive"
        });
      }
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  if (!isSupported) {
    return (
      <Card className="p-8 text-center bg-card border border-destructive/20">
        <h3 className="text-lg font-semibold text-destructive mb-2">
          Voice Recognition Not Supported
        </h3>
        <p className="text-sm text-muted-foreground">
          Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari.
        </p>
      </Card>
    );
  }

  const getStatusMessage = () => {
    if (isProcessing) return "Processing your request...";
    if (isSpeaking) return "Speaking news headlines...";
    if (isListening) return "Listening... Speak now!";
    return "Click the microphone to start";
  };

  const getStatusColor = () => {
    if (isProcessing) return "text-warning";
    if (isSpeaking) return "text-accent";
    if (isListening) return "text-primary";
    return "text-muted-foreground";
  };

  return (
    <Card className="p-8 text-center space-y-6">
      {/* Voice Button */}
      <div className="flex justify-center">
        <Button
          onClick={isListening ? stopListening : startListening}
          disabled={isSpeaking || isProcessing}
          variant={isListening ? "destructive" : "default"}
          size="lg"
          className={`w-20 h-20 rounded-full transition-all duration-300 ${
            isListening ? 'animate-pulse shadow-lg shadow-primary/50' : ''
          }`}
        >
          {isProcessing ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : isSpeaking ? (
            <Volume2 className="h-8 w-8" />
          ) : isListening ? (
            <Mic className="h-8 w-8" />
          ) : (
            <MicOff className="h-8 w-8" />
          )}
        </Button>
      </div>

      {/* Status Message */}
      <div className="space-y-2">
        <p className={`text-lg font-medium ${getStatusColor()}`}>
          {getStatusMessage()}
        </p>
        
        {transcript && (
          <div className="bg-muted/50 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-sm text-muted-foreground mb-1">You said:</p>
            <p className="text-foreground font-medium">"{transcript}"</p>
          </div>
        )}
      </div>

      {/* Example Commands */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <p className="text-sm font-medium text-foreground">"Business news"</p>
        </div>
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <p className="text-sm font-medium text-foreground">"Sports headlines"</p>
        </div>
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <p className="text-sm font-medium text-foreground">"Tech updates"</p>
        </div>
      </div>
    </Card>
  );
};