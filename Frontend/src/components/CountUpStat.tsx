import { useEffect, useState } from 'react';

interface CountUpStatProps {
  value: string;
  label: string;
}

export default function CountUpStat({ value, label }: CountUpStatProps) {
  const [displayValue, setDisplayValue] = useState('');

  // Initial fallback string
  const initialMatch = value.match(/^([^0-9]*)(\d+)(.*)$/);
  const initialFallback = initialMatch ? `${initialMatch[1]}1${initialMatch[3]}` : value;

  useEffect(() => {
    const match = value.match(/^([^0-9]*)(\d+)(.*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const prefix = match[1];
    const target = parseInt(match[2], 10);
    const suffix = match[3];

    let animationFrameId: number;
    const duration = 1600; // 1.6s total count-up duration
    const startTime = performance.now();
    const startValue = 1;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth deceleration curve (easeOutCubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(startValue + (target - startValue) * easeOut);

      setDisplayValue(`${prefix}${currentVal}${suffix}`);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(`${prefix}${target}${suffix}`);
      }
    };

    // Trigger count-up animation once on page load / mount
    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [value]);

  return (
    <div className="px-8 py-10 text-center select-none">
      <p className="text-3xl md:text-4xl font-bold text-sky-400 mb-1 tracking-tight">
        {displayValue || initialFallback}
      </p>
      <p className="text-xs text-gray-500 tracking-wide uppercase">{label}</p>
    </div>
  );
}
