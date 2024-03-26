import "phaser";
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import {WelcomeScene} from "./scenes/welcomeScene";
import {MainScene} from "./scenes/MainScene";
import {ScoreScene} from "./scenes/scoreScene";
import {SettingsScene} from "./scenes/settingsScene";
import { AudioScene } from "./scenes/AudioScene";
import {Level01} from "./scenes/Level01";
import {Level02} from "./scenes/Level02";
import {Level03} from "./scenes/Level03";
import {Level04} from "./scenes/Level04";
import {Level05} from "./scenes/Level05";
import {Level06} from "./scenes/Level06";
import {Level07} from "./scenes/Level07";
import {Level08} from "./scenes/Level08";

const config: Phaser.Types.Core.GameConfig = {
    width: 800,
    height: 576,
    pixelArt: false,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [WelcomeScene, Level01, Level02, Level03, Level04, Level05, Level06, Level07, Level08, MainScene, ScoreScene, SettingsScene, AudioScene],
    physics: {
        default: 'arcade',
        arcade: {
            // set to true to display object collision bounding boxes
            debug: false
        }
    },
    plugins: {
        scene: [{
            key: 'rexUI',
            plugin: RexUIPlugin,
            mapping: 'rexUI'
        }]
    }

};

export class Game extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

window.addEventListener("load", () => {
    new Game(config);
});