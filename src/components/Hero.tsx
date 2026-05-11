import React, { useRef, useEffect, lazy, Suspense } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { MagneticButton } from "./MagneticButton";
import { TextSplitReveal } from "./TextSplitReveal";
import { useLang } from "@/contexts/LangContext";

gsap.registerPlugin(ScrollTrigger);

const OrbCanvas = lazy(() => import("./OrbCanvas"));

export const Hero: React.FC = () => {
  const { t } = useLang();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power4.out", delay: 0.2 }
      );
      gsap.to(containerRef.current, {
        yPercent: 30, opacity: 0, ease: "none",
        scrollTrigger: { trigger: containerRef.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Suspense fallback={<div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center text-muted-foreground text-sm tracking-widest uppercase">Loading...</div>}>
        <OrbCanvas />
      </Suspense>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />

      <div ref={contentRef} className="container relative z-10 mx-auto px-6 pt-20 text-center">
        <TextSplitReveal
          as="h1"
          text={t.hero.h1}
          className="text-5xl md:text-7xl lg:text-[100px] font-bold tracking-tighter leading-[1.1] mb-8 max-w-5xl mx-auto"
        />
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 font-light leading-relaxed">
          {t.hero.sub}
        </p>
        <MagneticButton
          onClick={() => document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" })}
          className="group bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-[0_0_40px_rgba(0,212,255,0.25)] hover:shadow-[0_0_60px_rgba(0,212,255,0.4)]"
          data-testid="button-hero-cta"
        >
          <span className="relative z-10 flex items-center gap-2">
            {t.hero.cta}
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </span>
        </MagneticButton>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">{t.hero.scroll}</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-muted-foreground to-transparent" />
      </div>
    </section>
  );
};
