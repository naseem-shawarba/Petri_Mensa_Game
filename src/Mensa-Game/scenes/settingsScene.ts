import Buttons from "phaser3-rex-plugins/templates/ui/buttons/Buttons";
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";
import { MainScene } from "./MainScene";
const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_HIGHLIGHT = 0xad109b;


export class SettingsScene extends Phaser.Scene {
    private startButton;
    private pauseButton;
    private restartButton;
    private iconSize = 40;
    public tileSelector: Phaser.GameObjects.Sprite[] = [];
    private startingX = 100;
    private startingY = 100;
    private tileIndex = 0;
    public tickVisual: Phaser.GameObjects.Text;
    public levelName: Phaser.GameObjects.Text;
    public mainScene;
    public gameStarted = false;
    rexUI: UIPlugins;

    constructor() {
        super({
            key: "SettingsScene",
            active: true
        });
    }

    public setupSceneTimer(): void {
        this.add.image(window.innerWidth / 2 + 3, 34, 'timerBackground').setScale(.23);

        const startingTime = (this.mainScene as MainScene).maxLevelCompletionTime.toString();
        this.tickVisual = this.add.text(window.innerWidth / 2, 17, startingTime, { color: 'black', font: '33px Century Bold' });
        this.tickVisual.setScrollFactor(0)
    }

    public setupLevelName(): void {
        this.add.image(window.innerWidth / 2 + 3, 34, 'timerBackground').setScale(.23);

        const levelName = (this.mainScene as MainScene).levelName;
        this.levelName = this.add.text(window.innerWidth / 2 - levelName.length*8, 62, levelName, { color: 'black', font: '33px Century Bold' });
        this.levelName.setScrollFactor(0)
    }

    public setupTileSelector(list: Array<{ img: string, tile: Phaser.Tilemaps.Tile }>) {
        this.tileIndex = 0;
        this.tileSelector = [];
        for (let i = 0; i < list.length; i++) {
            this.createTileSelector(list[i].img, list[i].tile);
        }
    }

    public setupButtons(): void {

        this.restartButton = this.add.image(window.innerWidth / 2 + 100, 35, 'restartIcon').setScale(0.16);
        this.restartButton.on('pointerdown', this.restartGame, this);
        this.restartButton.visible = false;

        this.pauseButton = this.add.image(window.innerWidth / 2 - 100, 35, 'resumeIcon').setScale(0.10);
        this.pauseButton.on('pointerdown', this.pauseGame, this);
        this.pauseButton.visible = true;
        this.pauseButton.setInteractive();
    }
    private startGame(): void {
        if(!this.gameStarted){
            this.restartButton.setVisible(true);
            this.restartButton.setInteractive();
            this.gameStarted = true;
        }
        this.mainScene.data.set('isTimerRunning', true);
        this.pauseButton.setTexture('pauseIcon');
    }

    private pauseGame(): void {
        const isMainTimerRunning = this.mainScene.data.get('isTimerRunning')
        if (isMainTimerRunning) {
            this.mainScene.data.set('isTimerRunning', false);
            this.pauseButton.setTexture('resumeIcon');
        } else this.startGame();
    }
    private restartGame(): void {
        this.scene.restart();
        this.mainScene.scene.restart();
    }

    private createTileSelector(img: string, tile: Phaser.Tilemaps.Tile, x: number = this.startingX + this.tileIndex * this.iconSize, y: number = this.startingY) {
        const temp = this.add.sprite(x, y, img);
        temp.displayWidth = this.iconSize;
        temp.displayHeight = this.iconSize;
        temp.setInteractive();
        temp.setScrollFactor(0);
        temp.setData('tile', tile);

        temp.on('pointerdown', function () {
            this.scene.mainScene.selectedTile = this.getData('tile');
        })

        temp.on('pointerover', function () {
            this.scene.mainScene.UIhover = true;
        })

        temp.on('pointerout', function () {
            this.scene.mainScene.UIhover = false;
        })

        this.tileSelector.push(temp);

        this.tileIndex++;
    }

    createFilterUI(tile: Phaser.Tilemaps.Tile) {
        const background = this.rexUI.add.roundRectangle(0, 0, 0, 0, 20, COLOR_PRIMARY);

        const btns = {};
        const keys = this.mainScene.allIngerients;
        let key;
        let columns = 3;
        if(keys.length > 10){
            columns = 4;
        }

        let row = [];
        const btnsArr = [];
        for (let i = 0, cnt = keys.length; i < cnt; i++) {
            key = keys[i];
            btns[key] = createButton(this, key, tile);
            row.push(btns[key]);
            if (row.length % columns === 0) {
                btnsArr.push(row);
                row = [];
            }
        }
        if (row.length > 0) {
            btnsArr.push(row);
        }
        const rows = btnsArr.length;





        const buttons = this.rexUI.add.gridButtons({
            x: window.innerWidth - 150, y: 300,
            width: 300, height: 150 * rows,

            background: background,

            buttons: btnsArr,
            space: {
                left: 10, right: 10, top: 20, bottom: 20,
                row: 20, column: 10
            },

            type: 'radio',
            setValueCallback: function (button: any, value) {
                (button.getElement('background') as any)
                    .setStrokeStyle(7, (value) ? COLOR_HIGHLIGHT : COLOR_LIGHT);
            }
        })
            .layout()

        // Dump states

        const dumpButtonStates = function () {
            tile.properties.filter?.setTexture((buttons as any).value);
        }


        buttons.emitButtonClick(keys.indexOf(tile.properties.filter.texture.key));
        // buttons.setInteractive();
        buttons.on('button.click', dumpButtonStates);
        background.setInteractive();
        background.on('pointerover', function () {
            this.scene.mainScene.UIhover = true;
        })
            .on('pointerout', function () {
                this.scene.mainScene.UIhover = false;
            });

        buttons.on('button.over', function () {
            this.scene.mainScene.UIhover = true;
        })
            .on('button.out', function () {
                this.scene.mainScene.UIhover = false;
            });
        return buttons;
    }


}

const createButton = function (scene, text, tile: Phaser.Tilemaps.Tile) {
    const l = scene.rexUI.add.label({
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10).setStrokeStyle(7, COLOR_LIGHT),
        icon: scene.add.image(0, 0, text).setDisplaySize(tile.baseWidth, tile.baseHeight),
        space: {
            icon: 10
        },
        align: 'center',
        name: text
    });
    return l;

}





