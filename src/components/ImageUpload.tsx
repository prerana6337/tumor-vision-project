import { useState, useCallback } from 'react';
import { Upload, X, Brain, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  isAnalyzing: boolean;
}

export const ImageUpload = ({ onImageUpload, isAnalyzing }: ImageUploadProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleImageSelection(imageFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (PNG, JPG, JPEG)",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleImageSelection = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    onImageUpload(file);
  };

  const clearImage = () => {
    setSelectedImage(null);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <Brain className="mx-auto h-8 w-8 text-primary mb-2" />
          <h3 className="text-lg font-semibold text-foreground">Upload MRI Scan</h3>
          <p className="text-sm text-muted-foreground">Upload a brain MRI image for tumor classification</p>
        </div>

        {selectedImage ? (
          <div className="relative">
            <img 
              src={selectedImage} 
              alt="Uploaded MRI scan" 
              className="w-full h-64 object-contain rounded-lg border bg-muted"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={clearImage}
              disabled={isAnalyzing}
            >
              <X className="h-4 w-4" />
            </Button>
            {isAnalyzing && (
              <div className="absolute inset-0 bg-background/80 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-pulse-medical">
                    <Brain className="h-8 w-8 text-primary mx-auto mb-2" />
                  </div>
                  <p className="text-sm font-medium">Analyzing scan...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
            `}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
          >
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">
              Drag and drop your MRI scan here
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse files
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageSelection(file);
              }}
              className="hidden"
              id="file-upload"
            />
            <Button asChild variant="outline">
              <label htmlFor="file-upload" className="cursor-pointer">
                Select Image
              </label>
            </Button>
          </div>
        )}

        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium">Supported formats:</p>
              <p>PNG, JPG, JPEG • Max size: 10MB</p>
              <p className="mt-1">This is a demo application. Results are for demonstration purposes only.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};