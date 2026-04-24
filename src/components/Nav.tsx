"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "#philosophy", label: "Philosophy" },
    { href: "#skills", label: "Stack" },
    { href: "#deck", label: "Case Study" },
    { href: "#lab", label: "Lab" },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: "0 2rem",
        height: "var(--nav-height)",
        display: "flex",
        alignItems: "center",
        backgroundColor: scrolled ? "rgba(250, 250, 250, 0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid var(--hairline)" : "1px solid transparent",
        transition: "background-color 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          width: "100%",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "var(--text-primary)",
        }}
      >
        {/* Logo */}
        <a
          href="#top"
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: "0.8rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontWeight: 600,
            cursor: "none",
          }}
        >
          Shivam<span style={{ color: "var(--accent-color)" }}>.</span>Jha
        </a>

        {/* Nav Links */}
        <nav
          className="hide-mobile"
          style={{
            display: "flex",
            gap: "2.5rem",
            fontFamily: "var(--font-jetbrains)",
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
          }}
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                color: "var(--text-secondary)",
                position: "relative",
                cursor: "none",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--accent-color)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="mailto:mailshivamjha007@gmail.com"
          className="hide-mobile"
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--accent-color)",
            border: "1px solid rgba(15, 76, 129, 0.3)",
            padding: "0.5rem 1.2rem",
            borderRadius: "6px",
            cursor: "none",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(15, 76, 129, 0.08)";
            e.currentTarget.style.borderColor = "var(--accent-color)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.borderColor = "rgba(15, 76, 129, 0.3)";
          }}
        >
          Get in touch →
        </a>
      </div>
    </motion.header>
  );
}
