"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import MinecraftAvatar from "./MinecraftAvatar";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function VerticalIntro({ visible }: { visible: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const philosophyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !textContainerRef.current || !visible) return;

    const ctx = gsap.context(() => {
      // Staggered text reveal (delayed to sync with morph)
      const lines = gsap.utils.toArray<HTMLElement>(".reveal-line");
      gsap.fromTo(
        lines,
        {
          y: 60,
          clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
          opacity: 0,
        },
        {
          y: 0,
          clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
          opacity: 1,
          duration: 1.2,
          stagger: 0.12,
          ease: "power4.out",
          delay: 1.0,
        }
      );

      // Cinematic blur on scroll out
      gsap.to(textContainerRef.current, {
        filter: "blur(12px)",
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

      // Philosophy parallax
      if (philosophyRef.current) {
        gsap.fromTo(
          philosophyRef.current,
          { y: 80, opacity: 0, filter: "blur(4px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            ease: "power3.out",
            scrollTrigger: {
              trigger: philosophyRef.current,
              start: "top 90%",
              end: "top 40%",
              scrub: 1.5,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [visible]);

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
      {/* ─── Aurora Mesh Gradient Background ─── */}
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
            filter: "blur(60px)",
          }}
        />
        <div
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
            filter: "blur(80px)",
          }}
        />
        <div
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
            filter: "blur(100px)",
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

        {/* Main Heading */}
        <div style={{ overflow: "hidden" }}>
          <h1
            className="reveal-line gradient-text"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              lineHeight: 1.05,
            }}
          >
            Shivam Jha.
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

      {/* ─── Scroll Down Indicator ─── */}
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
          }}
        />
      </div>

      {/* ─── Philosophy Quote ─── */}
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
            style={{
              fontSize: "clamp(1.3rem, 2.2vw, 2rem)",
              fontStyle: "italic",
              color: "var(--text-primary)",
              lineHeight: 1.5,
              borderRight: "3px solid var(--accent-color)",
              paddingRight: "2rem",
            }}
          >
            "Technology is never neutral; every interface is a philosophical
            choice that dictates human behavior."
          </blockquote>
        </div>
      </div>
    </section>
  );
}
