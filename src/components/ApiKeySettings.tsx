import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, ExternalLink, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ApiKeys } from '@/types';

interface ApiKeySettingsProps {
  apiKeys: ApiKeys;
  onApiKeysChange: (keys: ApiKeys) => void;
  onClose: () => void;
}

export const ApiKeySettings = ({ apiKeys, onApiKeysChange, onClose }: ApiKeySettingsProps) => {
  const [showKeys, setShowKeys] = useState({
    newsApi: false,
    openai: false,
    elevenlabs: false,
  });

  const [localKeys, setLocalKeys] = useState(apiKeys);

  const handleSave = () => {
    onApiKeysChange(localKeys);
    onClose();
  };

  const toggleVisibility = (key: keyof typeof showKeys) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateKey = (key: keyof ApiKeys, value: string) => {
    setLocalKeys(prev => ({ ...prev, [key]: value }));
  };

  const hasAllKeys = localKeys.newsApi && localKeys.openai && localKeys.elevenlabs;

  return (
    <Card className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-foreground">API Configuration</h3>
        <p className="text-sm text-muted-foreground">
          Enter your API keys to enable voice news functionality
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Your API keys are stored locally in your browser and never sent to our servers. 
          For production use, consider using Supabase Edge Functions to securely store secrets.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {/* NewsAPI Key */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="newsapi">NewsAPI Key</Label>
            <a
              href="https://newsapi.org/register"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
            >
              Get API Key <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <div className="relative">
            <Input
              id="newsapi"
              type={showKeys.newsApi ? "text" : "password"}
              value={localKeys.newsApi}
              onChange={(e) => updateKey('newsApi', e.target.value)}
              placeholder="Enter your NewsAPI key"
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => toggleVisibility('newsApi')}
            >
              {showKeys.newsApi ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* OpenAI Key */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="openai">OpenAI API Key</Label>
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
            >
              Get API Key <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <div className="relative">
            <Input
              id="openai"
              type={showKeys.openai ? "text" : "password"}
              value={localKeys.openai}
              onChange={(e) => updateKey('openai', e.target.value)}
              placeholder="Enter your OpenAI API key"
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => toggleVisibility('openai')}
            >
              {showKeys.openai ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* ElevenLabs Key */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="elevenlabs">ElevenLabs API Key</Label>
            <a
              href="https://elevenlabs.io/app/settings/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
            >
              Get API Key <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <div className="relative">
            <Input
              id="elevenlabs"
              type={showKeys.elevenlabs ? "text" : "password"}
              value={localKeys.elevenlabs}
              onChange={(e) => updateKey('elevenlabs', e.target.value)}
              placeholder="Enter your ElevenLabs API key"
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => toggleVisibility('elevenlabs')}
            >
              {showKeys.elevenlabs ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={!hasAllKeys} className="flex-1">
          {hasAllKeys ? 'Start Voice News' : 'Enter All API Keys'}
        </Button>
        {hasAllKeys && (
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
      </div>
    </Card>
  );
};