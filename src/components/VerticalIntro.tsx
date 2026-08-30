"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import MinecraftAvatar from "./MinecraftAvatar";
import { useIsMobile } from "./useIsMobile";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Splits a string into individual <span> elements for per-character animation.
 */
function CharSplit({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  return (
    <span className={className} style={{ ...style, display: "inline-block" }}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="hero-char"
          style={{
            display: "inline-block",
            willChange: "transform, opacity",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

export default function VerticalIntro({ visible }: { visible: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const philosophyRef = useRef<HTMLDivElement>(null);
  const philosophyTextRef = useRef<HTMLQuoteElement>(null);
  const isMobile = useIsMobile();
  const [philosophyRevealed, setPhilosophyRevealed] = useState(false);

  // Scramble / decode text effect for philosophy quote
  useEffect(() => {
    if (!philosophyRevealed || !philosophyTextRef.current) return;

    const original =
      "Technology is never neutral; every interface is a philosophical choice that dictates human behavior.";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";
    const el = philosophyTextRef.current;
    let frame = 0;
    const totalFrames = original.length * 2;

    const interval = setInterval(() => {
      let result = "";
      for (let i = 0; i < original.length; i++) {
        if (original[i] === " ") {
          result += " ";
        } else if (frame > i * 1.5) {
          result += original[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      el.textContent = `"${result}"`;
      frame++;
      if (frame >= totalFrames) clearInterval(interval);
    }, 25);

    return () => clearInterval(interval);
  }, [philosophyRevealed]);

  useEffect(() => {
    if (!sectionRef.current || !textContainerRef.current || !visible) return;

    const ctx = gsap.context(() => {
      // ─── HERO CHARACTER SPLIT ANIMATION ───
      // Each character flies in with individual 3D perspective
      const heroChars = gsap.utils.toArray<HTMLElement>(".hero-char");
      if (heroChars.length > 0) {
        gsap.set(heroChars, {
          opacity: 0,
          y: 80,
          rotateX: -90,
          transformOrigin: "bottom center",
        });

        gsap.to(heroChars, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1.2,
          stagger: 0.02,
          ease: "power4.out",
          delay: 1.0,
        });
      }

      // ─── Reveal lines (eyebrow, subtitle, description) ───
      const lines = gsap.utils.toArray<HTMLElement>(".reveal-line");
      gsap.fromTo(
        lines,
        {
          y: 40,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          delay: 1.4,
        }
      );

      // ─── DIMENSIONAL DRIFT — characters split apart on scroll ───
      if (!isMobile && heroChars.length > 0) {
        heroChars.forEach((char, i) => {
          const centerIndex = heroChars.length / 2;
          const offsetFromCenter = i - centerIndex;

          gsap.to(char, {
            x: offsetFromCenter * 15,
            y: -Math.abs(offsetFromCenter) * 8,
            opacity: 0,
            rotateY: offsetFromCenter * 5,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "30% top",
              end: "70% top",
              scrub: 1,
            },
          });
        });
      }

      // ─── Mobile scroll-out: simple opacity fade (no filter animations) ───
      if (isMobile) {
        gsap.to(textContainerRef.current, {
          opacity: 0,
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "center top",
            end: "bottom top",
            scrub: 1,
          },
        });
      } else {
        // Desktop: cinematic blur + opacity on scroll out
        gsap.to(textContainerRef.current, {
          filter: "blur(8px)",
          opacity: 0,
          y: -60,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "center top",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }

      // ─── Philosophy — particle decode reveal ───
      if (philosophyRef.current) {
        gsap.fromTo(
          philosophyRef.current,
          { y: 60, opacity: 0, scale: 0.97 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: philosophyRef.current,
              start: "top 90%",
              end: "top 50%",
              scrub: 1,
              onEnter: () => setPhilosophyRevealed(true),
            },
          }
        );
      }

      // ─── Aurora parallax layers ───
      const auroraLayers = gsap.utils.toArray<HTMLElement>(".aurora-layer");
      auroraLayers.forEach((layer, i) => {
        const speed = (i + 1) * 0.3;
        gsap.to(layer, {
          y: -100 * speed,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [visible, isMobile]);

  return (
    <section
      id="top"
      ref={sectionRef}
      style={{
        minHeight: "140vh",
        display: "flex",
        flexDirection: "column",
        padding: "12vh 8vw",
        paddingTop: "calc(var(--nav-height) + 8vh)",
        color: "var(--text-primary)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ─── Aurora Mesh Gradient Background with Parallax ─── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          className="aurora-layer"
          style={{
            position: "absolute",
            top: "-30%",
            left: "-10%",
            width: "70%",
            height: "70%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(15,76,129,0.12) 0%, rgba(15,76,129,0.03) 40%, transparent 70%)",
            animation: "auroraShift 20s ease-in-out infinite",
            filter: isMobile ? "blur(40px)" : "blur(60px)",
            willChange: "transform",
          }}
        />
        <div
          className="aurora-layer"
          style={{
            position: "absolute",
            top: "20%",
            right: "-15%",
            width: "60%",
            height: "60%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(26,117,194,0.10) 0%, rgba(26,117,194,0.02) 40%, transparent 70%)",
            animation: "auroraShift2 25s ease-in-out infinite",
            filter: isMobile ? "blur(50px)" : "blur(80px)",
            willChange: "transform",
          }}
        />
        <div
          className="aurora-layer"
          style={{
            position: "absolute",
            bottom: "-10%",
            left: "30%",
            width: "50%",
            height: "50%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 60%)",
            animation: "auroraShift3 18s ease-in-out infinite",
            filter: isMobile ? "blur(60px)" : "blur(100px)",
            willChange: "transform",
          }}
        />
        {/* Subtle grid on top of aurora */}
        <div
          className="grid-bg"
          style={{ position: "absolute", inset: 0 }}
        />
      </div>

      {/* ─── Minecraft Avatar ─── */}
      <div
        className="hide-mobile"
        style={{
          position: "absolute",
          top: "12vh",
          right: "8vw",
          width: "min(500px, 35vw)",
          height: "min(500px, 35vw)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        <MinecraftAvatar />
      </div>

      {/* ─── Hero Text ─── */}
      <div
        ref={textContainerRef}
        style={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          zIndex: 2,
          maxWidth: "650px",
          perspective: isMobile ? "none" : "1200px",
        }}
      >
        {/* Eyebrow */}
        <div style={{ overflow: "hidden", marginBottom: "1.5rem" }}>
          <div
            className="reveal-line mono"
            style={{
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.25em",
              color: "var(--accent-color)",
            }}
          >
            ◇ UXR Portfolio · 2026
          </div>
        </div>

        {/* Main Heading — per-character split for dimensional drift */}
        <div style={{ overflow: "visible", marginBottom: "0.5rem" }}>
          <h1
            className="gradient-text"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              lineHeight: 1.05,
            }}
          >
            <CharSplit text="Shivam Jha." />
          </h1>
        </div>

        {/* Subtitle */}
        <div style={{ overflow: "hidden" }}>
          <h2
            className="reveal-line"
            style={{
              fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)",
              color: "var(--text-secondary)",
              marginTop: "0.75rem",
              fontFamily: "var(--font-inter)",
              fontWeight: 400,
              letterSpacing: "-0.01em",
            }}
          >
            Technical UXR Strategist
          </h2>
        </div>

        {/* Description */}
        <div style={{ overflow: "hidden", marginTop: "2rem" }}>
          <p
            className="reveal-line"
            style={{
              fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)",
              color: "var(--text-secondary)",
            }}
          >
            I bridge the gap between complex system architecture and human
            behavior. With a background in Computer Science Engineering and
            Cybersecurity, I don't just find user insights—I understand the
            technical constraints required to build the solution.
          </p>
        </div>
      </div>

      {/* ─── Scroll Down Indicator with Glitch Pulse ─── */}
      <div
        className="scroll-indicator"
        style={{
          position: "absolute",
          bottom: "4vh",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          zIndex: 2,
          opacity: visible ? 0.5 : 0,
          transition: "opacity 1s ease 2.5s",
        }}
      >
        <span
          className="mono"
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--text-tertiary)",
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: "1px",
            height: "30px",
            background: "var(--hairline)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Animated pulse traveling down the line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "8px",
              background: "var(--gradient-accent)",
              animation: "scrollPulse 2s ease-in-out infinite",
              borderRadius: "1px",
            }}
          />
        </div>
      </div>

      {/* ─── Philosophy Quote — Decode Reveal ─── */}
      <div
        id="philosophy"
        ref={philosophyRef}
        style={{
          minHeight: "40vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ maxWidth: "700px", textAlign: "right" }}>
          <blockquote
            ref={philosophyTextRef}
            style={{
              fontSize: "clamp(1.3rem, 2.2vw, 2rem)",
              fontStyle: "italic",
              color: "var(--text-primary)",
              lineHeight: 1.5,
              borderRight: "3px solid var(--accent-color)",
              paddingRight: "2rem",
            }}
          >
            &quot;Technology is never neutral; every interface is a philosophical
            choice that dictates human behavior.&quot;
          </blockquote>
        </div>
      </div>
    </section>
  );
}
