"use client";

import React, { useEffect, useState, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Nav } from "./Nav";
import VerticalIntro from "./VerticalIntro";
import SkillMatrix from "./SkillMatrix";
import ResearchDeck from "./ResearchDeck";
import TheLab from "./TheLab";
import Footer from "./Footer";
import GlobalCursor from "./GlobalCursor";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PortfolioApp() {
  const [phase, setPhase] = useState<"loading" | "morphing" | "ready">("loading");
  const loaderNameRef = useRef<HTMLHeadingElement>(null);
  const heroNameRef = useRef<HTMLHeadingElement>(null);
  const rafCallbackRef = useRef<((time: number) => void) | null>(null);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    rafCallbackRef.current = rafCallback;
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    // Scroll progress spine
    const updateSpine = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / scrollHeight) * 100;
      const fill = document.getElementById("spine-fill");
      if (fill) fill.style.height = `${progress}%`;
    };
    window.addEventListener("scroll", updateSpine, { passive: true });

    // Phase 1: Show loader name reveal (0-1.2s)
    // Phase 2: Morph into hero position (1.2s-2.4s)
    // Phase 3: Site ready
    const morphTimer = setTimeout(() => {
      setPhase("morphing");

      // After morph animation finishes
      setTimeout(() => {
        setPhase("ready");
      }, 1200);
    }, 1400);

    return () => {
      clearTimeout(morphTimer);
      window.removeEventListener("scroll", updateSpine);
      if (rafCallbackRef.current) {
        gsap.ticker.remove(rafCallbackRef.current);
      }
      lenis.destroy();
    };
  }, []);

  // Morph animation: move loader text to hero position
  useEffect(() => {
    if (phase !== "morphing" || !loaderNameRef.current) return;

    const tl = gsap.timeline();

    // Shrink and move the name up-left
    tl.to(loaderNameRef.current, {
      fontSize: "clamp(2.5rem, 6vw, 5rem)",
      x: 0,
      y: -window.innerHeight * 0.2,
      duration: 1,
      ease: "power3.inOut",
    });

    // Fade the loader bg
    tl.to(
      ".loader-overlay",
      {
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.4"
    );
  }, [phase]);

  return (
    <>
      {/* ─── CINEMATIC LOADER ─── */}
      <div
        className="loader-overlay"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          backgroundColor: "var(--bg-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: phase === "ready" ? "none" : "all",
          opacity: phase === "ready" ? 0 : 1,
          transition: phase === "ready" ? "opacity 0.01s" : "none",
        }}
      >
        <h1
          ref={loaderNameRef}
          style={{
            fontSize: "clamp(3rem, 8vw, 6rem)",
            color: "var(--text-primary)",
            animation:
              phase === "loading"
                ? "loaderNameReveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards"
                : "none",
            whiteSpace: "nowrap",
          }}
        >
          Shivam Jha<span className="gradient-accent-text">.</span>
        </h1>
      </div>

      {/* ─── SCROLL PROGRESS SPINE ─── */}
      <div className="scroll-spine" style={{ opacity: phase === "ready" ? 1 : 0, transition: "opacity 0.5s ease 0.5s" }}>
        <div id="spine-fill" className="scroll-spine-fill" />
      </div>

      {/* ─── MAIN SITE ─── */}
      <div
        style={{
          width: "100%",
          overflowX: "hidden",
          backgroundColor: "var(--bg-primary)",
          cursor: "none",
          opacity: phase === "loading" ? 0 : 1,
          transition: "opacity 0.8s ease",
        }}
      >
        <GlobalCursor />
        <Nav />
        <VerticalIntro visible={phase !== "loading"} />
        <div className="section-divider" />
        <SkillMatrix />
        <div
          className="section-divider"
          style={{
            background: "linear-gradient(to bottom, var(--bg-primary), var(--bg-primary))",
          }}
        />
        <ResearchDeck />
        <div
          className="section-divider"
          style={{
            background: "linear-gradient(to bottom, var(--bg-primary), var(--bg-secondary))",
          }}
        />
        <TheLab />
        <Footer />
      </div>
    </>
  );
}
