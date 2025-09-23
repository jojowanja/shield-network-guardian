import React, { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceWelcomeProps {
  onComplete?: () => void;
}

export const VoiceWelcome: React.FC<VoiceWelcomeProps> = ({ onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const playWelcomeMessage = async () => {
    // Check if we've already played on this session
    if (hasPlayed || sessionStorage.getItem('welcome-played')) {
      return;
    }

    try {
      setIsPlaying(true);
      
      // Create audio using Web Speech API
      const utterance = new SpeechSynthesisUtterance(
        "Update complete. Welcome to Shield Network Guardian. Your network protection is now active."
      );
      
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        setIsPlaying(false);
        setHasPlayed(true);
        sessionStorage.setItem('welcome-played', 'true');
        onComplete?.();
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setHasPlayed(true);
      };

      // Small delay to ensure page is loaded
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 1000);

    } catch (error) {
      console.log('Voice synthesis not available');
      setIsPlaying(false);
      setHasPlayed(true);
    }
  };

  useEffect(() => {
    // Only play once per session and after a short delay
    const timer = setTimeout(() => {
      playWelcomeMessage();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isPlaying) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center space-x-2 bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg shadow-lg animate-fade-in">
      <Shield className="w-5 h-5 animate-pulse" />
      <span className="text-sm font-medium">Shield Guardian Activated</span>
    </div>
  );
};