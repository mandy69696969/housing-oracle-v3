'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const MiniGlobe = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current; // capture ref for cleanup
    if (!el) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    const size = el.clientWidth;
    renderer.setSize(size, size);
    el.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(2.1, 32, 32);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x1A3FD8,
      wireframe: true, 
      transparent: true, 
      opacity: 0.15 
    });
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    const innerGeo = new THREE.SphereGeometry(1.9, 16, 16);
    const innerMat = new THREE.MeshPhongMaterial({ color: 0x1A3FD8, opacity: 0.05, transparent: true });
    const innerGlobe = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerGlobe);

    const light = new THREE.PointLight(0xffffff, 1.2, 100);
    light.position.set(5, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    camera.position.z = 5;

    let frame: number;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      globe.rotation.y += 0.005;
      innerGlobe.rotation.y -= 0.002;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      if (el && renderer.domElement.parentNode === el) {
        el.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-10 h-10 flex items-center justify-center opacity-80" />;
};
