import React, { Suspense, useRef, useState, useEffect } from "react";
import type { Mesh } from "three";

const CssFallbackOrb: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div className="relative w-[500px] h-[500px] flex items-center justify-center">
      <div
        style={{
          position: "absolute",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background: "radial-gradient(circle at 35% 35%, #8B5CF6 0%, #00D4FF 40%, transparent 70%)",
          filter: "blur(50px)",
          opacity: 0.6,
          animation: "orbPulse 6s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          border: "1px solid rgba(0,212,255,0.2)",
          background: "radial-gradient(circle at 40% 30%, rgba(0,212,255,0.25) 0%, rgba(139,92,246,0.15) 50%, transparent 70%)",
          animation: "orbFloat 8s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          border: "1px solid rgba(139,92,246,0.1)",
          animation: "orbRotate 14s linear infinite",
          background: "conic-gradient(from 0deg, transparent 65%, rgba(139,92,246,0.18) 80%, transparent 92%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,212,255,0.55) 0%, rgba(139,92,246,0.35) 40%, transparent 70%)",
          filter: "blur(22px)",
          animation: "orbPulse 4s ease-in-out infinite alternate",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "conic-gradient(from 90deg, transparent 50%, rgba(0,212,255,0.07) 60%, transparent 70%)",
          animation: "orbRotate 20s linear infinite reverse",
        }}
      />
    </div>
    <style>{`
      @keyframes orbPulse {
        0%, 100% { transform: scale(1); opacity: 0.5; }
        50% { transform: scale(1.18); opacity: 0.85; }
      }
      @keyframes orbFloat {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-22px) rotate(120deg); }
        66% { transform: translateY(12px) rotate(240deg); }
      }
      @keyframes orbRotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return !!ctx;
  } catch {
    return false;
  }
}

const ThreeOrb = React.lazy(async () => {
  const [{ Canvas, useFrame }, { MeshDistortMaterial, Float }, THREE] = await Promise.all([
    import("@react-three/fiber"),
    import("@react-three/drei"),
    import("three"),
  ]);

  const Orb = () => {
    const meshRef = useRef<Mesh>(null);
    useFrame((state) => {
      if (!meshRef.current) return;
      const mouseX = (state.pointer.x * Math.PI) / 10;
      const mouseY = (state.pointer.y * Math.PI) / 10;
      meshRef.current.rotation.x += (mouseY + state.clock.elapsedTime * 0.1 - meshRef.current.rotation.x) * 0.05;
      meshRef.current.rotation.y += (mouseX + state.clock.elapsedTime * 0.15 - meshRef.current.rotation.y) * 0.05;
    });
    return (
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh ref={meshRef} scale={1.8}>
          <icosahedronGeometry args={[1, 64]} />
          <MeshDistortMaterial
            color="#00D4FF"
            envMapIntensity={1.5}
            clearcoat={0.8}
            clearcoatRoughness={0}
            metalness={0.9}
            roughness={0.1}
            distort={0.4}
            speed={2}
          />
        </mesh>
      </Float>
    );
  };

  const ThreeScene: React.FC = () => (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ alpha: true, antialias: true }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#8B5CF6" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#00D4FF" />
        <Orb />
      </Canvas>
    </div>
  );

  return { default: ThreeScene };
});

export const OrbCanvas: React.FC = () => {
  const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setWebGLSupported(detectWebGL());
  }, []);

  if (webGLSupported === null) return null;

  if (!webGLSupported) {
    return (
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <CssFallbackOrb />
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <Suspense fallback={<CssFallbackOrb />}>
        <ThreeOrb />
      </Suspense>
    </div>
  );
};

export default OrbCanvas;
