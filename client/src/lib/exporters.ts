import { ModelObject } from './models';
import * as THREE from 'three';

/**
 * Generate OBJ file content for a model
 */
export function generateObjFileContent(model: ModelObject): string {
  // Create a Three.js scene
  const scene = new THREE.Scene();
  
  // Create geometry based on model type
  let geometry: THREE.BufferGeometry;
  
  switch (model.shape) {
    case 'box':
      geometry = new THREE.BoxGeometry(1, 1, 1);
      break;
    case 'sphere':
      geometry = new THREE.SphereGeometry(0.7, 32, 32);
      break;
    case 'torus':
      geometry = new THREE.TorusGeometry(0.7, 0.3, 16, 32);
      break;
    case 'cylinder':
      geometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32);
      break;
    default:
      geometry = new THREE.SphereGeometry(0.7, 32, 32);
  }
  
  // Create material
  const material = new THREE.MeshStandardMaterial({
    color: model.color || '#1E88E5',
    roughness: 0.4,
    metalness: 0.6
  });
  
  // Create mesh and add to scene
  const mesh = new THREE.Mesh(geometry, material);
  
  // Apply scale
  if (model.scale) {
    mesh.scale.set(model.scale, model.scale, model.scale);
  }
  
  // Apply position
  if (model.position) {
    mesh.position.set(...model.position);
  }
  
  // Apply rotation
  if (model.rotation) {
    mesh.rotation.set(...model.rotation);
  }
  
  // Export to OBJ format manually
  let objContent = '# Generated OBJ file\n';
  
  // Add vertices
  if (geometry.getAttribute('position')) {
    const positions = geometry.getAttribute('position').array;
    for (let i = 0; i < positions.length; i += 3) {
      objContent += `v ${positions[i]} ${positions[i + 1]} ${positions[i + 2]}\n`;
    }
  }
  
  // Add normals if available
  if (geometry.getAttribute('normal')) {
    const normals = geometry.getAttribute('normal').array;
    for (let i = 0; i < normals.length; i += 3) {
      objContent += `vn ${normals[i]} ${normals[i + 1]} ${normals[i + 2]}\n`;
    }
  }
  
  // Add texture coordinates if available
  if (geometry.getAttribute('uv')) {
    const uvs = geometry.getAttribute('uv').array;
    for (let i = 0; i < uvs.length; i += 2) {
      objContent += `vt ${uvs[i]} ${uvs[i + 1]}\n`;
    }
  }
  
  // Add material info
  objContent += `usemtl material_${model.id}\n`;
  
  // Add faces
  if (geometry.index) {
    const indices = geometry.index.array;
    for (let i = 0; i < indices.length; i += 3) {
      const a = indices[i] + 1;
      const b = indices[i + 1] + 1;
      const c = indices[i + 2] + 1;
      
      if (geometry.getAttribute('normal') && geometry.getAttribute('uv')) {
        objContent += `f ${a}/${a}/${a} ${b}/${b}/${b} ${c}/${c}/${c}\n`;
      } else if (geometry.getAttribute('normal')) {
        objContent += `f ${a}//${a} ${b}//${b} ${c}//${c}\n`;
      } else {
        objContent += `f ${a} ${b} ${c}\n`;
      }
    }
  } else {
    // No indices - assume vertices are arranged as triangles
    const count = geometry.getAttribute('position').count;
    for (let i = 0; i < count; i += 3) {
      const a = i + 1;
      const b = i + 2;
      const c = i + 3;
      objContent += `f ${a} ${b} ${c}\n`;
    }
  }
  
  return objContent;
}

/**
 * Download model as OBJ file
 */
export function downloadModelAsObj(model: ModelObject) {
  // Generate OBJ content
  const objContent = generateObjFileContent(model);
  
  // Create a blob with the OBJ content
  const blob = new Blob([objContent], { type: 'text/plain' });
  
  // Create a download link
  const downloadLink = document.createElement('a');
  downloadLink.download = `${model.name.replace(/\s+/g, '_')}.obj`;
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.click();
  
  // Clean up
  URL.revokeObjectURL(downloadLink.href);
}