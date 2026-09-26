import './style.css';
import { AppBootstrap } from './app/bootstrap';

const appDiv = document.querySelector<HTMLDivElement>('#app')!;
appDiv.innerHTML = `
  <canvas id="gameCanvas"></canvas>
  <div id="ui-layer" style="position: absolute; top: 0; left: 0; pointer-events: none; padding: 10px; color: white;">
    <h1>Orbit Market</h1>
    <p>Loading...</p>
  </div>
`;

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;

// Initialize app
const app = new AppBootstrap(canvas);
app.run();

// Basic UI update loop
const uiLayer = document.getElementById('ui-layer')!;
setInterval(() => {
  uiLayer.innerHTML = `
    <h1>Orbit Market</h1>
    <p>Money: ${app.engine.state.money}</p>
    <p>Inventory: ${Array.from(app.engine.state.inventory.entries()).map(([k, v]) => `${k}: ${v}`).join(', ')}</p>
  `;
}, 500);

// For testing purposes, we give the player some starting materials
app.engine.state.addToInventory('raw_material', 10);
