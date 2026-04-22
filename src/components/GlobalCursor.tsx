"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function GlobalCursor() {
  const [cursorType, setCursorType] = useState<"default" | "trusted" | "anxiety">("default");

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 300, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 25 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      if (target.closest("[data-cursor='anxiety']")) {
        setCursorType("anxiety");
      } else if (target.closest("[data-cursor='trusted']")) {
        setCursorType("trusted");
      } else {
        setCursorType("default");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Vibration effect using a simple interval instead of GSAP rough() (which requires paid plugin)
  const [vibrationOffset, setVibrationOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (cursorType !== "anxiety") {
      setVibrationOffset({ x: 0, y: 0 });
      return;
    }

    const intensity = 0.36; // Based on "Unclear Reason" data percentage
    const amplitude = 8 * intensity;

    const interval = setInterval(() => {
      setVibrationOffset({
        x: (Math.random() - 0.5) * 2 * amplitude,
        y: (Math.random() - 0.5) * 2 * amplitude,
      });
    }, 40); // ~25fps vibration

    return () => clearInterval(interval);
  }, [cursorType]);

  const variants = {
    default: {
      width: 10,
      height: 10,
      backgroundColor: "var(--accent-color)",
      borderRadius: "50%",
      border: "0px solid transparent",
      boxShadow: "0 0 8px var(--accent-glow)",
    },
    trusted: {
      width: 50,
      height: 50,
      backgroundColor: "rgba(15, 76, 129, 0.1)",
      borderRadius: "50%",
      border: "1px solid rgba(15, 76, 129, 0.4)",
      boxShadow: "0 0 20px rgba(15, 76, 129, 0.15)",
    },
    anxiety: {
      width: 32,
      height: 32,
      backgroundColor: "transparent",
      borderRadius: "0%",
      border: "2px solid var(--accent-color)",
      boxShadow: "none",
    },
  };

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        zIndex: 9999,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      animate={{
        ...variants[cursorType],
        x: vibrationOffset.x,
        y: vibrationOffset.y,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {cursorType === "anxiety" && (
        <>
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "1.5px",
              backgroundColor: "var(--accent-color)",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: "1.5px",
              height: "100%",
              backgroundColor: "var(--accent-color)",
            }}
          />
        </>
      )}
    </motion.div>
  );
}
