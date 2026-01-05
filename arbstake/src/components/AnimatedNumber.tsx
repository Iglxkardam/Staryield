import React, { useState, useEffect, useRef } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  formatNumber?: boolean;
  decimals?: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ 
  value, 
  duration = 3000,
  formatNumber = true,
  decimals = 3
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  const formatCryptoNumber = (val: number): string => {
    // Format with decimals for crypto values
    const fixed = val.toFixed(decimals);
    const [whole, decimal] = fixed.split('.');
    
    // Add commas to whole number part
    let formattedWhole = whole;
    while (/(\d+)(\d{3})/.test(formattedWhole)) {
      formattedWhole = formattedWhole.replace(/(\d+)(\d{3})/, '$1,$2');
    }
    
    return decimal ? `${formattedWhole}.${decimal}` : formattedWhole;
  };

  const commaSeparateNumber = (val: number): string => {
    return formatCryptoNumber(val);
  };

  useEffect(() => {
    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      setDisplayValue(value * progress);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  return (
    <span>
      {formatNumber ? commaSeparateNumber(displayValue) : Math.floor(displayValue)}
    </span>
  );
};

export default AnimatedNumber;
