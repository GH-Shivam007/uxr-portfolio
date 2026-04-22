"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import BlockchainCrystal from "./BlockchainCrystal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TheLab() {
  const surakshaRef = useRef<HTMLDivElement>(null);
  const redactionMaskRef = useRef<HTMLDivElement>(null);
  const secondaryMaskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!surakshaRef.current || !redactionMaskRef.current || !secondaryMaskRef.current)
      return;

    const ctx = gsap.context(() => {
      // SURAKSHA glitchy clip-path timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: surakshaRef.current,
          start: "top 60%",
          end: "center 30%",
          scrub: 1.5,
        },
      });

      tl.to(redactionMaskRef.current, {
        clipPath: "inset(0% 70% 0% 0%)",
        duration: 0.2,
        ease: "power4.in",
      })
        .to(redactionMaskRef.current, {
          clipPath: "inset(0% 75% 0% 0%)",
          duration: 0.1,
        })
        .to(redactionMaskRef.current, {
          clipPath: "inset(0% 30% 0% 0%)",
          duration: 0.3,
          ease: "power2.out",
        })
        .to(redactionMaskRef.current, {
          clipPath: "inset(0% 35% 0% 0%)",
          duration: 0.1,
        })
        .to(redactionMaskRef.current, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.3,
          ease: "power4.out",
        });

      // Secondary redaction
      gsap.to(secondaryMaskRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: surakshaRef.current,
          start: "40% center",
          end: "60% center",
          scrub: 1,
        },
      });
    }, surakshaRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      id="lab"
      style={{
        backgroundColor: "var(--bg-secondary)",
        position: "relative",
        zIndex: 2,
      }}
    >
      {/* ─── PROJECT SURAKSHA ─── */}
      <section
        ref={surakshaRef}
        style={{
          minHeight: "100vh",
          padding: "12vh 8vw",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "3.5rem",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div className="data-label" style={{ marginBottom: "0.75rem" }}>
            Engineering Lab · Project 01
          </div>
          <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", marginBottom: "1rem" }}>
            Project SURAKSHA
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              maxWidth: "580px",
              margin: "0 auto",
              fontSize: "0.95rem",
            }}
          >
            A specialized data security tool designed to automatically redact
            Personally Identifiable Information (PII) from agency documents,
            reducing privacy breach risks across 1,000+ sensitive files.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            className="glass-panel"
            style={{
              width: "100%",
              maxWidth: "750px",
              padding: "3.5rem",
              position: "relative",
              overflow: "hidden",
              backgroundColor: "var(--bg-primary)",
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: "clamp(0.9rem, 1.2vw, 1.15rem)",
                lineHeight: 2.8,
                color: "var(--text-primary)",
              }}
            >
              CONFIDENTIAL REPORT
              <br />
              SUBJECT:{" "}
              <span style={{ position: "relative", display: "inline-block" }}>
                John Doe
                <div
                  ref={redactionMaskRef}
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "#111",
                    color: "#FAFAFA",
                    clipPath: "inset(0% 100% 0% 0%)",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 4px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    borderRadius: "2px",
                  }}
                >
                  ███████
                </div>
              </span>
              <br />
              ID:{" "}
              <span style={{ position: "relative", display: "inline-block" }}>
                XXX-XX-8921
                <div
                  ref={secondaryMaskRef}
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "#111",
                    color: "#FAFAFA",
                    clipPath: "inset(0% 100% 0% 0%)",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 4px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    borderRadius: "2px",
                  }}
                >
                  ███████████
                </div>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FRACTIONAL ASSET TOKENIZATION ─── */}
      <section
        style={{
          minHeight: "140vh",
          position: "relative",
          overflow: "clip",
        }}
      >
        {/* Sticky WebGL Background */}
        <div
          style={{
            position: "sticky",
            top: 0,
            width: "100%",
            height: "100vh",
            zIndex: 0,
          }}
        >
          <BlockchainCrystal />
        </div>

        {/* Foreground Content */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
            textAlign: "center",
            pointerEvents: "none",
            padding: "0 8vw",
            width: "100%",
          }}
        >
          <div
            className="glass-panel"
            style={{
              padding: "2.5rem",
              display: "inline-block",
              pointerEvents: "auto",
              maxWidth: "550px",
              backdropFilter: "blur(30px)",
            }}
          >
            <div className="data-label" style={{ marginBottom: "0.75rem" }}>
              Engineering Lab · Project 02
            </div>
            <h2
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.5rem)",
                marginBottom: "1rem",
              }}
            >
              Fractional Asset Tokenization
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              A blockchain-based platform built on Polygon and Solidity to
              democratize real estate investment in India. Micro-investments as
              low as 1% of a property's value.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
