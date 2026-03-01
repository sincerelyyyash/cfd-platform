"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Float } from "@react-three/drei";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";

const SPHERE_MODEL_PATH = "/fibonacci_sphere.glb";

const SphereModel = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(SPHERE_MODEL_PATH);
  const { invalidate } = useThree();

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);

    const normalizedScale = 1 / maxDim;
    clone.scale.setScalar(normalizedScale);

    const center = new THREE.Vector3();
    box.getCenter(center);
    clone.position.sub(center.multiplyScalar(normalizedScale));

    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Simplified material — MeshLambertMaterial is far cheaper than
        // MeshStandardMaterial for the fragment shader on mobile/prod.
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#B19EEF"),
          metalness: 0.8,
          roughness: 0.3,
          envMapIntensity: 1.5,
        });
        // Removed castShadow / receiveShadow — no shadow-mapped light is
        // present, so these flags only add GPU state overhead for nothing.
      }
    });

    return clone;
  }, [scene]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.1;
    groupRef.current.rotation.x += delta * 0.025;
    // Notify Three.js a new frame is needed (required with frameloop="demand")
    invalidate();
  });

  const baseScale = 6.2;

  return (
    <Float speed={1} rotationIntensity={0.12} floatIntensity={0.3}>
      <group ref={groupRef} scale={baseScale}>
        <primitive object={clonedScene} />
      </group>
    </Float>
  );
};

const Sphere = () => {
  return (
    <div className="w-full h-full" aria-label="3D Sphere visualization">
      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          // Disable expensive tone-mapping post-process
          toneMapping: THREE.NoToneMapping,
        }}
        // flat skips the default ACESFilmic tone-mapping pass
        flat
        style={{ background: "transparent" }}
        // Lower DPR ceiling — was 1.8 (renders ~3.24× pixels vs 1×).
        // On Retina displays this massively cuts GPU work per frame.
        dpr={[1, 1.5]}
        // Only render when the model actually changes, not on every RAF tick.
        // The model uses invalidate() in useFrame to drive rendering.
        frameloop="demand"
        // Allow Three.js to auto-scale resolution when FPS drops too low.
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          {/* Simplified lighting — 2 sources instead of 5.
              Each light adds a full shader pass per pixel per frame. */}
          <ambientLight intensity={0.3} color="#ffffff" />
          <directionalLight position={[4, 5, 4]} intensity={1.6} color="#ffffff" />
          <SphereModel />
        </Suspense>
      </Canvas>
    </div>
  );
};

useGLTF.preload(SPHERE_MODEL_PATH);

export default Sphere;
