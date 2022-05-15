import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import './www/style/style.css';

import { Initialize } from './www/scripts/utils/Init';
import { AddLighting } from './www/scripts/utils/Lighting';
import { AddStar, AnimateScene } from './www/scripts/utils/Effects';
import { AddText } from './www/scripts/utils/AddText';

// Initialize the scene
Initialize();

// Add lighting
AddLighting();

// Add text to the scene
AddText('Roan');
AddText('Brendan');
AddText('Bruh');

// Initialize effects
Array(200).fill().forEach(AddStar);
AnimateScene();

export { THREE, FontLoader, TextGeometry };
