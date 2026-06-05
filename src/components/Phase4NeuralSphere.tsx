import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CameraController = ({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) => {
  const { camera } = useThree();

  useFrame(() => {
    // Camera starts at z=20, flies THROUGH the sphere to z=-5
    const p = scrollProgress.current;
    
    // Smooth interpolation for camera Z
    const targetZ = THREE.MathUtils.lerp(20, -5, p * p); // ease-in effect
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.1);
    
    // Slight rotation to add chaos as we fly through
    camera.rotation.z = p * Math.PI * 0.5;
  });

  return null;
};

const ParticleSphere = ({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 3000;

  const [positions, targetPositions] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const target = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      // Start: random cloud
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = 20 + Math.random() * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;

      // Target: Perfect dense sphere
      const r = 4 + Math.random() * 1.5;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      target[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      target[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      target[i * 3 + 2] = r * Math.cos(phi);
    }
    return [pos, target];
  }, []);

  useFrame((_state, delta) => {
    if (!pointsRef.current) return;
    
    const p = scrollProgress.current;
    const geom = pointsRef.current.geometry;
    const positionsArray = geom.attributes.position.array as Float32Array;

    const assembleProgress = Math.min(1, p * 2.5); // Assemble fast

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      positionsArray[idx] = THREE.MathUtils.lerp(positions[idx], targetPositions[idx], assembleProgress);
      positionsArray[idx + 1] = THREE.MathUtils.lerp(positions[idx + 1], targetPositions[idx + 1], assembleProgress);
      positionsArray[idx + 2] = THREE.MathUtils.lerp(positions[idx + 2], targetPositions[idx + 2], assembleProgress);
    }

    geom.attributes.position.needsUpdate = true;

    // Spin faster as we go deeper
    pointsRef.current.rotation.y += delta * (0.2 + p * 2);
    pointsRef.current.rotation.x += delta * 0.1;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00f2ff"
        size={0.09}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

export const Phase4NeuralSphere: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
          
          if (textRef.current) {
            // Fade in text precisely in the middle of the fly-through, then fade out
            let alpha = 0;
            if (self.progress > 0.4 && self.progress < 0.9) {
              alpha = Math.sin((self.progress - 0.4) * (Math.PI / 0.5));
            }
            textRef.current.style.opacity = Math.max(0, alpha).toString();
            textRef.current.style.transform = `translate(-50%, -50%) scale(${1 + self.progress * 2})`;
          }
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full bg-[#020617] overflow-hidden">
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <color attach="background" args={['#020617']} />
          <ambientLight intensity={0.5} />
          
          <CameraController scrollProgress={scrollProgress} />
          <ParticleSphere scrollProgress={scrollProgress} />

          {/* Post-processing Bloom for intense glowing vectors */}
          <EffectComposer>
            <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} opacity={2.5} />
          </EffectComposer>
        </Canvas>
      </div>

      {/* Center Text (Appears inside the sphere) */}
      <div 
        ref={textRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 z-10 pointer-events-none mix-blend-screen"
      >
        <div className="flex flex-col items-center">
          <span className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-sky-500 tracking-tighter drop-shadow-[0_0_30px_rgba(56,189,248,1)]">
            1536D
          </span>
          <span className="text-2xl md:text-4xl font-bold tracking-[0.6em] text-sky-200 uppercase mt-4 drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]">
            Vector Store
          </span>
        </div>
      </div>
    </section>
  );
};
