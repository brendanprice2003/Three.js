import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { scene } from './Init';
import { userStruct } from '../user';

let fontLoader = new FontLoader(),
    leftIndex = 18,
    rightIndex = 18;

// Generate random integer between range
const randInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

// Add text to the scene
const AddText = (text, s) => {

    fontLoader.load('../assets/fonts/font.json', (loadedFont) => {

        let textGeom = new TextGeometry(`${text}`, {
            font: loadedFont,
            size: JSON.parse(localStorage.getItem('userSettings')).moodboardItemSize || 0.75,
            height: 0
        });
      
        let textMesh = new THREE.Mesh(textGeom, [
            new THREE.MeshPhongMaterial({color: 0xffffff})
        ]);
      
        if (!s) {

            let side = randInt(0,1); // 0 = Left, 1 = Right
            if (!side) {
                textMesh.position.set(-15, randInt(-5, 10), leftIndex);
                leftIndex-=8;
            }
            else if (side) {
                textMesh.position.set(15, randInt(-5, 10), rightIndex);
                rightIndex-=8;
            };
        }
        else if (s === 'l') {

            textMesh.position.set(-15, randInt(-5, 10), leftIndex);
            leftIndex-=8;
        }
        else if (s === 'r') {

            textMesh.position.set(15, randInt(-5, 10), rightIndex);
            rightIndex-=8;
        };

        scene.add(textMesh);
    });
};

// Texture Mapping
const AddPictureObject = (imgUrl, opts, s) => {

    let objTexture = new THREE.TextureLoader().load(`${imgUrl}`),
        objMesh = new THREE.Mesh(
            new THREE.BoxGeometry(opts.width, opts.height, opts.depth),
            new THREE.MeshBasicMaterial({map: objTexture})
        );

    if (!s) {

        let side = randInt(0,1); // 0 = Left, 1 = Right
        if (!side) {

            objMesh.position.set(15, randInt(-5, 10), leftIndex)
            leftIndex-=8;
        }
        else if (side) {
            
            objMesh.position.set(15, randInt(-5, 10), rightIndex);
            rightIndex-=8;
        };
    }
    else if (s === 'l') {

        objMesh.position.set(-15, randInt(-5, 10), leftIndex);
        leftIndex-=8;
    }
    else if (s === 'r') {

        objMesh.position.set(15, randInt(-5, 10), rightIndex);
        rightIndex-=8;
    };

    scene.add(objMesh);
};

export { AddText, AddPictureObject };