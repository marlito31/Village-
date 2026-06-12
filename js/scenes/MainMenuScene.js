export class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        this.load.setPath('assets/');
        this.load.image('background', 'fase1.jpeg');
    }

    create() {
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        const title = this.add.text(this.cameras.main.width / 2, 200, 'VILLAGE DEFENSE', {
            fontSize: '80px', fontFamily: 'Arial', color: '#ffdd00', stroke: '#000000', strokeThickness: 8
        }).setOrigin(0.5);

        const startButton = this.add.text(this.cameras.main.width / 2, 450, 'Iniciar Jogo', {
            fontSize: '48px', fontFamily: 'Arial', backgroundColor: '#007bff', color: '#ffffff', padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        const rankingButton = this.add.text(this.cameras.main.width / 2, 550, 'Ranking', {
            fontSize: '48px', fontFamily: 'Arial', backgroundColor: '#6c757d', color: '#ffffff', padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        startButton.on('pointerdown', () => {
            this.scene.start('TutorialScene');
    
        });

        rankingButton.on('pointerdown', () => {
            startButton.setVisible(false);
            rankingButton.setVisible(false);
            title.setVisible(false);
            this.showRanking();
        });
    }

    showRanking() {
        const rankingContainer = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2);

        const bg = this.add.graphics({ fillStyle: { color: 0x000000, alpha: 0.8 } });
        bg.fillRect(-400, -300, 800, 600);
        rankingContainer.add(bg);

        const rankingTitle = this.add.text(0, -250, 'Ranking - Top 10', { fontSize: '48px', fontFamily: 'Arial', color: '#ffdd00' }).setOrigin(0.5);
        rankingContainer.add(rankingTitle);

        const backButton = this.add.text(0, 250, 'Voltar', { fontSize: '32px', backgroundColor: '#dc3545', padding: 10 }).setOrigin(0.5).setInteractive();
        rankingContainer.add(backButton);

        backButton.on('pointerdown', () => {
            rankingContainer.destroy();
            this.children.list.forEach(child => {
                if (child.type === 'Text') {
                    child.setVisible(true);
                }
            });
        });

        const loadingText = this.add.text(0, 0, 'A carregar...', { fontSize: '32px', fontFamily: 'Arial' }).setOrigin(0.5);
        rankingContainer.add(loadingText);

        fetch('http://localhost:3000/ranking')
            .then(response => response.json())
            .then(data => {
                loadingText.destroy();

                if (data.length === 0) {
                    const noScoresText = this.add.text(0, 0, 'Nenhuma pontuacao registada.', { fontSize: '28px', fontFamily: 'Arial' }).setOrigin(0.5);
                    rankingContainer.add(noScoresText);
                    return;
                }

                let yPos = -180;
                data.forEach((score, index) => {
                    const rankText = `${index + 1}. ${score.playerName}`;
                    const scoreText = `${score.score} pontos`;

                    const rankLabel = this.add.text(-250, yPos, rankText, { fontSize: '28px', fontFamily: 'Arial' }).setOrigin(0, 0.5);
                    const scoreLabel = this.add.text(250, yPos, scoreText, { fontSize: '28px', fontFamily: 'Arial' }).setOrigin(1, 0.5);
                    
                    rankingContainer.add([rankLabel, scoreLabel]);
                    yPos += 40;
                });
            })
            .catch(error => {
                console.error('Erro ao buscar ranking:', error);
                loadingText.setText('Erro ao carregar o ranking.');
            });
    }
}
