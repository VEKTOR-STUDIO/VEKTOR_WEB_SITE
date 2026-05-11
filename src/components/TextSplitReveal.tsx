import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const TextSplitReveal: React.FC<{ text: string; className?: string; as?: React.ElementType }> = ({ 
  text, 
  className = "", 
  as: Component = "h2" 
}) => {
  const containerRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      const chars = containerRef.current?.querySelectorAll('.char');
      if (!chars || chars.length === 0) return;
      
      gsap.fromTo(chars, 
        { opacity: 0, y: 40, rotateX: -45 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          stagger: 0.02,
          duration: 0.8,
          ease: "power4.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
          }
        }
      );
    }, containerRef);
    
    return () => ctx.revert();
  }, [text]);

  const words = text.split(" ").map((word, wordIndex) => (
    <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em]">
      {word.split("").map((char, charIndex) => (
        <span key={charIndex} className="char inline-block opacity-0">
          {char}
        </span>
      ))}
    </span>
  ));

  return React.createElement(
    Component as React.ElementType,
    { ref: containerRef, className, style: { perspective: "1000px" } },
    words,
  );
};
