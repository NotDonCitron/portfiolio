import { useState, useEffect } from 'react';

const TypingText = ({ text, className }: { text: string, className?: string }) => {
   const [displayedText, setDisplayedText] = useState('');
   const [currentIndex, setCurrentIndex] = useState(0);
   const [showCursor, setShowCursor] = useState(true);

   useEffect(() => {
      if (currentIndex < text.length) {
         const timeout = setTimeout(() => {
            setDisplayedText(prev => prev + text[currentIndex]);
            setCurrentIndex(prev => prev + 1);
         }, 50);
         return () => clearTimeout(timeout);
      }
   }, [currentIndex, text]);

   useEffect(() => {
      const cursorInterval = setInterval(() => {
         setShowCursor(prev => !prev);
      }, 500);
      return () => clearInterval(cursorInterval);
   }, []);

   return (
      <span className={className}>
         {displayedText}
         <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
      </span>
   );
};

export default TypingText;