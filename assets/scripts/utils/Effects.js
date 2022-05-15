import * as THREE from 'three';
import { scene, camera, renderer } from './Init';
import { userStruct } from '../user';

var geometry,
    material,
    mesh;

// Add a "star"
const AddStar = () => {

    geometry = new THREE.SphereGeometry(0.06, 5, 5);
    material = new THREE.MeshStandardMaterial({color: 0x55555});
    mesh = new THREE.Mesh(geometry, material);
    
    let [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    
    mesh.position.set(x, y, z);
    scene.add(mesh);
};

// Recursive functions
const AnimateScene = () => {
    if (!userStruct.isAnimationPlaying) return;

    requestAnimationFrame(AnimateScene);

    camera.position.z -= 0.0125;
    renderer.render(scene, camera);
};

export { 
    AddStar,
    AnimateScene,
    geometry,
    material,
    mesh
};