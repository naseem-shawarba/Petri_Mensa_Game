export class AudioScene extends Phaser.Scene {
    public defaultMusic;
    public sounds: [];
    public muteButton;
    public isMuted: boolean;
    public keys;
    public keyC;
    public keyO;
    public keyL;
    public keyA;
    public isColaEasterEggOff: boolean;
    public colaPicture;
    public mainScene;
    constructor() {
        super({
            key: "AudioScene",
            active: true
        });
    }

    preload(): void {
        this.load.audio('defaultMusic', 'assets/audio/Pixelland.mp3')
        this.load.image('muteIcon', 'assets/sceneBackgrounds/mute.png');
        this.load.image('unmuteIcon', 'assets/sceneBackgrounds/unMute.png');
    }

    create(): void {
        this.muteButton = this.add.image(window.innerWidth - 50, 35, 'unmuteIcon').setScale(0.13);
        this.muteButton.setInteractive();
        this.muteButton.on('pointerdown', this.volumeController, this);

        this.isColaEasterEggOff == true;
        this.defaultMusic = this.sound.add('defaultMusic')
        this.defaultMusic.play({
            loop: true,
            volume: 0.1
        });
        this.muteButton.on('pointerover', function () {
            if (!this.scene.mainScene) return;
            this.scene.mainScene.UIhover = true;
        })

        this.muteButton.on('pointerout', function () {
            if (!this.scene.mainScene) return;
            this.scene.mainScene.UIhover = false;
        })

        this.setupColaEasterEggKeybindings()
    }

    update(): void {

        this.colaMeansLife();
    }

    private volumeController(): void {
        if (this.defaultMusic.mute == false) {
            this.muteButton.setTexture('muteIcon');
            this.defaultMusic.mute = true;
        } else {
            this.muteButton.setTexture('unmuteIcon');
            this.defaultMusic.mute = false;
        }
    }

    private colaMeansLife(): void {
        if (this.keyC.isDown && this.keyO.isDown && this.keyL.isDown && this.keyA.isDown && this.isColaEasterEggOff) {
            console.log('Cola Means Life!!!!')
            this.colaPicture = this.add.sprite(-100, 600, 'Cola').setScale(0.25);
            this.isColaEasterEggOff = false;
            setTimeout(() => {
                this.colaPicture.destroy();
                this.isColaEasterEggOff = true;
            }, 8000);

        }
        if (this.isColaEasterEggOff == false) {
            this.colaPicture.x += 7;
        }
    }
    private setupColaEasterEggKeybindings(): void {
        this.keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.keyO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
        this.keyL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    }

}
