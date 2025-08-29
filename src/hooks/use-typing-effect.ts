import { useState, useEffect } from 'react';

interface UseTypingEffectOptions {
  text: string;
  speed?: number;
  delay?: number;
}

export const useTypingEffect = ({ text, speed = 100, delay = 0 }: UseTypingEffectOptions) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(true);
      let currentIndex = 0;
      
      const typingInterval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, speed);

      return () => clearInterval(typingInterval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, speed, delay]);

  return { displayedText, isTyping };
};
