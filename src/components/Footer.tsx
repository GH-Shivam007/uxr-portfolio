"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
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
    }, footerRef);

    return () => ctx.revert();
  }, []);

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
          Let's Build Something Together
        </div>
        <h2
          style={{
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            lineHeight: 1.15,
            marginBottom: "2rem",
            fontFamily: "var(--font-playfair)",
          }}
        >
          Ready to engineer better human experiences?
        </h2>
        <a
          href="mailto:shivamjha@example.com"
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
            cursor: "none",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--accent-light)";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 30px rgba(15,76,129,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--accent-color)";
            e.currentTarget.style.transform = "translateY(0)";
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
            { label: "LinkedIn", href: "#" },
            { label: "GitHub", href: "#" },
            { label: "Resume", href: "#" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                color: "rgba(255,255,255,0.5)",
                cursor: "none",
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
