"use client";

import React, { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

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

function BentoCard({
  skill,
  index,
}: {
  skill: (typeof skills)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 250, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 250, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

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

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(".skill-label", { opacity: 0, y: 20 });
      gsap.set(".skill-title", { opacity: 0, y: 30 });
      gsap.set(".skill-line", { scaleX: 0 });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 70%",
        once: true,
        onEnter: () => {
          gsap.to(".skill-label", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
          gsap.to(".skill-title", { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.1 });
          gsap.to(".skill-line", { scaleX: 1, duration: 1.2, ease: "power3.inOut", delay: 0.3 });
        },
      });

      gsap.set(".bento-card", { opacity: 0, y: 50, scale: 0.96 });

      ScrollTrigger.batch(".bento-card", {
        interval: 0.08,
        batchMax: 4,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.08,
            overwrite: true,
            duration: 0.8,
            ease: "power4.out",
          }),
        onLeaveBack: (batch) =>
          gsap.set(batch, { opacity: 0, y: 50, scale: 0.96, overwrite: true }),
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
          filter: "blur(80px)",
        }} />
        <div style={{
          position: "absolute",
          bottom: "10%", left: "-5%",
          width: "400px", height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(15,76,129,0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
        }} />
      </div>

      {/* Section Heading */}
      <div style={{ textAlign: "center", marginBottom: "4rem", position: "relative", zIndex: 1 }}>
        <div className="data-label skill-label" style={{ marginBottom: "0.75rem", color: "var(--accent-vivid)" }}>
          Research Enablers
        </div>
        <h2
          className="skill-title"
          style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)", color: "var(--text-light)" }}
        >
          Technical Stack
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
          perspective: "1200px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {skills.map((skill, i) => (
          <BentoCard key={skill.category} skill={skill} index={i} />
        ))}
      </div>
    </section>
  );
}
