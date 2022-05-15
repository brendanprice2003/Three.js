import { THREE, FontLoader, TextGeometry } from '../../../main';
import { scene } from './Init';

let fontLoader = new FontLoader(),
    leftIndex = 18,
    rightIndex = 18,
    log = console.log.bind(console);

// Generate random integer between range
var randInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

// Add text to the scene
const AddText = (text, s) => {

    fontLoader.load('www/fonts/font.json', (font) => {

        let textGeom = new TextGeometry(`${text}`, {
            font: font,
            size: 0.75,
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