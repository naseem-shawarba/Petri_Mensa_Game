export class WelcomeScene extends Phaser.Scene {
    private title: Phaser.GameObjects.Text;
    private hint: Phaser.GameObjects.Text;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private levels;
    private screenCenterX: number;
    private screenCenterY: number;

    constructor() {
        super({
            key: "WelcomeScene"
        });
    }
    preload():void
    {
        this.load.image('background', 'assets/sceneBackgrounds/WelcomeSceneBackground.png');
    }
    create(): void {
        this.screenCenterX = (this.cameras.main.width / 2 ) ;
        this.screenCenterY = (this.cameras.main.height / 2 );

        const image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background')
        const scaleX = this.cameras.main.width / image.width
        const scaleY = this.cameras.main.height / image.height
        const scale = Math.max(scaleX, scaleY)
        image.setScale(scale).setScrollFactor(0)


        this.levels= new Object();

        //this.hint = this.add.text(this.screenCenterX -220, this.screenCenterY+105, 'choose level: ', { font: '35px Arial Bold', color:'black' });
        const originalStyle = { font: '45px Century',color:'rgba(0,74,127,1)'};
        const originalStyleGrey = { font: '45px Century',color:'rgba(45,45,45,1)'};
        this.add.text(this.screenCenterX-110, this.cameras.main.height * 0.75 - 50, '_________', originalStyleGrey);
        this.levels.lvl1 = this.add.text(this.screenCenterX-95, this.cameras.main.height * 0.75 + 10, ' START ', originalStyle);
        this.levels.lvl1.setInteractive();
        this.levels.lvl1.on('pointerover', function () {
            this.setText('[START]');
            this.setColor('rgba(0,148,255,.45)');
        })
        this.levels.lvl1.on('pointerout', function () {
            this.setText(' START ');
            this.setStyle(originalStyle);
        })
        this.levels.lvl1.on('pointerdown', function () {
            this.scene.stop("WelcomeScene")
            this.scene.start("Level01"); 
        }, this);
    }
}

