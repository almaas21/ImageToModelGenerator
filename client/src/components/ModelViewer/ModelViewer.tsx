import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { useModelStore } from "@/lib/stores/useModelStore";
import { ModelObject } from "@/lib/models";
import Lights from "./Lights";
import Environment from "./Environment";
import Controls from "./Controls";
import LoadingScreen from "../Loading/LoadingScreen";

export default function ModelViewer() {
  const { currentModel } = useModelStore();
  
  return (
    <div className="w-full h-full min-h-[500px]">
      <Canvas
        shadows
        camera={{ position: [0, 1, 5], fov: 45 }}
        gl={{ 
          antialias: true,
          powerPreference: "default",
          alpha: true
        }}
      >
        <color attach="background" args={["#f5f5f5"]} />
        
        <Lights />
        <Environment />
        
        <Suspense fallback={null}>
          {currentModel && <Model model={currentModel} />}
        </Suspense>
        
        <Controls />
      </Canvas>
    </div>
  );
}

const Model = ({ model }: { model: ModelObject }) => {
  return (
    <group position={[0, 0, 0]} scale={model.scale || 1}>
      {/* This is where the actual 3D model would be loaded */}
      <mesh castShadow receiveShadow>
        {model.type === 'primitive' ? (
          // Use a primitive shape for mock models
          <>
            {model.shape === 'box' && <boxGeometry args={[1, 1, 1]} />}
            {model.shape === 'sphere' && <sphereGeometry args={[0.7, 32, 32]} />}
            {model.shape === 'torus' && <torusGeometry args={[0.7, 0.3, 16, 32]} />}
            {model.shape === 'cylinder' && <cylinderGeometry args={[0.5, 0.5, 1.5, 32]} />}
          </>
        ) : (
          // For GLTF models, we would use useGLTF hook here
          // e.g., <primitive object={gltf.scene} />
          <sphereGeometry args={[0.7, 32, 32]} />
        )}
        <meshStandardMaterial 
          color={model.color || "#1E88E5"} 
          roughness={0.4} 
          metalness={0.6} 
        />
      </mesh>
    </group>
  );
};
