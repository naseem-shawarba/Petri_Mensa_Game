export class ScoreScene extends Phaser.Scene {

    private title: Phaser.GameObjects.Text;
    private retryLevel;
    private nextLevel;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private screenCenterX: number;
    private screenCenterY: number;
    private score: number;
    private currentLevel: number;

    constructor() {
        super({
            key: "ScoreScene"
        });
    }
    init(params): void {
        this.score = params.score;
        this.scene.get("SettingsScene").scene.stop(); 
        this.scene.get(params.level).scene.stop(); 
        this.currentLevel = parseInt(params.level[5] + params.level[6]);
    }

    create(): void {
        this.screenCenterX = (this.cameras.main.width / 2 ) ;
        this.screenCenterY = (this.cameras.main.height / 2 );
        const image = this.add.image(this.screenCenterX, this.screenCenterY, 'scoreBackground')
        image.setScale(0.5).setScrollFactor(0)

        this.title = this.add.text(this.screenCenterX -60, this.screenCenterY-40, ''+this.score, { font: '100px Arial Bold' , color:'gold'});
        this.retryLevel = this.add.image(this.screenCenterX-30, this.screenCenterY+115, 'restartIcon').setScale(0.16);
        this.retryLevel.setInteractive();  
        this.retryLevel.on('pointerup', function () {
            this.scene.get("SettingsScene").scene.restart();
            this.scene.get("SettingsScene").mainScene.scene.restart(); 
            this.scene.stop() // new
        }, this);
        
        if (this.score <= 0) return;    //next level can't be selected if game was lost
        this.nextLevel = this.add.image(this.screenCenterX +40, this.screenCenterY+115, 'resumeIcon').setScale(0.10);
        this.nextLevel.setInteractive();
        this.nextLevel.on('pointerup', function () {
            let nextLevel;
            if(this.currentLevel === 8){
                this.scene.start("WelcomeScene");
            }
            if(this.currentLevel + 1 < 10){
                nextLevel ='Level0' + (this.currentLevel + 1);
            }else{
                nextLevel ='Level' + (this.currentLevel + 1);
            }
            this.scene.start(nextLevel);
            this.scene.get("SettingsScene").scene.restart();
        }, this);
    }
}

