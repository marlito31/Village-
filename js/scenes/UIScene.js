export class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
        this.gameScene = null;
    }

    init(data) {
        this.currentSceneKey = data.currentScene;
    }
    
    create() {
        this.gameScene = this.scene.get(this.currentSceneKey);

        const pauseButton = this.add.text(this.cameras.main.width - 40, 40, 'II', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive();

        pauseButton.on('pointerdown', () => {
            if (this.gameScene.scene.isPaused()) {
                this.gameScene.scene.resume();
                pauseButton.setText('II');
            } else {
                this.gameScene.scene.pause();
                pauseButton.setText('▶');
            }
        });

        this.gameScene.events.on('gameOver', () => {
            this.showEndGameMenu('GAME OVER', 0xff0000);
        });

        this.gameScene.events.on('gameWin', (nextScene) => {
            if (nextScene) {
                const gameScene = this.scene.get(this.currentSceneKey);

                this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Fase Concluida!', {
                    fontSize: '80px', fontFamily: 'Arial', color: '#00ff00', stroke: '#000000', strokeThickness: 8
                }).setOrigin(0.5);

                this.time.delayedCall(2000, () => {
                    gameScene.cameras.main.fadeOut(1500, 0, 0, 0);
                });

                gameScene.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.stop(this.currentSceneKey);
                    this.scene.stop('UIScene');
                    this.scene.start(nextScene);
                    this.scene.launch('UIScene', { currentScene: nextScene });
                });

            } else {
                this.showEndGameMenu('VOCE VENCEU!', 0x00ff00);
            }
        });
    }

    showEndGameMenu(message, color) {
        this.gameScene.scene.pause();
        const bg = this.add.graphics({ fillStyle: { color: 0x000000, alpha: 0.7 } });
        bg.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

        this.add.text(this.cameras.main.width / 2, 300, message, {
            fontSize: '96px', fontFamily: 'Arial', color: Phaser.Display.Color.ValueToColor(color).rgba, stroke: '#000000', strokeThickness: 8
        }).setOrigin(0.5);

        const finalScore = this.gameScene.dinheiro + (this.gameScene.vidaBase * 10);
        this.add.text(this.cameras.main.width / 2, 350, `Pontuacao: ${finalScore}`, { fontSize: '40px', fontFamily: 'Arial' }).setOrigin(0.5);

        const playerName = prompt("Fim de jogo! Digite seu nome para salvar no ranking:", "JOGADOR");

    if (playerName) {
        fetch('https://n8n.incluc0de.com.br/webhook/salvar-pontuacao', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            playerName: playerName,
            score: finalScore
        })
    })
    .then(response => response.json())
    .then(data => console.log('Pontuação salva:', data))
    .catch(error => console.error('Erro ao salvar pontuação:', error));
}
    
        const restartButton = this.add.text(this.cameras.main.width / 2, 500, 'Jogar Novamente', {
            fontSize: '40px', backgroundColor: '#28a745', padding: 10
        }).setOrigin(0.5).setInteractive();

        restartButton.on('pointerdown', () => {
            this.gameScene.scene.restart();
            this.scene.restart({ currentScene: this.currentSceneKey });
        });

        const menuButton = this.add.text(this.cameras.main.width / 2, 600, 'Menu Principal', {
            fontSize: '40px', backgroundColor: '#6c757d', padding: 10
        }).setOrigin(0.5).setInteractive();

        menuButton.on('pointerdown', () => {
            this.gameScene.scene.stop();
            this.scene.stop();
            this.scene.start('MainMenuScene');
        });
    }
}
