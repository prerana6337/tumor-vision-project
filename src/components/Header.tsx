import { Brain, Activity, Stethoscope } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Brain className="h-10 w-10 text-primary" />
              <Activity className="h-4 w-4 text-accent absolute -bottom-1 -right-1" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">NeuroScan AI</h1>
              <p className="text-sm text-muted-foreground">Brain Tumor MRI Classification</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Stethoscope className="h-4 w-4" />
              <span className="text-xs">Medical AI Demo</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};