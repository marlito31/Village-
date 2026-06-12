import { GameScene } from './scenes/GameScene.js';
import { GameScene2 } from './scenes/GameScene2.js';
import { MainMenuScene } from './scenes/MainMenuScene.js';
import { UIScene } from './scenes/UIScene.js';
import  TutorialScene  from './scenes/TutorialScene.js';

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 960,
        height: 960
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [MainMenuScene,TutorialScene, GameScene, GameScene2, UIScene]
};

const game = new Phaser.Game(config);
