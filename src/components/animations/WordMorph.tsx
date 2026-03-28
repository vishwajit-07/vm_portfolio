'use client';

import { useState, useEffect } from 'react';

interface WordMorphProps {
  words: string[];
}

export default function WordMorph({ words }: WordMorphProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) return;

    const currentWord = words[currentWordIndex];

    const handleType = () => {
      if (!isDeleting) {
        setCurrentText(currentWord.substring(0, currentText.length + 1));

        if (currentText === currentWord) {
          if (words.length > 1) {
            setTimeout(() => setIsDeleting(true), 1000); // Wait after typing before deleting
          }
        }
      } else {
        setCurrentText(currentWord.substring(0, currentText.length - 1));

        if (currentText === '') {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    };

    const typeSpeed = isDeleting ? 40 : 100; // Type slower, delete faster
    const delay = currentText === currentWord && !isDeleting ? 2500 : typeSpeed;

    const timer = setTimeout(handleType, delay);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words]);

  // Prevent hydration jitter by ensuring we at least have a space or the first char
  return (
    <span className="inline-flex items-center">
      <span className="bg-gradient-to-r from-orange-400 via-orange-200 to-orange-500 bg-clip-text text-transparent font-bold min-h-[1.5em] leading-normal">
        {currentText || '\u00A0'}
      </span>
      <span className="ml-[2px] w-[3px] h-[1.1em] bg-orange-500/80 animate-[pulse_1s_cubic-bezier(0.4,0,0.6,1)_infinite] shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
    </span>
  );
}
