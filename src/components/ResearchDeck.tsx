"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useIsMobile } from "./useIsMobile";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Slot-machine style counter that spins through digits
 */
function SlotCounter({
  target,
  triggered,
  prefix = "~",
  suffix = "%",
}: {
  target: number;
  triggered: boolean;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!triggered || !ref.current) return;

    const counter = { val: 0 };
    gsap.to(counter, {
      val: target,
      duration: 2.5,
      ease: "power2.out",
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent = `${prefix}${Math.round(counter.val)}${suffix}`;
        }
      },
    });
  }, [triggered, target, prefix, suffix]);

  return (
    <div
      ref={ref}
      className="mono gradient-accent-text"
      style={{
        fontSize: "clamp(2rem, 4vw, 3.5rem)",
        fontWeight: "bold",
      }}
    >
      {prefix}0{suffix}
    </div>
  );
}

export default function ResearchDeck() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartPathRef = useRef<SVGPathElement>(null);
  const [statTriggered, setStatTriggered] = useState(false);
  const isMobile = useIsMobile();

  // Reduced block count for performance
  const blocks = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    isNoise: i >= 20,
  }));

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".narrative-card");

      // ─── NARRATIVE STACK: Sticky cards that peel away ───
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return; // Last card doesn't peel

        // Subtle scale-down as next card overlaps
        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          end: "bottom top",
          scrub: true,
          pin: false,
          onUpdate: (self) => {
            const progress = self.progress;
            // Card scales down and gets a shadow as it stacks underneath
            const scale = 1 - progress * 0.05;
            const brightness = 1 - progress * 0.3;
            card.style.transform = `scale(${scale})`;
            card.style.filter = `brightness(${brightness})`;
          },
        });
      });

      // ─── Data grid — wave ripple ───
      const dataBlocks = gsap.utils.toArray<HTMLElement>(".data-block");
      if (dataBlocks.length > 0) {
        gsap.set(dataBlocks, { scale: 0, opacity: 0 });

        ScrollTrigger.create({
          trigger: ".data-grid-container",
          start: "top 70%",
          once: true,
          onEnter: () => {
            setStatTriggered(true);

            // Wave ripple from top-left (organic feel)
            gsap.to(dataBlocks, {
              scale: 1,
              opacity: 1,
              duration: 0.3,
              stagger: {
                amount: 0.8,
                from: "start",
                grid: [6, 10],
                ease: "power2.out",
              },
              ease: "back.out(1.4)",
              onComplete: () => {
                // Triage: fade out noise
                gsap.to(".data-block-noise", {
                  opacity: 0.08,
                  scale: 0.6,
                  duration: 0.6,
                  stagger: { amount: 0.8, from: "random" },
                  ease: "power2.inOut",
                  delay: 0.3,
                });
              },
            });
          },
        });
      }

      // ─── Chart SVG path draw with trailing glow ───
      if (chartPathRef.current) {
        const length = chartPathRef.current.getTotalLength();
        gsap.set(chartPathRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        ScrollTrigger.create({
          trigger: ".chart-container",
          start: "top 60%",
          end: "center 30%",
          scrub: 1,
          onUpdate: (self) => {
            if (chartPathRef.current) {
              chartPathRef.current.style.strokeDashoffset = String(
                length * (1 - self.progress)
              );
              // Intensify glow as line draws
              const glowIntensity = 4 + self.progress * 8;
              chartPathRef.current.style.filter = `drop-shadow(0 0 ${glowIntensity}px var(--accent-glow))`;
            }
          },
        });
      }

      // ─── Fix cards stagger reveal ───
      gsap.set(".fix-card", { opacity: 0, y: 40, scale: 0.95 });
      ScrollTrigger.create({
        trigger: ".fixes-container",
        start: "top 65%",
        once: true,
        onEnter: () => {
          gsap.to(".fix-card", {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.12,
            duration: 0.8,
            ease: "power3.out",
          });
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="deck"
      ref={containerRef}
      style={{
        backgroundColor: "var(--bg-primary)",
        position: "relative",
      }}
    >
      {/* Progress Header — now static at top of section */}
      <div
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          backgroundColor: "rgba(250, 250, 250, 0.9)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
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
          <span style={{ color: "var(--text-secondary)" }}>01 — 04</span>
        </div>
        <div style={{ height: "1px", backgroundColor: "var(--hairline)" }} />
      </div>

      {/* ─── CARD 1: Problem ─── */}
      <div className="narrative-card" style={{ minHeight: "100vh", padding: "6vh 8vw" }}>
        <div
          className="glass-panel"
          style={{
            padding: isMobile ? "2rem" : "3rem",
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
              text: 'A diary-based study using Google Forms, followed by data cleaning, tagging, and pivot-based analysis to uncover behavioral patterns.',
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

      {/* ─── CARD 2: Selective Engagement + Grid ─── */}
      <div
        className="narrative-card data-grid-container"
        style={{ minHeight: "100vh", padding: "6vh 8vw" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(2rem, 4vw, 4rem)",
            flexWrap: isMobile ? "wrap" : "nowrap",
            width: "100%",
            maxWidth: "1000px",
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
              flex: "1 1 auto",
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
              &quot;The vast majority of alerts do not warrant immediate action.
              Users have developed a habit of defaulting to &apos;ignore&apos; or
              &apos;mass-clear&apos; simply to protect their digital space.&quot;
            </blockquote>
            <SlotCounter target={34} triggered={statTriggered} />
            <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem" }}>
              Users meaningfully engage with only ~34% of notifications.
              100% of &quot;Too Frequent&quot; and 80% of &quot;Irrelevant&quot; alerts were
              instantly dismissed.
            </p>
          </div>

          {/* Data Grid — reduced to 60 blocks */}
          <div
            className="hide-mobile"
            style={{
              width: "clamp(250px, 25vw, 350px)",
              display: "grid",
              gridTemplateColumns: "repeat(10, 1fr)",
              gap: "3px",
              flexShrink: 0,
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
      </div>

      {/* ─── CARD 3: Cost of Missing Context ─── */}
      <div
        className="narrative-card chart-container"
        style={{ minHeight: "100vh", padding: "6vh 8vw" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(2rem, 4vw, 4rem)",
            flexWrap: isMobile ? "wrap" : "nowrap",
            width: "100%",
            maxWidth: "1000px",
          }}
        >
          <div
            className="glass-panel"
            style={{ padding: "2.5rem", maxWidth: "480px", flex: "1 1 auto" }}
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
              &quot;When users do not immediately grasp why a system is pinging
              them, it forces unnecessary cognitive load. This ambiguity leads
              to highly fractured, unpredictable behavior.&quot;
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
                cursor: isMobile ? "auto" : "none",
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

          {/* Chart with trailing glow */}
          <div
            className="glass-panel hide-mobile"
            style={{
              padding: "2.5rem",
              width: "clamp(300px, 25vw, 380px)",
              aspectRatio: "1",
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
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
      </div>

      {/* ─── CARD 4: Systemic Fixes ─── */}
      <div
        className="narrative-card fixes-container"
        style={{ minHeight: "100vh", padding: "6vh 8vw" }}
      >
        <div
          className="glass-panel"
          style={{ padding: isMobile ? "2rem" : "3rem", maxWidth: "950px", width: "100%" }}
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
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(auto-fit, minmax(240px, 1fr))",
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
    </section>
  );
}
