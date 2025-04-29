import { Environment as EnvironmentImpl, ContactShadows } from "@react-three/drei";

export default function Environment() {
  return (
    <>
      {/* Environment lighting */}
      <EnvironmentImpl
        preset="city"
        background={false}
        blur={0.6}
      />
      
      {/* Ground shadow */}
      <ContactShadows
        opacity={0.4}
        scale={10}
        blur={1}
        far={10}
        resolution={256}
        color="#000000"
      />
      
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.025, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <shadowMaterial transparent opacity={0.4} />
      </mesh>
    </>
  );
}
