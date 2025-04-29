import * as THREE from "three";

export default function Lights() {
  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.3} />
      
      {/* Main directional light with shadow */}
      <directionalLight
        castShadow
        position={[1, 2, 3]}
        intensity={1.5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Fill light */}
      <directionalLight 
        position={[-5, 5, -5]} 
        intensity={0.5} 
        color={new THREE.Color(0x99ccff)}
      />
      
      {/* Rim light */}
      <spotLight
        position={[5, 7, -5]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        distance={15}
        color={new THREE.Color(0xffffcc)}
      />
    </>
  );
}
