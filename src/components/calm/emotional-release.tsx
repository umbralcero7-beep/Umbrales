'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

export function EmotionalRelease() {
  const [text, setText] = useState('');
  const [isReleasing, setIsReleasing] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  const handleRelease = () => {
    if (text.trim() === '') return;
    setIsReleasing(true);
    setShowParticles(true);

    // After a short delay, reset the state
    setTimeout(() => {
      setText('');
      setIsReleasing(false);
      setShowParticles(false);
    }, 2500); // This duration should be longer than the particle animation
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-4 min-h-[300px] overflow-hidden">
      <CardHeader className="text-center mb-4">
        <CardTitle className="font-headline text-xl">Libera lo que Pesa</CardTitle>
        <CardDescription>
          Escribe lo que te preocupa y déjalo ir. Este espacio es solo para ti.
        </CardDescription>
      </CardHeader>
      
      <div className="w-full max-w-md relative">
        {showParticles && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* More particles for a stronger effect */}
            {Array.from({ length: 100 }).map((_, i) => (
              <div
                key={i}
                className="disintegration-particle"
                style={{
                  '--d': `${Math.random() * 2 + 0.5}s`,
                  '--x': `${(Math.random() - 0.5) * 400}px`,
                  '--y': `${(Math.random() - 0.5) * 400}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        )}

        <Textarea
          placeholder="¿Qué tienes en mente?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={cn(
            'min-h-[150px] w-full transition-all duration-1000 ease-in-out',
            isReleasing ? 'opacity-0 scale-90 blur-sm' : 'opacity-100 scale-100 blur-0'
          )}
          disabled={isReleasing}
        />
      </div>

      <Button onClick={handleRelease} disabled={isReleasing || !text.trim()} className="mt-4">
        <Sparkles className="mr-2 h-4 w-4" />
        Soltar y Transformar
      </Button>
    </div>
  );
}
