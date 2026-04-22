"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function MinecraftAvatar() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = ''; // Prevent duplicate canvases from React Strict Mode

    // 1. Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.z = 8;
    camera.position.y = 0;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    // Match container size. We will make it a 400x400 square or let it resize.
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    const blueLight = new THREE.PointLight(0x0F4C81, 5, 10);
    blueLight.position.set(0, 2, 2);
    scene.add(blueLight);

    // 3. Materials
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, // Alabaster white base
      metalness: 0.2,
      roughness: 0.1,
      transmission: 0.6, // Glassy
      thickness: 0.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });

    const sapphireMaterial = new THREE.MeshStandardMaterial({
      color: 0x0F4C81,
      metalness: 0.8,
      roughness: 0.2
    });

    const blackMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      metalness: 0.9,
      roughness: 0.5
    });

    // 4. Constructing the Avatar
    const avatarGroup = new THREE.Group();

    // Torso
    const torsoGeo = new THREE.BoxGeometry(1, 1.5, 0.5);
    const torso = new THREE.Mesh(torsoGeo, glassMaterial);
    avatarGroup.add(torso);

    // Head Group (so we can rotate head + visor together)
    const headGroup = new THREE.Group();
    headGroup.position.y = 1.25; // Sit on top of torso

    const headGeo = new THREE.BoxGeometry(1, 1, 1);
    const head = new THREE.Mesh(headGeo, glassMaterial);
    headGroup.add(head);

    // Visor (Sapphire Blue)
    const visorGeo = new THREE.BoxGeometry(0.8, 0.25, 0.1);
    const visor = new THREE.Mesh(visorGeo, sapphireMaterial);
    visor.position.set(0, 0.1, 0.51); // Stick out the front
    headGroup.add(visor);

    // Eyes (Jet Black accents)
    const eyeGeo = new THREE.BoxGeometry(0.15, 0.15, 0.05);
    const leftEye = new THREE.Mesh(eyeGeo, blackMaterial);
    leftEye.position.set(-0.25, 0.1, 0.55);
    headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, blackMaterial);
    rightEye.position.set(0.25, 0.1, 0.55);
    headGroup.add(rightEye);

    avatarGroup.add(headGroup);

    // Arms
    const armGeo = new THREE.BoxGeometry(0.4, 1.5, 0.4);
    const leftArm = new THREE.Mesh(armGeo, glassMaterial);
    leftArm.position.set(-0.75, 0, 0);
    avatarGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, glassMaterial);
    rightArm.position.set(0.75, 0, 0);
    avatarGroup.add(rightArm);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.45, 1.5, 0.45);
    const leftLeg = new THREE.Mesh(legGeo, blackMaterial); // Black pants/legs for contrast
    leftLeg.position.set(-0.25, -1.5, 0);
    avatarGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, blackMaterial);
    rightLeg.position.set(0.25, -1.5, 0);
    avatarGroup.add(rightLeg);

    // Shift group up slightly to center it
    avatarGroup.position.y = 0.5;
    scene.add(avatarGroup);

    // 5. Interactive Mechanics (Mouse Tracking)
    let targetHeadRotationX = 0;
    let targetHeadRotationY = 0;
    let targetBodyRotationY = 0;

    const onMouseMove = (event: MouseEvent) => {
      // Normalize mouse coordinates from -1 to 1
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

      // Head tracks mouse aggressively
      targetHeadRotationY = mouseX * (Math.PI / 3); // max 60 deg
      targetHeadRotationX = -mouseY * (Math.PI / 4); // max 45 deg

      // Body tracks mouse subtly
      targetBodyRotationY = mouseX * (Math.PI / 6); // max 30 deg
    };
    window.addEventListener("mousemove", onMouseMove);

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // 6. Animation Loop
    let animationFrameId: number;
    let time = 0;

    const renderLoop = () => {
      time += 0.05;

      // Smooth interpolation for head and body rotation (Lerp)
      headGroup.rotation.y += (targetHeadRotationY - headGroup.rotation.y) * 0.1;
      headGroup.rotation.x += (targetHeadRotationX - headGroup.rotation.x) * 0.1;
      avatarGroup.rotation.y += (targetBodyRotationY - avatarGroup.rotation.y) * 0.05;

      // Gentle floating bob
      avatarGroup.position.y = 0.5 + Math.sin(time * 0.5) * 0.2;

      // Subtle arm swing
      leftArm.rotation.x = Math.sin(time) * 0.1;
      rightArm.rotation.x = -Math.sin(time) * 0.1;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      
      // Dispose geometries/materials
      torsoGeo.dispose();
      headGeo.dispose();
      visorGeo.dispose();
      eyeGeo.dispose();
      armGeo.dispose();
      legGeo.dispose();
      glassMaterial.dispose();
      sapphireMaterial.dispose();
      blackMaterial.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: "100%", 
        height: "100%", 
        pointerEvents: "none" // Let clicks pass through if needed
      }} 
    />
  );
}
