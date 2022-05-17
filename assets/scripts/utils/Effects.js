import * as THREE from 'three';
import { scene, camera, renderer } from './Init';
import { userStruct } from '../user';

var geometry,
    material,
    mesh;

var colors = [
    0x34eb34,
    0x34b1eb,
    0xeb34e2,
    0xebd334
];

// Add a "star"
const AddStar = () => {

    geometry = new THREE.SphereGeometry(0.06, 5, 5);
    material = new THREE.MeshStandardMaterial({color: colors[Math.floor(Math.random() * colors.length)]});
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