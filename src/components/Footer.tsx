"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useIsMobile } from "./useIsMobile";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const ctaBtnRef = useRef<HTMLAnchorElement>(null);
  const isMobile = useIsMobile();

  // ─── Magnetic hover effect ───
  useEffect(() => {
    if (isMobile || !ctaBtnRef.current) return;

    const btn = ctaBtnRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
      });
    };

    btn.addEventListener("mousemove", handleMouseMove);
    btn.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      btn.removeEventListener("mousemove", handleMouseMove);
      btn.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isMobile]);

  // ─── Split-letter stagger reveal ───
  useEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      // Split the heading text into individual characters for stagger
      const headingChars = gsap.utils.toArray<HTMLElement>(".footer-char");
      if (headingChars.length > 0) {
        gsap.set(headingChars, { opacity: 0, y: 30, rotateX: -45 });
      }

      // Reveal elements on scroll
      gsap.fromTo(
        ".footer-reveal",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 85%",
          },
        }
      );

      // Characters stagger in after the general reveal
      if (headingChars.length > 0) {
        ScrollTrigger.create({
          trigger: footerRef.current,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(headingChars, {
              opacity: 1,
              y: 0,
              rotateX: 0,
              stagger: 0.02,
              duration: 0.8,
              ease: "power4.out",
              delay: 0.3,
            });
          },
        });
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const headingText = "Ready to engineer better human experiences?";

  return (
    <footer
      ref={footerRef}
      style={{
        backgroundColor: "var(--text-primary)",
        color: "var(--bg-primary)",
        padding: "8rem 8vw 3rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Accent */}
      <div
        style={{
          position: "absolute",
          top: "-50%",
          right: "-10%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(15,76,129,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Main CTA */}
      <div className="footer-reveal" style={{ marginBottom: "5rem", maxWidth: "700px" }}>
        <div
          className="mono"
          style={{
            fontSize: "0.65rem",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: "var(--accent-light)",
            marginBottom: "1.5rem",
          }}
        >
          Let&apos;s Build Something Together
        </div>

        {/* Split-letter heading — word-aware wrapping */}
        <h2
          style={{
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            lineHeight: 1.15,
            marginBottom: "2rem",
            fontFamily: "var(--font-playfair)",
            perspective: "800px",
          }}
        >
          {headingText.split(" ").map((word, wi) => (
            <span key={wi} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
              {word.split("").map((char, ci) => (
                <span
                  key={`${wi}-${ci}`}
                  className="footer-char"
                  style={{
                    display: "inline-block",
                    willChange: "transform, opacity",
                    transformOrigin: "bottom center",
                  }}
                >
                  {char}
                </span>
              ))}
              {wi < headingText.split(" ").length - 1 && (
                <span style={{ display: "inline-block", width: "0.3em" }}>{"\u00A0"}</span>
              )}
            </span>
          ))}
        </h2>

        {/* Magnetic CTA button */}
        <a
          ref={ctaBtnRef}
          href="mailto:mailshivamjha007@gmail.com"
          className="magnetic-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1rem 2rem",
            backgroundColor: "var(--accent-color)",
            color: "#fff",
            borderRadius: "8px",
            fontFamily: "var(--font-jetbrains)",
            fontSize: "0.8rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            cursor: isMobile ? "auto" : "none",
            willChange: "transform",
          }}
          onMouseEnter={(e) => {
            if (isMobile) return;
            e.currentTarget.style.backgroundColor = "var(--accent-light)";
            e.currentTarget.style.boxShadow = "0 8px 30px rgba(15,76,129,0.3)";
          }}
          onMouseLeave={(e) => {
            if (isMobile) return;
            e.currentTarget.style.backgroundColor = "var(--accent-color)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Get in Touch
          <span style={{ fontSize: "1.2rem" }}>→</span>
        </a>
      </div>

      {/* Divider */}
      <div
        className="footer-reveal"
        style={{
          height: "1px",
          backgroundColor: "rgba(255,255,255,0.1)",
          marginBottom: "3rem",
        }}
      />

      {/* Bottom Row */}
      <div
        className="footer-reveal"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "2rem",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "0.8rem",
              letterSpacing: "0.08em",
              marginBottom: "0.5rem",
            }}
          >
            Shivam<span style={{ color: "var(--accent-light)" }}>.</span>Jha
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.4)",
              fontFamily: "var(--font-inter)",
            }}
          >
            Technical UXR Strategist · {new Date().getFullYear()}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "2rem",
            fontFamily: "var(--font-jetbrains)",
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          {[
            { label: "LinkedIn", href: "https://www.linkedin.com/in/shivam-jha-a59782291/" },
            { label: "GitHub", href: "https://github.com/GH-Shivam007" },
            { label: "Resume", href: "https://drive.google.com/file/d/1j7XPLRPmC7sJvYLvP3tZr0kB8spK963_/view?usp=sharing" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "rgba(255,255,255,0.5)",
                cursor: isMobile ? "auto" : "none",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--accent-light)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.5)";
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
