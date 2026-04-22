"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function BlockchainCrystal() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = ""; // Prevent duplicate canvases

    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Material
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x0f4c81,
      metalness: 0.6,
      roughness: 0.15,
      transmission: 0.4,
      thickness: 1.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });

    // Monolithic Crystal
    const geometry = new THREE.IcosahedronGeometry(2.5, 0);
    const crystal = new THREE.Mesh(geometry, material);
    scene.add(crystal);

    // Shards
    const shards: THREE.Mesh[] = [];
    const shardGeo = new THREE.TetrahedronGeometry(0.3);
    for (let i = 0; i < 80; i++) {
      const shard = new THREE.Mesh(shardGeo, material);
      shard.position.set(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      );
      shard.visible = false;
      shard.userData = {
        targetX: (Math.random() - 0.5) * 12,
        targetY: (Math.random() - 0.5) * 12,
        targetZ: (Math.random() - 0.5) * 12,
      };
      scene.add(shard);
      shards.push(shard);
    }

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);
    const blueLight = new THREE.PointLight(0x1a75c2, 3, 15);
    blueLight.position.set(-3, 2, 4);
    scene.add(blueLight);

    camera.position.z = 7;

    // ScrollTrigger — crystal stays intact for the first 40% of scroll
    const trig = ScrollTrigger.create({
      trigger: container,
      start: "top top",        // Only starts when section fills the viewport
      end: "bottom -50%",      // Extended range for slower progression
      scrub: 1.5,
      onUpdate: (self) => {
        const p = self.progress;
        if (p > 0.4) {
          // Remap progress: 0.4→1.0 becomes 0→1 for the shatter
          const shatterProgress = (p - 0.4) / 0.6;
          crystal.visible = false;
          const ease = gsap.parseEase("power2.out")(shatterProgress);
          shards.forEach((s) => {
            s.visible = true;
            s.position.x = s.userData.targetX * ease;
            s.position.y = s.userData.targetY * ease;
            s.position.z = s.userData.targetZ * ease;
          });
        } else {
          crystal.visible = true;
          shards.forEach((s) => (s.visible = false));
        }
      },
    });

    // Render Loop
    let animId: number;
    const render = () => {
      const vel = Math.abs(trig.getVelocity()) / 10000 || 0;
      const spin = 0.004 + vel;
      crystal.rotation.x += spin;
      crystal.rotation.y += spin * 0.7;
      shards.forEach((s) => {
        if (s.visible) {
          s.rotation.x += spin * 1.5;
          s.rotation.y += spin * 1.5;
        }
      });
      renderer.render(scene, camera);
      animId = requestAnimationFrame(render);
    };
    render();

    // Resize
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
      trig.kill();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      shardGeo.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}
