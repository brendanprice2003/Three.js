import './assets/style/style.css';
import { Initialize, camera } from './assets/scripts/utils/Init';
import { AddLighting } from './assets/scripts/utils/Lighting';
import { AddStar } from './assets/scripts/utils/Effects';
// import { userStruct } from './assets/scripts/user';

// Initialize the scene
Initialize();

// Add lighting
AddLighting();

// Initialize effects
Array(200).fill().forEach(AddStar);

// Events
// setInterval(() => {
//     userStruct.isAnimationPlaying = false;
//     document.getElementById('canvasCoverAnimation').style.display = 'block';
//     camera.position.z = 0;
//     document.getElementById('canvasCoverAnimation').style.display = 'none';
// }, 5000);