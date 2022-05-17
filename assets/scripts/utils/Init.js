import * as THREE from '../../../node_modules/three';

var scene,
    camera,
    renderer;

// Configure main components of the Three.js scene
const Initialize = () => {

    // Create scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 
        110,
        window.innerWidth / window.innerHeight,
        1,
        2000
    );

    // Create WebGL renderer
    renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#userBgThreeAnimation'),
        antialias: true,
    });

    // General props
    scene.background = new THREE.Color(0x22272e);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(30);

    // Render the configuration
    renderer.render(scene, camera);
};

export {
    Initialize,
    scene,
    camera,
    renderer
};
