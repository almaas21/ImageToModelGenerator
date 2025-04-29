import { useRef } from "react";
import { OrbitControls, Grid, PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function Controls() {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  
  // Update controls on every frame
  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1, 5]} />
      
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        enableZoom={true}
        enablePan={true}
        rotateSpeed={0.5}
        minDistance={2}
        maxDistance={20}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        target={new THREE.Vector3(0, 0, 0)}
        camera={camera}
      />
      
      {/* Grid helper for orientation */}
      <Grid
        infiniteGrid
        cellSize={1}
        cellThickness={0.6}
        cellColor="#6f6f6f"
        sectionSize={5}
        sectionThickness={1.2}
        sectionColor="#9d4b4b"
        fadeDistance={30}
        fadeStrength={1}
        followCamera={false}
        position={[0, -0.01, 0]}
      />
    </>
  );
}
