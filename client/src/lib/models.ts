export interface ModelObject {
  id: string;
  name: string;
  type: 'primitive' | 'gltf';
  shape?: 'box' | 'sphere' | 'torus' | 'cylinder'; // For primitive types
  color?: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  modelUrl?: string; // URL to the 3D model file (for glTF models)
}

// Map of keywords to model types for the demo
const keywordToModelMap: Record<string, string> = {
  // Animals
  'cat': 'sphere',
  'dog': 'box',
  'animal': 'sphere',
  
  // Vehicles
  'car': 'box',
  'sports car': 'box',
  'vehicle': 'box',
  'truck': 'box',
  'spaceship': 'cylinder',
  
  // Furniture
  'chair': 'box',
  'table': 'box',
  'desk': 'box',
  'furniture': 'box',
  
  // Nature
  'tree': 'cylinder',
  'plant': 'cylinder',
  'mountain': 'cylinder',
  'rock': 'torus',
  
  // Buildings
  'house': 'box',
  'building': 'box',
  'castle': 'cylinder',
  'tower': 'cylinder',
  
  // Default
  'default': 'sphere',
};

// Map of keywords to colors
const keywordToColorMap: Record<string, string> = {
  'red': '#E53935',
  'blue': '#1E88E5',
  'green': '#43A047',
  'yellow': '#FDD835',
  'purple': '#8E24AA',
  'pink': '#D81B60',
  'orange': '#FB8C00',
  'black': '#212121',
  'white': '#FAFAFA',
  'grey': '#757575',
  'gold': '#FFD700',
  'silver': '#C0C0C0',
  
  // Default
  'default': '#1976D2',
};

/**
 * Get a sample 3D model based on input string
 * For demo purposes, this maps keywords to primitive shapes
 */
export function getSampleModel(input: string = 'default'): ModelObject {
  const normalizedInput = input.toLowerCase();
  
  // Determine shape based on keywords
  let shape: 'box' | 'sphere' | 'torus' | 'cylinder' = 'sphere';
  for (const [keyword, modelType] of Object.entries(keywordToModelMap)) {
    if (normalizedInput.includes(keyword)) {
      shape = modelType as any;
      break;
    }
  }
  
  // Determine color based on keywords
  let color = '#1976D2'; // Default blue
  for (const [keyword, colorValue] of Object.entries(keywordToColorMap)) {
    if (normalizedInput.includes(keyword)) {
      color = colorValue;
      break;
    }
  }
  
  // Create a unique ID based on input
  const id = `model_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  
  return {
    id,
    name: input.substring(0, 30), // Truncate long names
    type: 'primitive',
    shape,
    color,
    scale: 1.0,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
  };
}

// Sample models for demonstration
export const SAMPLE_MODELS: ModelObject[] = [
  {
    id: 'car_red',
    name: 'Red Sports Car',
    type: 'primitive',
    shape: 'box',
    color: '#E53935',
    scale: 1.2,
  },
  {
    id: 'cat_orange',
    name: 'Orange Cat',
    type: 'primitive',
    shape: 'sphere',
    color: '#FB8C00',
    scale: 1.0,
  },
  {
    id: 'chair_brown',
    name: 'Modern Chair',
    type: 'primitive',
    shape: 'box',
    color: '#795548',
    scale: 0.9,
  },
  {
    id: 'tree_green',
    name: 'Pine Tree',
    type: 'primitive',
    shape: 'cylinder',
    color: '#2E7D32',
    scale: 1.5,
  },
  {
    id: 'spaceship_silver',
    name: 'Futuristic Spaceship',
    type: 'primitive',
    shape: 'cylinder',
    color: '#B0BEC5',
    scale: 1.3,
  },
];
