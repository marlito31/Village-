// js/TutorialScene.js
// Cena de Tutorial — exibida após clicar em "Começar" e antes da GameScene.
// Para integrar: adicione esta cena ao array de cenas em main.js e, na MainMenuScene,
// substitua `this.scene.start('GameScene')` por `this.scene.start('TutorialScene')`.

export default class TutorialScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TutorialScene' });
    }

    // ─── dados de cada slide ───────────────────────────────────────────────────
    get slides() {
        return [
            {
                title: '🏰  Bem-vindo a Village Defense!',
                body: [
                    'Hordas de monstros corrompidos estão a caminho da sua vila.',
                    'O seu objetivo é sobreviver a TODAS as ondas sem deixar',
                    'a vida da base chegar a zero.',
                ],
                icon: '🏹',
            },
            {
                title: '💰  Recursos',
                body: [
                    'Você começa com uma quantidade de ouro.',
                    'Derrotar inimigos concede mais ouro.',
                    'Gerencie bem — cada moeda conta!',
                ],
                icon: '🪙',
            },
            {
                title: '🗼  Construindo Torres',
                body: [
                    'Clique nos LOCAIS DE CONSTRUÇÃO marcados no mapa',
                    'para posicionar uma Torre de Arqueiros.',
                    'Torres disparam automaticamente nos inimigos próximos.',
                ],
                icon: '🔨',
            },
            {
                title: '⬆️  Evoluindo Torres',
                body: [
                    'Clique numa torre já construída para abrir o menu de upgrade.',
                    'Existem 7 níveis de evolução — cada nível aumenta',
                    'o dano, alcance e pode mudar o tipo de arqueiro.',
                ],
                icon: '⭐',
            },
            {
                title: '💖  Comprar Vida',
                body: [
                    'A base perde vida quando um inimigo chega ao fim do caminho.',
                    'Use ouro para recuperar a vida da base clicando',
                    'no ícone de coração na interface.',
                ],
                icon: '❤️',
            },
            {
                title: '👾  Tipos de Inimigos',
                body: [
                    '🟢 Slime Corrompido — básico, sem atributos especiais.',
                    '🟤 Goblin da Floresta — lento, mas muito resistente.',
                    '🐺 Lobo Corrompido — rápido, mas frágil.',
                    '🐝 Abelha Corrompida — AÉREA, requer torres de nível alto.',
                ],
                icon: '👾',
            },
            {
                title: '🗺️  Duas Fases',
                body: [
                    'Fase 1 — Campos Exteriores: um caminho principal.',
                    'Fase 2 — Arredores da Vila: cenário mais complexo,',
                    'múltiplos caminhos e inimigos mais fortes.',
                    'O ouro é mantido entre as fases. Boa sorte!',
                ],
                icon: '🗺️',
            },
        ];
    }

    // ─── create ───────────────────────────────────────────────────────────────
    create() {
        const W = this.scale.width;
        const H = this.scale.height;

        this.currentSlide = 0;

        // ── fundo semi-transparente ──
        this.bg = this.add.rectangle(W / 2, H / 2, W, H, 0x0d1117, 0.92).setDepth(0);

        // ── painel central ──
        const panelW = Math.min(660, W - 40);
        const panelH = Math.min(400, H - 100);
        const panelX = W / 2;
        const panelY = H / 2 - 20;

        this.panel = this.add.rectangle(panelX, panelY, panelW, panelH, 0x1a2230, 1)
            .setDepth(1)
            .setStrokeStyle(2, 0xc8a84b);

        // ── ícone grande ──
        this.iconText = this.add.text(panelX, panelY - panelH / 2 + 48, '', {
            fontSize: '52px',
        }).setOrigin(0.5).setDepth(2);

        // ── título ──
        this.titleText = this.add.text(panelX, panelY - panelH / 2 + 110, '', {
            fontSize: '22px',
            fontFamily: 'Georgia, serif',
            color: '#f0d080',
            fontStyle: 'bold',
            align: 'center',
            wordWrap: { width: panelW - 60 },
        }).setOrigin(0.5).setDepth(2);

        // ── corpo ──
        this.bodyText = this.add.text(panelX, panelY + 10, '', {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            color: '#d0e0f0',
            align: 'center',
            lineSpacing: 8,
            wordWrap: { width: panelW - 80 },
        }).setOrigin(0.5).setDepth(2);

        // ── indicadores de slide (bolinhas) ──
        this.dots = [];
        const dotSpacing = 18;
        const totalDots = this.slides.length;
        const dotsStartX = panelX - ((totalDots - 1) * dotSpacing) / 2;
        const dotsY = panelY + panelH / 2 - 24;

        for (let i = 0; i < totalDots; i++) {
            const dot = this.add.circle(dotsStartX + i * dotSpacing, dotsY, 5, 0x555577, 1).setDepth(2);
            this.dots.push(dot);
        }

        // ── botão ANTERIOR ──
        this.btnPrev = this._makeButton(panelX - panelW / 2 + 70, H / 2 + panelH / 2 + 30, '◀  Anterior', () => this._prevSlide());

        // ── botão PRÓXIMO / JOGAR ──
        this.btnNext = this._makeButton(panelX + panelW / 2 - 70, H / 2 + panelH / 2 + 30, 'Próximo  ▶', () => this._nextSlide());

        // ── botão PULAR ──
        this.btnSkip = this.add.text(panelX, H / 2 + panelH / 2 + 62, 'Pular tutorial', {
            fontSize: '13px',
            color: '#667788',
            fontFamily: 'Arial, sans-serif',
        }).setOrigin(0.5).setDepth(2).setInteractive({ useHandCursor: true });

        this.btnSkip.on('pointerover', () => this.btnSkip.setColor('#aabbcc'));
        this.btnSkip.on('pointerout', () => this.btnSkip.setColor('#667788'));
        this.btnSkip.on('pointerdown', () => this._startGame());

        // ── renderiza o primeiro slide ──
        this._renderSlide(0);
    }

    // ─── helpers ──────────────────────────────────────────────────────────────

    _makeButton(x, y, label, callback) {
        const btn = this.add.container(x, y).setDepth(2);

        const bg = this.add.rectangle(0, 0, 140, 36, 0x2a3a4e, 1).setStrokeStyle(1, 0xc8a84b);
        const txt = this.add.text(0, 0, label, {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            color: '#e8d090',
        }).setOrigin(0.5);

        btn.add([bg, txt]);
        btn.setSize(140, 36);
        btn.setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => bg.setFillStyle(0x3a5060));
        btn.on('pointerout', () => bg.setFillStyle(0x2a3a4e));
        btn.on('pointerdown', callback);

        // guardar referência ao texto para poder mudar o label depois
        btn._label = txt;
        btn._bg = bg;

        return btn;
    }

    _renderSlide(index) {
        const slide = this.slides[index];

        // ícone
        this.iconText.setText(slide.icon);

        // título
        this.titleText.setText(slide.title);

        // corpo
        this.bodyText.setText(slide.body.join('\n'));

        // bolinhas
        this.dots.forEach((dot, i) => {
            dot.setFillStyle(i === index ? 0xc8a84b : 0x444466);
        });

        // botão anterior: esconder no primeiro slide
        this.btnPrev.setVisible(index > 0);

        // botão próximo: muda para "Jogar!" no último slide
        const isLast = index === this.slides.length - 1;
        this.btnNext._label.setText(isLast ? '⚔️  Jogar!' : 'Próximo  ▶');
        this.btnNext._bg.setFillStyle(isLast ? 0x3a6e2a : 0x2a3a4e);
        this.btnNext._bg.setStrokeStyle(1, isLast ? 0x80e050 : 0xc8a84b);

        // skip: esconder no último (já existe o botão Jogar)
        this.btnSkip.setVisible(!isLast);

        // animação leve de entrada
        this.iconText.setAlpha(0);
        this.titleText.setAlpha(0);
        this.bodyText.setAlpha(0);

        this.tweens.add({
            targets: [this.iconText, this.titleText, this.bodyText],
            alpha: 1,
            duration: 250,
            ease: 'Power2',
        });
    }

    _nextSlide() {
        if (this.currentSlide < this.slides.length - 1) {
            this.currentSlide++;
            this._renderSlide(this.currentSlide);
        } else {
            this._startGame();
        }
    }

    _prevSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this._renderSlide(this.currentSlide);
        }
    }

    _startGame() {
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('GameScene');
        });
    }
}