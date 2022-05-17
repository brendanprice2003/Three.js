import './assets/style/style.css';
import { Initialize, camera } from './assets/scripts/utils/Init.js';
import { AddLighting } from './assets/scripts/utils/Lighting.js';
import { AddStar } from './assets/scripts/utils/Effects.js';

// Initialize the scene
Initialize();

// Add lighting
AddLighting();

// Initialize effects
Array(200).fill().forEach(AddStar);