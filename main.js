import './assets/style/style.css';
import { Initialize } from './assets/scripts/utils/Init';
import { AddLighting } from './assets/scripts/utils/Lighting';
import { AddStar, AnimateScene } from './assets/scripts/utils/Effects';


// Initialize the scene
Initialize();

// Add lighting
AddLighting();

// Initialize effects
Array(200).fill().forEach(AddStar);
AnimateScene();
