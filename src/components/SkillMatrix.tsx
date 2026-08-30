"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useIsMobile } from "./useIsMobile";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const skills = [
  {
    category: "Full-Stack Development",
    tools: ["React.js", "Django", "Next.js"],
    app: "Building high-fidelity, functional prototypes to conduct authentic UXR testing environments.",
    stat: "12+",
    statLabel: "Prototypes Shipped",
  },
  {
    category: "Cybersecurity / SOC",
    tools: ["Nmap", "Wireshark", "Splunk"],
    app: "Analyzing network traffic patterns to reduce cognitive load in security monitoring dashboards.",
    stat: "SOC",
    statLabel: "Level 2 Analyst",
  },
  {
    category: "Data & ML",
    tools: ["Python", "TensorFlow", "SQL"],
    app: "Parsing massive behavioral datasets to uncover invisible user friction patterns at scale.",
    stat: "10K+",
    statLabel: "Data Points Analyzed",
  },
  {
    category: "Blockchain",
    tools: ["Solidity", "Polygon", "Web3.js"],
    app: "Engineering trust mechanisms and transparency layers in decentralized user experiences.",
    stat: "Web3",
    statLabel: "DeFi Architecture",
  },
];

/**
 * Typewriter decode effect — random characters → real text
 */
function DecodeText({ text, trigger }: { text: string; trigger: boolean }) {
  const [display, setDisplay] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  useEffect(() => {
    if (!trigger) {
      // Show scrambled before trigger
      setDisplay(
        text
          .split("")
          .map((c) => (c === " " ? " " : chars[Math.floor(Math.random() * chars.length)]))
          .join("")
      );
      return;
    }

    let frame = 0;
    const totalFrames = text.length * 3;
    const interval = setInterval(() => {
      let result = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") {
          result += " ";
        } else if (frame > i * 2) {
          result += text[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      setDisplay(result);
      frame++;
      if (frame >= totalFrames) {
        setDisplay(text);
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [trigger, text]);

  return <>{display}</>;
}

function BentoCard({
  skill,
  index,
  isMobile,
}: {
  skill: (typeof skills)[0];
  index: number;
  isMobile: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 250, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 250, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || isMobile) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Use static div on mobile (no motion values / spring overhead)
  if (isMobile) {
    return (
      <div
        className="glass-panel-dark bento-card"
        style={{ cursor: "auto" }}
      >
        <div
          style={{
            padding: "2rem",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
              <span
                className="mono"
                style={{ fontSize: "0.65rem", color: "var(--accent-vivid)", opacity: 0.6 }}
              >
                0{index + 1}
              </span>
              <h3 style={{ fontSize: "1.3rem", color: "var(--text-light)" }}>
                {skill.category}
              </h3>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                className="mono gradient-accent-text"
                style={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1 }}
              >
                {skill.stat}
              </div>
              <div
                className="mono"
                style={{
                  fontSize: "0.55rem",
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.08em",
                  marginTop: "0.25rem",
                }}
              >
                {skill.statLabel}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {skill.tools.map((t) => (
              <span
                key={t}
                style={{
                  padding: "0.3rem 0.65rem",
                  background: "rgba(37, 99, 235, 0.1)",
                  border: "1px solid rgba(37, 99, 235, 0.2)",
                  borderRadius: "5px",
                  fontSize: "0.7rem",
                  color: "var(--accent-vivid)",
                  fontFamily: "var(--font-jetbrains)",
                }}
              >
                {t}
              </span>
            ))}
          </div>

          <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "0.25rem 0" }} />

          <p
            style={{
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.5)",
              marginTop: "auto",
            }}
          >
            {skill.app}
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="glass-panel-dark bento-card"
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        cursor: "none",
      }}
    >
      <div
        style={{
          padding: "2rem",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          transform: "translateZ(20px)",
        }}
      >
        {/* Stat + Number */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
            <span
              className="mono"
              style={{ fontSize: "0.65rem", color: "var(--accent-vivid)", opacity: 0.6 }}
            >
              0{index + 1}
            </span>
            <h3 style={{ fontSize: "1.3rem", color: "var(--text-light)" }}>
              {skill.category}
            </h3>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              className="mono gradient-accent-text"
              style={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1 }}
            >
              {skill.stat}
            </div>
            <div
              className="mono"
              style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", marginTop: "0.25rem" }}
            >
              {skill.statLabel}
            </div>
          </div>
        </div>

        {/* Badges */}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {skill.tools.map((t) => (
            <span
              key={t}
              style={{
                padding: "0.3rem 0.65rem",
                background: "rgba(37, 99, 235, 0.1)",
                border: "1px solid rgba(37, 99, 235, 0.2)",
                borderRadius: "5px",
                fontSize: "0.7rem",
                color: "var(--accent-vivid)",
                fontFamily: "var(--font-jetbrains)",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Separator */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "0.25rem 0" }} />

        {/* Application */}
        <p
          style={{
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.5)",
            marginTop: "auto",
          }}
        >
          {skill.app}
        </p>
      </div>
    </motion.div>
  );
}

export default function SkillMatrix() {
  const containerRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const [decodeTriggered, setDecodeTriggered] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // ─── Typewriter decode heading trigger ───
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 70%",
        once: true,
        onEnter: () => setDecodeTriggered(true),
      });

      // ─── Animated underline ───
      gsap.set(".skill-line", { scaleX: 0 });
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 70%",
        once: true,
        onEnter: () => {
          gsap.to(".skill-line", { scaleX: 1, duration: 1.2, ease: "power3.inOut", delay: 0.8 });
        },
      });

      // ─── Cards: unfold from center with clip-path wireframe phase ───
      const cards = gsap.utils.toArray<HTMLElement>(".bento-card");
      gsap.set(cards, {
        opacity: 0,
        scale: 0.7,
        y: 60,
        rotateX: 15,
        transformOrigin: "center bottom",
      });

      ScrollTrigger.batch(cards, {
        interval: 0.1,
        batchMax: 4,
        onEnter: (batch) => {
          // Phase 1: wireframe outline appearance
          gsap.to(batch, {
            opacity: 0.3,
            scale: 0.85,
            y: 30,
            rotateX: 8,
            stagger: 0.08,
            duration: 0.4,
            ease: "power2.out",
            overwrite: true,
            onComplete: () => {
              // Phase 2: fill in fully
              gsap.to(batch, {
                opacity: 1,
                scale: 1,
                y: 0,
                rotateX: 0,
                stagger: 0.06,
                duration: 0.6,
                ease: "power4.out",
                overwrite: true,
              });
            },
          });
        },
        onLeaveBack: (batch) =>
          gsap.set(batch, { opacity: 0, y: 60, scale: 0.7, rotateX: 15, overwrite: true }),
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={containerRef}
      style={{
        minHeight: "100vh",
        padding: "10vh 8vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        zIndex: 2,
        backgroundColor: "var(--bg-dark)",
        color: "var(--text-light)",
      }}
    >
      {/* Background decoration */}
      <div style={{
        position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none"
      }}>
        <div style={{
          position: "absolute",
          top: "10%", right: "-10%",
          width: "500px", height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)",
          filter: isMobile ? "blur(50px)" : "blur(80px)",
        }} />
        <div style={{
          position: "absolute",
          bottom: "10%", left: "-5%",
          width: "400px", height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(15,76,129,0.06) 0%, transparent 70%)",
          filter: isMobile ? "blur(40px)" : "blur(60px)",
        }} />
      </div>

      {/* Section Heading with Typewriter Decode */}
      <div style={{ textAlign: "center", marginBottom: "4rem", position: "relative", zIndex: 1 }}>
        <div
          className="data-label skill-label"
          style={{
            marginBottom: "0.75rem",
            color: "var(--accent-vivid)",
            opacity: decodeTriggered ? 1 : 0,
            transform: decodeTriggered ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          Research Enablers
        </div>
        <h2
          className="skill-title"
          style={{
            fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
            color: "var(--text-light)",
            opacity: decodeTriggered ? 1 : 0,
            transform: decodeTriggered ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s",
          }}
        >
          <DecodeText text="Technical Stack" trigger={decodeTriggered} />
        </h2>
        <div
          className="skill-line animated-line"
          style={{ width: "60px", margin: "1.5rem auto 0" }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          perspective: isMobile ? "none" : "1200px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {skills.map((skill, i) => (
          <BentoCard key={skill.category} skill={skill} index={i} isMobile={isMobile} />
        ))}
      </div>
    </section>
  );
}
