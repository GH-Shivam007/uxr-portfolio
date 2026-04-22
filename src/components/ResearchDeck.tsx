"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ResearchDeck() {
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesContainerRef = useRef<HTMLDivElement>(null);
  const chartPathRef = useRef<SVGPathElement>(null);
  const statRef = useRef<HTMLDivElement>(null);
  const [statCounted, setStatCounted] = useState(false);

  const blocks = Array.from({ length: 131 }, (_, i) => ({
    id: i,
    isNoise: i >= 45,
  }));

  useEffect(() => {
    if (!containerRef.current || !slidesContainerRef.current) return;

    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray<HTMLElement>(
        slidesContainerRef.current!.children
      );

      const pinTl = gsap.to(slides, {
        xPercent: -100 * (slides.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1.5,
          snap: 1 / (slides.length - 1),
          end: () => "+=" + window.innerWidth * slides.length,
          onUpdate: (self) => {
            const bar = document.getElementById("deck-progress");
            if (bar) bar.style.width = `${self.progress * 100}%`;
          },
        },
      });

      // Data grid — ripple in, then triage
      gsap.set(".data-block", { scale: 0, opacity: 0 });

      ScrollTrigger.create({
        trigger: slides[1],
        containerAnimation: pinTl,
        start: "left 80%",
        end: "left 40%",
        onEnter: () => {
          // Animated stat counter
          if (statRef.current && !statCounted) {
            setStatCounted(true);
            const counter = { val: 0 };
            gsap.to(counter, {
              val: 34,
              duration: 2,
              ease: "power2.out",
              onUpdate: () => {
                if (statRef.current) {
                  statRef.current.textContent = `~${Math.round(counter.val)}%`;
                }
              },
            });
          }

          // Ripple in all blocks first
          gsap.to(".data-block", {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            stagger: { amount: 0.6, from: "center", grid: [11, 12] },
            ease: "back.out(1.7)",
            onComplete: () => {
              // Then triage: fade out the noise
              gsap.to(".data-block-noise", {
                opacity: 0.08,
                scale: 0.6,
                duration: 0.5,
                stagger: { amount: 1, from: "random" },
                ease: "power2.inOut",
                delay: 0.3,
              });
            },
          });
        },
        onLeaveBack: () => {
          gsap.set(".data-block", { scale: 0, opacity: 0 });
          gsap.set(".data-block-noise", { opacity: 1, scale: 1 });
        },
      });

      // SVG Path draw
      if (chartPathRef.current) {
        const length = chartPathRef.current.getTotalLength();
        gsap.set(chartPathRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        gsap.to(chartPathRef.current, {
          strokeDashoffset: 0,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: slides[2],
            containerAnimation: pinTl,
            start: "left center",
            end: "center center",
            scrub: 1.5,
          },
        });
      }

      // Systemic Fixes staggered reveal
      gsap.set(".fix-card", { opacity: 0, y: 40 });
      ScrollTrigger.create({
        trigger: slides[3],
        containerAnimation: pinTl,
        start: "left center",
        onEnter: () => {
          gsap.to(".fix-card", {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: "power3.out",
          });
        },
      });
    }, containerRef);

    return () => ctx.revert(); // Only kills THIS context's triggers
  }, []);

  return (
    <section
      id="deck"
      ref={containerRef}
      style={{
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "var(--bg-primary)",
        position: "relative",
      }}
    >
      {/* Progress Header */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.25rem 3rem",
            fontSize: "0.65rem",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
          }}
          className="mono"
        >
          <span style={{ color: "var(--text-tertiary)" }}>
            Research · Demystifying Notification Fatigue
          </span>
          <span style={{ color: "var(--text-secondary)" }}>
            01 — 04
          </span>
        </div>
        <div style={{ height: "1px", backgroundColor: "var(--hairline)" }}>
          <div
            id="deck-progress"
            style={{
              height: "2px",
              width: "0%",
              background: "var(--gradient-accent)",
              transformOrigin: "left",
              transition: "width 0.1s linear",
            }}
          />
        </div>
      </div>

      <div
        ref={slidesContainerRef}
        style={{
          display: "flex",
          width: "400vw",
          height: "100%",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* SLIDE 1: Problem */}
        <div
          style={{
            width: "100vw",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 8vw",
          }}
        >
          <div
            className="glass-panel"
            style={{
              padding: "3rem",
              width: "100%",
              maxWidth: "750px",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <div className="data-label">Case Study · 01</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>
              Demystifying Notification Fatigue
            </h2>
            <p
              style={{
                color: "var(--accent-color)",
                fontSize: "0.85rem",
                fontFamily: "var(--font-inter)",
              }}
            >
              A mixed-methods diary study on user behavior towards frequent
              notifications
            </p>
            <div style={{ height: "1px", backgroundColor: "var(--hairline)" }} />
            {[
              {
                title: "Problem",
                text: "Users are overwhelmed by notifications and often ignore or dismiss them, but the reasons behind these behaviors are not well understood.",
              },
              {
                title: "Goal",
                text: "To identify what drives users to open, ignore, or dismiss notifications and understand how importance and context influence these decisions.",
              },
              {
                title: "Methodology",
                text: "A diary-based study using Google Forms, followed by data cleaning, tagging, and pivot-based analysis to uncover behavioral patterns.",
              },
            ].map((item) => (
              <div key={item.title}>
                <h4
                  style={{
                    fontSize: "1rem",
                    marginBottom: "0.4rem",
                    color: "var(--text-primary)",
                  }}
                >
                  {item.title}
                </h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem" }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SLIDE 2: Selective Engagement + Grid */}
        <div
          style={{
            width: "100vw",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(2rem, 4vw, 4rem)",
            padding: "0 8vw",
          }}
        >
          <div
            className="glass-panel"
            style={{
              padding: "2.5rem",
              maxWidth: "480px",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            <div className="data-label">Finding · 02</div>
            <h2 style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)" }}>
              A Culture of Selective Engagement
            </h2>
            <blockquote
              style={{
                fontStyle: "italic",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                borderLeft: "2px solid var(--accent-color)",
                paddingLeft: "1rem",
                fontSize: "0.95rem",
              }}
            >
              "The vast majority of alerts do not warrant immediate action.
              Users have developed a habit of defaulting to 'ignore' or
              'mass-clear' simply to protect their digital space."
            </blockquote>
            <div
              ref={statRef}
              className="mono gradient-accent-text"
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontWeight: "bold",
              }}
            >
              ~0%
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem" }}>
              Users meaningfully engage with only ~34% of notifications.
              100% of "Too Frequent" and 80% of "Irrelevant" alerts were
              instantly dismissed.
            </p>
          </div>

          {/* Data Grid */}
          <div
            className="hide-mobile"
            style={{
              width: "clamp(300px, 30vw, 450px)",
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gap: "3px",
            }}
          >
            {blocks.map((block) => (
              <div
                key={block.id}
                className={`data-block ${block.isNoise ? "data-block-noise" : "data-block-meaningful"}`}
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  backgroundColor: "var(--accent-color)",
                  borderRadius: "3px",
                  transition: "opacity 0.3s ease, transform 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>

        {/* SLIDE 3: Cost of Missing Context */}
        <div
          style={{
            width: "100vw",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(2rem, 4vw, 4rem)",
            padding: "0 8vw",
          }}
        >
          <div
            className="glass-panel"
            style={{ padding: "2.5rem", maxWidth: "480px" }}
          >
            <div className="data-label" style={{ marginBottom: "1rem" }}>
              Finding · 03
            </div>
            <h2
              style={{
                fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
                marginBottom: "1.25rem",
              }}
            >
              The Cost of Missing Context
            </h2>
            <blockquote
              style={{
                fontStyle: "italic",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                borderLeft: "2px solid var(--accent-color)",
                paddingLeft: "1rem",
                marginBottom: "1.5rem",
                fontSize: "0.95rem",
              }}
            >
              "When users do not immediately grasp why a system is pinging
              them, it forces unnecessary cognitive load. This ambiguity leads
              to highly fractured, unpredictable behavior."
            </blockquote>
            <p
              style={{
                color: "var(--text-secondary)",
                marginBottom: "2rem",
                fontSize: "0.95rem",
              }}
            >
              Over a third of all notifications fail to communicate their basic
              premise to the user.
            </p>
            <div
              data-cursor="anxiety"
              className="pulse-ring"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                border: "2px solid var(--accent-color)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                cursor: "none",
              }}
            >
              <span
                className="mono"
                style={{
                  color: "var(--accent-color)",
                  fontWeight: "bold",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                }}
              >
                AMBIGUITY
              </span>
            </div>
          </div>

          {/* Chart */}
          <div
            className="glass-panel hide-mobile"
            style={{
              padding: "2.5rem",
              width: "clamp(300px, 25vw, 380px)",
              aspectRatio: "1",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3
              style={{
                marginBottom: "1rem",
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              Engagement vs. Clarity
            </h3>
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              style={{ overflow: "visible", flex: 1 }}
            >
              {/* Grid lines */}
              {[20, 40, 60, 80].map((v) => (
                <line
                  key={v}
                  x1="10"
                  y1={v}
                  x2="90"
                  y2={v}
                  stroke="var(--hairline)"
                  strokeWidth="0.5"
                />
              ))}
              <line x1="10" y1="90" x2="90" y2="90" stroke="var(--hairline)" strokeWidth="1" />
              <line x1="10" y1="10" x2="10" y2="90" stroke="var(--hairline)" strokeWidth="1" />
              <text
                x="50"
                y="98"
                fontSize="3.5"
                fill="var(--text-tertiary)"
                textAnchor="middle"
                fontFamily="var(--font-jetbrains)"
              >
                Clarity →
              </text>
              <text
                x="2"
                y="50"
                fontSize="3.5"
                fill="var(--text-tertiary)"
                textAnchor="middle"
                transform="rotate(-90 2,50)"
                fontFamily="var(--font-jetbrains)"
              >
                Engagement →
              </text>
              <path
                ref={chartPathRef}
                d="M10,85 C25,82 35,70 45,50 S70,20 90,12"
                fill="none"
                stroke="var(--accent-color)"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 4px var(--accent-glow))" }}
              />
            </svg>
          </div>
        </div>

        {/* SLIDE 4: Systemic Fixes */}
        <div
          style={{
            width: "100vw",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 8vw",
          }}
        >
          <div
            className="glass-panel"
            style={{ padding: "3rem", maxWidth: "950px", width: "100%" }}
          >
            <div className="data-label" style={{ marginBottom: "0.75rem", textAlign: "center" }}>
              Recommendations · 04
            </div>
            <h2
              style={{
                fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
                marginBottom: "2.5rem",
                textAlign: "center",
              }}
            >
              Systemic Fixes for Attention Architecture
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "2rem",
              }}
            >
              {[
                {
                  num: "01",
                  title: "Context-First Payloads",
                  text: 'Inject mandatory "Reason for Alert" metadata into subtitles (e.g., "Action Required") to eliminate ambiguity.',
                },
                {
                  num: "02",
                  title: "Strict Relevance Batching",
                  text: 'Push critical alerts in real-time. Bundle low-value updates into silent, scheduled "Daily Digests."',
                },
                {
                  num: "03",
                  title: "Granular Controls",
                  text: "Replace binary On/Off switches with user-defined preference logic for personal relevance filters.",
                },
              ].map((fix) => (
                <div key={fix.num} className="fix-card">
                  <div
                    className="mono"
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--accent-color)",
                      marginBottom: "0.75rem",
                      opacity: 0.6,
                    }}
                  >
                    {fix.num}
                  </div>
                  <h4 style={{ fontSize: "1.05rem", marginBottom: "0.6rem" }}>
                    {fix.title}
                  </h4>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
                    {fix.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
