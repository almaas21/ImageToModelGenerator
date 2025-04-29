import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import { useModelStore } from "@/lib/stores/useModelStore";
import { ModelObject } from "@/lib/models";
import Lights from "./Lights";
import Environment from "./Environment";
import Controls from "./Controls";
import LoadingScreen from "../Loading/LoadingScreen";
import DownloadButton from "./DownloadButton";
import { useGLTF, Html, Center } from "@react-three/drei";
import * as THREE from "three";

export default function ModelViewer() {
  const { currentModel, isModelLoading } = useModelStore();
  
  return (
    <div className="w-full h-full min-h-[500px] relative">
      {isModelLoading && <LoadingScreen />}
      
      <DownloadButton />
      
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
        
        <Suspense fallback={<ModelLoader />}>
          {currentModel && <Model model={currentModel} />}
        </Suspense>
        
        <Controls />
      </Canvas>
    </div>
  );
}

// Loading indicator within 3D scene
const ModelLoader = () => {
  return (
    <Html center>
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">Loading model...</p>
      </div>
    </Html>
  );
};

// Model component that handles both primitive shapes and glTF models
const Model = ({ model }: { model: ModelObject }) => {
  const [modelError, setModelError] = useState<string | null>(null);
  
  // For primitive shapes
  if (model.type === 'primitive') {
    return (
      <Center>
        <group scale={model.scale || 1}>
          <mesh castShadow receiveShadow>
            {model.shape === 'box' && <boxGeometry args={[1, 1, 1]} />}
            {model.shape === 'sphere' && <sphereGeometry args={[0.7, 32, 32]} />}
            {model.shape === 'torus' && <torusGeometry args={[0.7, 0.3, 16, 32]} />}
            {model.shape === 'cylinder' && <cylinderGeometry args={[0.5, 0.5, 1.5, 32]} />}
            <meshStandardMaterial 
              color={model.color || "#1E88E5"} 
              roughness={0.4} 
              metalness={0.6} 
            />
          </mesh>
        </group>
      </Center>
    );
  }
  
  // For glTF models
  if (model.type === 'gltf' && model.modelUrl) {
    try {
      const { scene } = useGLTF(model.modelUrl);
      
      useEffect(() => {
        // Apply color to the model if specified
        if (model.color) {
          scene.traverse((node) => {
            if (node instanceof THREE.Mesh) {
              node.material = new THREE.MeshStandardMaterial({
                color: model.color,
                roughness: 0.4,
                metalness: 0.6
              });
            }
          });
        }
        
        // Apply shadows
        scene.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });
      }, [scene, model.color]);
      
      return (
        <Center>
          <group scale={model.scale || 1}>
            <primitive object={scene} />
          </group>
        </Center>
      );
    } catch (error) {
      console.error("Failed to load glTF model:", error);
      setModelError("Failed to load 3D model");
    }
  }
  
  // Error state or fallback
  if (modelError) {
    return (
      <Html center>
        <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md">
          {modelError}
        </div>
      </Html>
    );
  }
  
  // Default fallback
  return (
    <Center>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color="#1E88E5" />
      </mesh>
    </Center>
  );
};
