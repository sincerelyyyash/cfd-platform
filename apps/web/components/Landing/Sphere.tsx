"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Float } from "@react-three/drei";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";

const SPHERE_MODEL_PATH = "/fibonacci_sphere.glb";

const SphereModel = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(SPHERE_MODEL_PATH);

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
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#c8ccd4"),
          metalness: 1,
          roughness: 0.18,
          envMapIntensity: 2,
        });
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    return clone;
  }, [scene]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.1;
    groupRef.current.rotation.x += delta * 0.025;
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
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
        dpr={[1, 1.8]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.15} color="#ffffff" />
          <directionalLight position={[5, 5, 5]} intensity={1.4} color="#ffffff" />
          <directionalLight position={[-4, -3, -5]} intensity={0.3} color="#a0a0a0" />
          <pointLight position={[2, 4, 3]} intensity={0.6} color="#e0e0e0" />
          <pointLight position={[-3, -2, 4]} intensity={0.2} color="#808080" />
          <SphereModel />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
};

useGLTF.preload(SPHERE_MODEL_PATH);

export default Sphere;
