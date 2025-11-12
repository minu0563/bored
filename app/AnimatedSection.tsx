'use client';
import { useEffect, useRef, useState, ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  mode?: string;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, className = "", delay = 0, mode = "fade-in"}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), delay);
            observer.unobserve(entry.target);
          }
        },
        { threshold: 0.3 }
      );

      if (ref.current) observer.observe(ref.current);

      return () => {
        if (ref.current) observer.unobserve(ref.current);
      };
    }, [delay]);

    const modename: { [key: string]: string} = {
      "fade-in": isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
      "slide-in-left": isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10",
      "None": ""
    }

    return (
      <div
        ref={ref}
        className={`${className} transition-all duration-700 ease-out transform ${
          modename[mode] || modename["None"]}`}>
        {children}
      </div>
    );
};

export default AnimatedSection;
