import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Hero3DCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Group for mouse parallax rotation
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 1. Central Holographic Geometric Core (Dual Sphere Wireframe & Points)
    const coreGeometry = new THREE.IcosahedronGeometry(2.2, 3);
    
    // Wireframe Material
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x00F0FF,
      wireframe: true,
      transparent: true,
      opacity: 0.28
    });
    const coreMesh = new THREE.Mesh(coreGeometry, wireMaterial);
    worldGroup.add(coreMesh);

    // Glowing Vertex Points
    const pointsMaterial = new THREE.PointsMaterial({
      color: 0x38BDF8,
      size: 0.045,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const corePoints = new THREE.Points(coreGeometry, pointsMaterial);
    worldGroup.add(corePoints);

    // Inner glowing sphere
    const innerGeometry = new THREE.SphereGeometry(1.4, 24, 24);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0x0070F3,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    worldGroup.add(innerMesh);

    // 2. Orbiting Cybernetic Rings
    const ringGeometry1 = new THREE.TorusGeometry(3.1, 0.018, 16, 100);
    const ringMaterial1 = new THREE.MeshBasicMaterial({
      color: 0x00F0FF,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const ring1 = new THREE.Mesh(ringGeometry1, ringMaterial1);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    worldGroup.add(ring1);

    const ringGeometry2 = new THREE.TorusGeometry(3.4, 0.015, 16, 100);
    const ringMaterial2 = new THREE.MeshBasicMaterial({
      color: 0x818CF8,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const ring2 = new THREE.Mesh(ringGeometry2, ringMaterial2);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 3;
    worldGroup.add(ring2);

    // 3. Orbiting Data Nodes
    const nodeGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x00F0FF });
    const nodes: THREE.Mesh[] = [];
    const nodeCount = 5;

    for (let i = 0; i < nodeCount; i++) {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      worldGroup.add(node);
      nodes.push(node);
    }

    // 4. Ambient Floating Particle Field
    const particleCount = 450;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 12;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 8;

      velocities.push({
        x: (Math.random() - 0.5) * 0.003,
        y: (Math.random() - 0.5) * 0.003,
        z: (Math.random() - 0.5) * 0.003
      });
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00F0FF,
      size: 0.035,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const particleCloud = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleCloud);

    // Mouse Interaction Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = currentMount.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX = (x / rect.width) * 2;
      mouseY = -(y / rect.height) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Window Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse damping
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      worldGroup.rotation.y = elapsedTime * 0.15 + targetX * 0.4;
      worldGroup.rotation.x = Math.sin(elapsedTime * 0.2) * 0.1 - targetY * 0.4;

      // Internal rotations
      coreMesh.rotation.y = elapsedTime * 0.2;
      corePoints.rotation.y = elapsedTime * 0.2;
      innerMesh.rotation.y = -elapsedTime * 0.3;

      ring1.rotation.z = elapsedTime * 0.35;
      ring2.rotation.z = -elapsedTime * 0.25;

      // Position nodes along ring path
      nodes.forEach((node, idx) => {
        const angle = elapsedTime * 0.6 + (idx * Math.PI * 2) / nodeCount;
        node.position.x = Math.cos(angle) * 3.1;
        node.position.z = Math.sin(angle) * 3.1;
        node.position.y = Math.sin(angle * 2) * 0.5;
      });

      // Slowly drift particles
      const posArray = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        posArray[i3] += velocities[i].x;
        posArray[i3 + 1] += velocities[i].y;
        posArray[i3 + 2] += velocities[i].z;

        // Wrap around bounds
        if (Math.abs(posArray[i3]) > 6) posArray[i3] = -posArray[i3];
        if (Math.abs(posArray[i3 + 1]) > 5) posArray[i3 + 1] = -posArray[i3 + 1];
        if (Math.abs(posArray[i3 + 2]) > 4) posArray[i3 + 2] = -posArray[i3 + 2];
      }
      particleGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Memory Disposal & Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      coreGeometry.dispose();
      wireMaterial.dispose();
      pointsMaterial.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      ringGeometry1.dispose();
      ringMaterial1.dispose();
      ringGeometry2.dispose();
      ringMaterial2.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();

      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="relative w-full h-[380px] sm:h-[460px] lg:h-[540px] flex items-center justify-center pointer-events-auto"
      style={{ touchAction: 'none' }}
      aria-label="3D Holographic Core Scene"
    />
  );
};
