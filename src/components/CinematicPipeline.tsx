import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileText, FileSpreadsheet, FileIcon, FileImage, FileCode2 } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

const files = [
  { name: 'invoice.pdf', type: 'PDF', icon: FileText, color: '#ef4444' },
  { name: 'sales.xlsx', type: 'XLSX', icon: FileSpreadsheet, color: '#10b981' },
  { name: 'contract.docx', type: 'DOCX', icon: FileIcon, color: '#3b82f6' },
  { name: 'drawing.dwg', type: 'DWG', icon: FileImage, color: '#f59e0b' },
  { name: 'report.txt', type: 'TXT', icon: FileCode2, color: '#f8fafc' },
];

export const CinematicPipeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Phase 1 HTML Refs
  const orbitContainerRef = useRef<HTMLDivElement>(null);
  const fileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const gearCenterRef = useRef<HTMLDivElement>(null);
  const bloomFlashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=400%',
          pin: true,
          scrub: 1,
        },
      });

      // 0% - 20%: Scroll Acceleration
      tl.to(orbitContainerRef.current, {
        rotation: 720,
        scale: 0.8,
        ease: 'power1.in',
      }, 0);

      tl.to(gearCenterRef.current, {
        rotation: 1440,
        scale: 1.5,
        ease: 'power2.in',
      }, 0);

      // 20% - 25%: Attraction & Pulse
      fileRefs.current.forEach((el) => {
        tl.to(el, {
          x: 0,
          y: 0,
          scale: 0,
          opacity: 0,
          ease: 'expo.in',
        }, 0.2); // Start at 20%
      });

      // 25%: The Blast / Bloom Spike
      tl.to(bloomFlashRef.current, {
        opacity: 1,
        duration: 0.05,
      }, 0.25);
      
      tl.to(bloomFlashRef.current, {
        opacity: 0,
        duration: 0.2,
      }, 0.26);

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-[500vh] w-full bg-[#020617] overflow-hidden text-white">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ParticleCanvas />
      </div>

      {/* HTML OVERLAY FOR PHASE 1 */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none" style={{ perspective: '1200px' }}>
        
        {/* Central Metallic Gear Engine */}
        <div ref={gearCenterRef} className="absolute flex items-center justify-center drop-shadow-[0_0_30px_rgba(59,130,246,0.6)]">
          {/* Main Gear */}
          <svg viewBox="0 0 100 100" className="absolute w-64 h-64 text-slate-700 animate-[spin_10s_linear_infinite]">
            <path fill="currentColor" d="M93.5,43.3l-8.5-1.4c-0.8-3.1-2-6-3.6-8.7l5.4-6.7c1.3-1.6,1.1-3.9-0.4-5.4L78,12.7c-1.5-1.5-3.8-1.7-5.4-0.4 l-6.7,5.4c-2.7-1.6-5.6-2.8-8.7-3.6L55.8,5.6C55.4,3.5,53.6,2,51.5,2h-4.8c-2.1,0-3.9,1.5-4.3,3.6l-1.4,8.5 c-3.1,0.8-6,2-8.7,3.6l-6.7-5.4c-1.6-1.3-3.9-1.1-5.4,0.4L11.8,21.1c-1.5,1.5-1.7,3.8-0.4,5.4l5.4,6.7c-1.6,2.7-2.8,5.6-3.6,8.7 l-8.5,1.4C2.6,43.7,1,45.5,1,47.6v4.8c0,2.1,1.5,3.9,3.6,4.3l8.5,1.4c0.8,3.1,2,6,3.6,8.7l-5.4,6.7c-1.3,1.6-1.1,3.9,0.4,5.4 l8.4,8.4c1.5,1.5,3.8,1.7,5.4,0.4l6.7-5.4c2.7,1.6,5.6,2.8,8.7,3.6l1.4,8.5c0.4,2.1,2.2,3.6,4.3,3.6h4.8c2.1,0,3.9-1.5,4.3-3.6 l1.4-8.5c3.1-0.8,6-2,8.7-3.6l6.7,5.4c1.6,1.3,3.9,1.1,5.4-0.4l8.4-8.4c1.5-1.5,1.7-3.8,0.4-5.4l-5.4-6.7c1.6-2.7,2.8-5.6,3.6-8.7 l8.5-1.4c2.1-0.4,3.6-2.2,3.6-4.3v-4.8C98.2,45.5,96.6,43.7,93.5,43.3z M49.1,68c-10.4,0-18.9-8.5-18.9-18.9S38.7,30.2,49.1,30.2 S68,38.7,68,49.1S59.5,68,49.1,68z" />
          </svg>
          {/* Inner Counter Gear */}
          <svg viewBox="0 0 100 100" className="absolute w-32 h-32 text-blue-500/80 animate-[spin_4s_linear_infinite_reverse]">
            <path fill="currentColor" d="M89.7,45.7l-7.6-1.3c-0.7-3.2-1.8-6.3-3.3-9.1l5.4-5.6c1-1.1,0.9-2.8-0.2-3.8l-5.6-5.6c-1.1-1.1-2.8-1.2-3.8-0.2 l-5.6,5.4c-2.8-1.5-5.9-2.6-9.1-3.3l-1.3-7.6C58.2,13.2,56.8,12,55.3,12h-10.6c-1.5,0-2.9,1.2-3.3,2.6l-1.3,7.6 c-3.2,0.7-6.3,1.8-9.1,3.3l-5.6-5.4c-1.1-1-2.8-0.9-3.8,0.2l-5.6,5.6c-1.1,1.1-1.2,2.8-0.2,3.8l5.4,5.6c-1.5,2.8-2.6,5.9-3.3,9.1 l-7.6,1.3c-1.4,0.4-2.6,1.8-2.6,3.3v10.6c0,1.5,1.2,2.9,2.6,3.3l7.6,1.3c0.7,3.2,1.8,6.3,3.3,9.1l-5.4,5.6c-1,1.1-0.9,2.8,0.2,3.8 l5.6,5.6c1.1,1.1,2.8,1.2,3.8,0.2l5.6-5.4c2.8,1.5,5.9,2.6,9.1,3.3l1.3,7.6c0.4,1.4,1.8,2.6,3.3,2.6h10.6c1.5,0,2.9-1.2,3.3-2.6 l1.3-7.6c3.2-0.7,6.3-1.8,9.1-3.3l5.6,5.4c1.1,1,2.8,0.9,3.8-0.2l5.6-5.6c1.1-1.1,1.2-2.8,0.2-3.8l-5.4-5.6 c1.5-2.8,2.6-5.9,3.3-9.1l7.6-1.3c1.4-0.4,2.6-1.8,2.6-3.3v-10.6C92.3,47.5,91.1,46.1,89.7,45.7z M50,67c-9.4,0-17-7.6-17-17 s7.6-17,17-17s17,7.6,17,17S59.4,67,50,67z" />
          </svg>
          <div className="absolute w-12 h-12 rounded-full bg-[#020617] border-[6px] border-slate-700" />
        </div>

        {/* Orbiting Files */}
        <div ref={orbitContainerRef} className="absolute w-0 h-0 animate-[spin_30s_linear_infinite]" style={{ transformStyle: 'preserve-3d' }}>
          {files.map((file, i) => {
            const Icon = file.icon;
            const radius = 350 + (i % 2 === 0 ? 0 : 50); // Alternating orbits
            const angle = (i / files.length) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <div
                key={file.name}
                ref={(el) => { fileRefs.current[i] = el; }}
                className="absolute flex flex-col items-center justify-center p-3 w-32 rounded-xl glass-card backdrop-blur-xl border border-white/10"
                style={{
                  left: x,
                  top: y,
                  background: 'rgba(30, 41, 59, 0.7)',
                  boxShadow: `0 0 20px ${file.color}40`,
                  transform: `translate(-50%, -50%) rotateX(15deg) rotateY(15deg) rotateZ(${-angle}rad)`, // Counter-rotate
                  transformStyle: 'preserve-3d'
                }}
              >
                <Icon className="w-8 h-8 mb-2" style={{ color: file.color }} />
                <span className="font-mono text-xs font-bold text-slate-200">{file.name}</span>
                <div className="absolute -z-10 w-full h-full rounded-xl blur-md opacity-50" style={{ background: file.color }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Screen Bloom Flash (Critical Moment) */}
      <div ref={bloomFlashRef} className="absolute inset-0 z-50 bg-white opacity-0 pointer-events-none mix-blend-screen" />
    </section>
  );
};

// ==========================================
// THREE.JS CANVAS FOR PHASE 2 (PARTICLES)
// ==========================================
const ParticleCanvas = () => {
  return (
    <Canvas camera={{ position: [0, 0, 100], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={10} color="#3b82f6" />
      
      <ParticleSystem />

      <EffectComposer>
        <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={2.5} />
        <ChromaticAberration offset={new THREE.Vector2(0.002, 0.002)} />
      </EffectComposer>
    </Canvas>
  );
};

// ==========================================
// THE TEXT PARTICLE EXPLOSION (Three.js)
// ==========================================
const ParticleSystem = () => {
  const groupRef = useRef<THREE.Group>(null);
  const scrollRef = useRef({ progress: 0 });

  const texts = ["A", "B", "1", "9", "!", "$", "C", "X", "Y", "Z", "0", "4", "5", "8", "7", "I", "N", "V", "O", "C", "E", "R", "E", "P", "O", "R", "T", "D", "A", "T"];
  
  useEffect(() => {
    ScrollTrigger.create({
      trigger: 'section', 
      start: 'top top',
      end: '+=400%',
      onUpdate: (self) => {
        scrollRef.current.progress = self.progress;
      }
    });
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    const progress = scrollRef.current.progress;

    groupRef.current.children.forEach((mesh, i) => {
      if (progress < 0.25) {
        mesh.position.set(0, 0, 0);
        mesh.scale.setScalar(0.001); // Hide initially
      } else if (progress >= 0.25 && progress < 0.4) {
        // Explosion phase! Normalize from 0 to 1
        const expProgress = (progress - 0.25) / 0.15;
        // Pseudo-random trajectories
        const dirX = Math.sin(i * 13.1) * 80;
        const dirY = Math.cos(i * 17.3) * 80;
        const dirZ = Math.sin(i * 19.7) * 80 - 20;

        mesh.position.x = dirX * (expProgress ** 0.5); // Fast out easing
        mesh.position.y = dirY * (expProgress ** 0.5);
        mesh.position.z = dirZ * (expProgress ** 0.5);
        mesh.scale.setScalar(1);
        mesh.rotation.x = expProgress * 5 * i;
        mesh.rotation.y = expProgress * 3 * i;
      } else {
        // Data Collection Phase (progress >= 0.4)
        const collProgress = Math.min((progress - 0.4) / 0.2, 1);
        const ringRadius = 30;
        const angle = i * 0.1 + collProgress * 5; 
        
        // Target ring
        const targetX = Math.cos(angle) * ringRadius;
        const targetY = Math.sin(angle) * ringRadius;
        
        mesh.position.x += (targetX - mesh.position.x) * 0.05;
        mesh.position.y += (targetY - mesh.position.y) * 0.05;
        mesh.position.z += (0 - mesh.position.z) * 0.05;
        mesh.rotation.z = angle;
      }
    });
    
    // Rotate the entire cloud
    groupRef.current.rotation.y = progress * 2;
    groupRef.current.rotation.z = progress * 1;
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 250 }).map((_, i) => (
        <Text
          key={i}
          color={['#ef4444', '#10b981', '#3b82f6', '#f59e0b', '#f8fafc'][i % 5]}
          fontSize={2.5}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#020617"
        >
          {texts[i % texts.length]}
        </Text>
      ))}
    </group>
  );
};
