"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const phases = [
  { name: 'Inhala', duration: 4000 },
  { name: 'Sostén', duration: 4000 },
  { name: 'Exhala', duration: 6000 },
];

export function BreathingExercise() {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhaseIndex((prevIndex) => (prevIndex + 1) % phases.length);
    }, phases[phaseIndex].duration);

    return () => clearTimeout(timer);
  }, [phaseIndex]);

  const currentPhase = phases[phaseIndex];
  const isBreathingIn = currentPhase.name === 'Inhala' || currentPhase.name === 'Sostén';

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative flex items-center justify-center w-48 h-48">
        {/* Animated Circles */}
        <div
          className={cn(
            'absolute bg-primary/20 rounded-full transition-all duration-[4000ms] ease-in-out',
            isBreathingIn ? 'w-48 h-48' : 'w-24 h-24'
          )}
        />
        <div
          className={cn(
            'absolute bg-primary/50 rounded-full transition-all duration-[4000ms] ease-in-out',
            isBreathingIn ? 'w-32 h-32' : 'w-16 h-16'
          )}
        />
        <div
          className={cn(
            'relative w-24 h-24 bg-primary rounded-full flex items-center justify-center'
          )}
        >
          {/* Text inside the circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            {phases.map((phase, index) => (
              <span
                key={phase.name}
                className={cn(
                  'absolute text-2xl font-semibold text-primary-foreground transition-opacity duration-1000',
                  phaseIndex === index ? 'opacity-100' : 'opacity-0'
                )}
              >
                {phase.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
