import { THREE } from '../../../main';
import { scene } from './Init';

var pointLight,
    ambientLight;

// Add lighting
const AddLighting = () => {

    pointLight = new THREE.PointLight(0xffffff);
    ambientLight = new THREE.AmbientLight(0xffffff);

    scene.add(pointLight, ambientLight);
};

export { 
    AddLighting,
    pointLight,
    ambientLight
};