import { newArrowTile, copyArrowTile } from "../gameObjects/ArrowTiles";
import { newCookingStation } from "../gameObjects/CookingStation";
import { newDispensorTile } from "../gameObjects/DispensorTile";
import { newTargetTile } from "../gameObjects/TargetTile";
import { Zutat } from "../gameObjects/Zutat";
import { SettingsScene } from "./settingsScene";

import { newTrashTile } from "../gameObjects/TrashTile";
import { newInputTile } from "../gameObjects/InputTile";
import { newOutputTile } from "../gameObjects/OutputTile";
import Vector2 = Phaser.Math.Vector2;

export class MainScene extends Phaser.Scene {
    public map: Phaser.Tilemaps.Tilemap;
    protected layer: Phaser.Tilemaps.TilemapLayer
    public maxLevelCompletionTime = 400;
    private currentStep;
    private lastStepTime: number; //The time when the current step was last updated
    private lastTickTime: number; //the last time the update function was called
    private stepLength = 1000; //ms
    private cursors;
    private controls;
    private cameraCenter = null;

    protected textureSize: number; //can be easily changed, depending on actual picture size (not game)

    private generalMarker: Phaser.GameObjects.Graphics;
    private markedTile: Phaser.GameObjects.Graphics;
    private selectedTile: Phaser.Tilemaps.Tile = undefined;
    private currentTile: Phaser.Tilemaps.Tile = undefined;
    private lastPlaced: Phaser.Tilemaps.Tile = undefined;
    private tileSelector = [];
    public UIhover = false;
    public openedElement;

    public allFood: Zutat[];
    public allIngerients: string[] = [];
    protected allCookingStation: Phaser.Tilemaps.Tile[];
    protected targetTile: Phaser.Tilemaps.Tile;
    public isTimerRunning = false;

    private dragOrigin = new Vector2(0, 0);
    private rightClickDownPos = new Vector2();

    public levelName = "default Level";
    
    public settingScene;

    constructor(levelName = 'MainScene') {
        super({
            key: levelName
        });
    }

    preload(): void {
        this.load.tilemapCSV('map', 'assets/tilemaps/csv/lvl1.csv');
        this.load.pack("preload", "assets/pack.json", "preload");
    }

    init(): void {
        this.data.set('currentStep', 0);
        this.data.set('isTimerRunning', false);
        this.data.events.on('changedata-isTimerRunning', () => {
            this.isTimerRunning = this.data.get('isTimerRunning');
            this.lastStepTime = this.time.now
        });
        this.allFood = [];
        this.allCookingStation = [];
        this.targetTile = null;
        this.stepLength = 1000;
        this.textureSize = 512;
        
    }

    create(): void {
        this.settingScene = (this.scene.get("SettingsScene") as SettingsScene);
        this.settingScene.gameStarted = false;
        this.settingScene.mainScene = this;
        (this.scene.get("AudioScene") as any).mainScene = this;
        this.setupGrid();
        this.setupCamera();
        this.setupGeneralMarker();
        this.setupTileMarker();
        this.setupUI();
        this.testSetup();
        this.setupSceneTimer();
        this.settingScene.setupLevelName();
        this.settingScene.setupButtons();
    }

    markTile():void{
        const worldPoint: Phaser.Math.Vector2 = this.input.activePointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
        const pointerTileX = this.map.worldToTileX(worldPoint.x);
        const pointerTileY = this.map.worldToTileY(worldPoint.y);
        this.markedTile.x = this.map.tileToWorldX(pointerTileX);
        this.markedTile.y = this.map.tileToWorldY(pointerTileY);
        this.markedTile.setVisible(true)
    }

    public setupUI(): void { //do not change the index, if you really have to: fix omniDirectionalReplace

        const allButtons: Array<{ tile: Phaser.Tilemaps.Tile, img: string }> = [];

        const def: Phaser.Tilemaps.Tile = newArrowTile(this.map.layer, 0, 0, 0, null) as Phaser.Tilemaps.Tile;
        def.properties.capacity = 0;
        allButtons.push({ tile: def, img: 'defaultTile' });

        const arrowRight: Phaser.Tilemaps.Tile = newArrowTile(this.map.layer, 1, 0, 0, "right") as Phaser.Tilemaps.Tile;
        allButtons.push({ tile: arrowRight, img: 'arrowRight' });

        const arrowLeft: Phaser.Tilemaps.Tile = newArrowTile(this.map.layer, 2, 0, 0, "left") as Phaser.Tilemaps.Tile;
        allButtons.push({ tile: arrowLeft, img: 'arrowLeft' });

        const arrowUp: Phaser.Tilemaps.Tile = newArrowTile(this.map.layer, 3, 0, 0, "up") as Phaser.Tilemaps.Tile;
        allButtons.push({ tile: arrowUp, img: 'arrowUp' });

        const arrowDown: Phaser.Tilemaps.Tile = newArrowTile(this.map.layer, 4, 0, 0, "down") as Phaser.Tilemaps.Tile;
        allButtons.push({ tile: arrowDown, img: 'arrowDown' });

        this.settingScene.setupTileSelector(allButtons);
        this.tileSelector = this.settingScene.tileSelector;

        //init selectedTile with right-arrow for click-reducing
        this.selectedTile = arrowRight;

    }



    private setupSceneTimer(): void {
        this.currentStep = 0;
        this.lastStepTime = this.time.now;
        this.lastTickTime = this.time.now;
        this.settingScene.setupSceneTimer();
    }

    // creates a centered grid with the blueprint from the preloaded tilemapCSV
    protected setupGrid(): void {
        this.map = this.make.tilemap({ key: 'map', tileWidth: 64, tileHeight: 64 });

        this.map.addTilesetImage('defaultTile', 'defaultTile', this.textureSize, this.textureSize, undefined, undefined, 0);
        this.map.addTilesetImage('arrowRight', 'arrowRight', this.textureSize, this.textureSize, undefined, undefined, 1);
        this.map.addTilesetImage('arrowLeft', 'arrowLeft', this.textureSize, this.textureSize, undefined, undefined, 2);
        this.map.addTilesetImage('arrowUp', 'arrowUp', this.textureSize, this.textureSize, undefined, undefined, 3);
        this.map.addTilesetImage('arrowDown', 'arrowDown', this.textureSize, this.textureSize, undefined, undefined, 4);
        this.map.addTilesetImage('crateOnions', 'crateOnions', this.textureSize, this.textureSize, undefined, undefined, 5);
        this.map.addTilesetImage('finish', 'finish', this.textureSize, this.textureSize, undefined, undefined, 6);

        this.layer = this.map.createLayer(0, ['defaultTile', 'arrowRight', 'arrowLeft', 'arrowUp', 'arrowDown', 'finish', 'crateOnions']);
        this.layer.x = 0//(this.cameras.main.width / 2) - this.layer.width / 2; //center on x
        this.layer.y = 0//(this.cameras.main.height / 2) - this.layer.height / 2; //center on y

    }

    /**
     * updates camera-center once after scrolling
     */
    private updateCameraCenterOnce():void{
        if(this.cameraCenter != null){
            this.cameras.main.centerOn(this.cameraCenter.x,this.cameraCenter.y);
            this.cameraCenter = null;
        }
    }

    private setupCamera() {

        //default context menu of the browser would open every time the camera is being moved
        this.input.mouse.disableContextMenu();
        const mapWidth = this.map.width*this.map.tileWidth;
        const mapHeight = this.map.height*this.map.tileHeight;

        const screenWidth = Math.max(mapWidth,(window.innerWidth/window.innerHeight)*mapHeight)*1.5;
        const screenHeight = Math.max(mapHeight,(window.innerHeight/window.innerWidth)*mapWidth)*1.5;
        const minZoom = Math.max(this.cameras.main.width,this.cameras.main.height)/Math.max(screenWidth,screenHeight);
        const maxZoom = Math.min(this.cameras.main.width,this.cameras.main.height)/Math.max(this.map.tileWidth,this.map.tileHeight);
        const camera = this.cameras.main;   //stored for quicker access

        camera.setBounds((mapWidth-screenWidth)/2, (mapHeight-screenHeight)/2, screenWidth, screenHeight, true);
        camera.zoomTo(minZoom,0);
        camera.setBackgroundColor('rgba(235,235,235,1)');

        this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY) =>{

            const camOriginX = camera.worldView.centerX;
            const camOriginY = camera.worldView.centerY;
            const mousePosWorld = camera.getWorldPoint(this.input.x,this.input.y);

            //increase zoom step in quadratic way, so zooming in seems linear
            const newZoom = Math.max(Math.min(Math.pow(Math.sqrt(camera.zoom)-deltaY/1000, 2),maxZoom),minZoom);
            
            //calculate new center
            const zoomFactor = camera.zoom/newZoom;
            const newCenter = {x: mousePosWorld.x + (camOriginX-mousePosWorld.x)*(zoomFactor),y:mousePosWorld.y + (camOriginY-mousePosWorld.y)*(zoomFactor)};

            //sets new Center only if new center is on our map
            if(this.map.getTileAtWorldXY(newCenter.x,newCenter.y)!=null)this.cameraCenter=newCenter;

            camera.zoomTo(newZoom, 0);
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        const controlConfig = {
            camera: this.cameras.main,
            left: this.cursors.left,
            right: this.cursors.right,
            up: this.cursors.up,
            down: this.cursors.down,
            speed: .7
        };
        this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
    }

    /**
     * camera position can be dragged via right mouse button drag
     */
    private moveCameraOnDrag() {
        const pointer = this.input.activePointer;
        if(!pointer.rightButtonDown()) {
            this.dragOrigin.set(0,0);   //reset mouse position
            return;
        }

        const mousePosition = pointer.position;

        //get the first mouse position since the button was pressed
        if(this.dragOrigin.x == 0 && this.dragOrigin.y == 0) {
            this.dragOrigin.set(mousePosition.x, mousePosition.y);
        }

        const camera = this.cameras.main;   // saved for quicker access
        const dragOriginWorldPoint = camera.getWorldPoint(this.dragOrigin.x, this.dragOrigin.y);
        const mousePosWorldPoint = camera.getWorldPoint(mousePosition.x, mousePosition.y);
        const delta = new Vector2(dragOriginWorldPoint.x - mousePosWorldPoint.x, dragOriginWorldPoint.y - mousePosWorldPoint.y);
        const [topFrameReached, botFrameReached, leftFrameReached, rightFrameReached] = this.getMapReachingFrame();

        if((topFrameReached && delta.y < 0) || (botFrameReached && delta.y > 0)) {    //top or bottom frame reached
            // allow to scroll in x direction but not in y direction if moving the map more out of sight
            delta.set(delta.x, 0);
        }
        if((leftFrameReached && delta.x < 0) || (rightFrameReached && delta.x > 0)) {    //left or right frame reached
            // allow to scroll in y direction but not in x direction if moving the map more out of sight
            delta.set(0, delta.y);
        }

        const cameraWorldPos = camera.getWorldPoint(camera.centerX, camera.centerY);
        //this.cameraCenter={x: cameraWorldPos.x + delta.x,y:cameraWorldPos.y + delta.y};
        camera.centerOn(cameraWorldPos.x + delta.x, cameraWorldPos.y + delta.y);  //centerOn(cameraWorldPos) does nothing
        this.dragOrigin.set(mousePosition.x, mousePosition.y);
    }

    /**
     * returns at which side of the frame of the map is visible
     * order: [top, bottom, left, right]
     */
    private getMapReachingFrame(): [boolean, boolean, boolean, boolean]{
        const camera = this.cameras.main;

        //tiles needed to center the map
        const topLeftTile = this.map.getTileAt(0,0);
        const topLeftTileWorldPos = new Vector2(topLeftTile.getLeft(camera), topLeftTile.getTop(camera));
        const topLeftTileScreenPos = camera.getWorldPoint(topLeftTileWorldPos.x, topLeftTileWorldPos.y);

        const botRightTile = this.map.getTileAt(this.map.width-1, this.map.height-1);
        const botRightTileWorldPos = new Vector2(botRightTile.getRight(camera), botRightTile.getBottom(camera));

        const windowBotRightPos = camera.getWorldPoint(window.innerWidth, window.innerHeight);

        const topFrameReached = topLeftTileScreenPos.y < 0;
        const botFrameReached = windowBotRightPos.y > botRightTileWorldPos.y;
        const leftFrameReached = topLeftTileScreenPos.x < 0;
        const rightFrameReached = windowBotRightPos.x > botRightTileWorldPos.x;

        return [topFrameReached, botFrameReached, leftFrameReached, rightFrameReached];
    }

    private setupGeneralMarker(): void {
        this.generalMarker = this.add.graphics();
        this.generalMarker.lineStyle(1.5, 0xFF0000, 1);
        this.generalMarker.strokeRect(0, 0, this.map.tileWidth * this.layer.scaleX, this.map.tileHeight * this.layer.scaleY);

        this.input.on('pointerup', function () {
            this.scene.lastPlaced = undefined;
        })
    }
    private setupTileMarker():void{
        this.markedTile = this.add.graphics();
        this.markedTile.lineStyle(1.5, 0x0000FF, 1);
        this.markedTile.strokeRect(0, 0, this.map.tileWidth * this.layer.scaleX, this.map.tileHeight * this.layer.scaleY);
        this.markedTile.setVisible(false)
    }

    //updates the marker and handles map pointer interactions
    private updateGeneralMarker() {
        const worldPoint: Phaser.Math.Vector2 = this.input.activePointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
        const pointerTileX = this.map.worldToTileX(worldPoint.x);
        const pointerTileY = this.map.worldToTileY(worldPoint.y);
        this.currentTile = this.map.getTileAtWorldXY(worldPoint.x, worldPoint.y);


        // snap to tile
        this.generalMarker.x = this.map.tileToWorldX(pointerTileX);
        this.generalMarker.y = this.map.tileToWorldY(pointerTileY);

        //if outside of the map the marker graphic is disabled but not the logic.
        (this.currentTile) ? this.generalMarker.visible = true : this.generalMarker.visible = false;
        const pointer = this.input.activePointer;

        //if clicked on something other than UI 
        if (this.input.activePointer.isDown && !this.UIhover) {
            (this.openedElement?.zoom) ?  this.cameras.remove(this.openedElement): this.openedElement?.destroy?.();
            
            this.markedTile.setVisible(false);

            //Open FilterUI on right click
            if(pointer.rightButtonDown()) {
                if(this.currentTile && !this.UIhover){
                    this.currentTile.properties.interact?.();
                    this.markTile();
                }
            }else if (!this.currentTile) { //other than map -> set to interactive
                return;
            }else if (this.selectedTile) { //not interactive -> replace
                if (this.currentTile.properties.lock) { //interacting with non-replaceable tile (like cooking station)
                    //player should interact with tile, when not dragging the mouse (that's the case when lastPlaced is null)
                    if(!this.lastPlaced) this.currentTile.properties.interact?.();
                    else {
                        const newTile = copyArrowTile(this.selectedTile);
                        this.omniDirectionalReplace(this.currentTile, newTile);
                    }
                    return;
                }
                const newTile = copyArrowTile(this.selectedTile);
                this.omniDirectionalReplace(this.currentTile, newTile);

            }else{
                if(this.currentTile.properties.lock){
                    this.currentTile.properties.interact?.();
                    this.markTile();
                }
            }
        }
    }

    //recalculates current tile if drawing arrowTiles
    private omniDirectionalReplace(oldTile: Phaser.Tilemaps.Tile, newTile: Phaser.Tilemaps.Tile): void {
        if (this.lastPlaced === oldTile) {newTile.properties.filter.destroy(); newTile.destroy(); return; } //dont replace every tick if unnecessary

        //just replace if : default or first placed
        if (newTile.tileset.name == 'defaultTile' || !this.lastPlaced) {
            this.replaceTile(oldTile, newTile);
            return;
        }


        //check if adjacent
        const xDiff = Math.abs(this.lastPlaced.x - oldTile.x) === 1 && Math.abs(this.lastPlaced.y - oldTile.y) === 0;
        const yDiff = Math.abs(this.lastPlaced.x - oldTile.x) === 0 && Math.abs(this.lastPlaced.y - oldTile.y) === 1;
        if (!(xDiff !== yDiff)) { this.replaceTile(oldTile, newTile); return; } //not adjacent

        newTile.destroy(); //need to recalcuate newTile
        if (xDiff) {
            if (this.lastPlaced.x - oldTile.x === 1) { //left of last placed
                this.selectedTile = this.tileSelector[2].getData('tile');
            } else { //right of last placed
                this.selectedTile = this.tileSelector[1].getData('tile');
            }

        } else { //yDiff == true
            if (this.lastPlaced.y - oldTile.y === 1) { //above last placed
                this.selectedTile = this.tileSelector[3].getData('tile');
            } else { //below last placed
                this.selectedTile = this.tileSelector[4].getData('tile');
            }
        }
        //create the recalculated tiles and replace
        const tmp1 = copyArrowTile(this.selectedTile);
        const tmp2 = copyArrowTile(this.selectedTile);
        this.replaceTile(this.lastPlaced, tmp2);
        this.replaceTile(oldTile, tmp1);
    }


    //copies all necesarry parameters from newTile to oldTile, hence replacing oldTile with newTile
    private replaceTile(oldTile: Phaser.Tilemaps.Tile, newTile: Phaser.Tilemaps.Tile): void {
        if (oldTile.properties.lock) {
            newTile.properties.filter?.destroy();
            newTile.destroy();
            return;
        }
        this.allFood = this.allFood.filter(e => !oldTile.properties.foodArray?.includes(e)); //remove food from foodUpdate
        //oldTile.properties.removeAllFood?.();
        const tempFood = oldTile.properties.foodArray;
        const oldFilter = oldTile.properties.filter?.texture.key;
        oldTile.properties.filter?.destroy();
        oldTile.copy(newTile);
        oldTile.properties.parent = oldTile;
        oldTile.properties.filter.setPosition(oldTile.getCenterX() + oldTile.baseWidth/3,oldTile.getCenterY() + oldTile.baseHeight/3);
        oldTile.properties.filter.setSize(oldTile.baseWidth, oldTile.baseHeight);
        oldTile.properties.filter.setDisplaySize(oldTile.baseWidth, oldTile.baseHeight);
        oldTile.properties.filter.setScale(oldTile.properties.filter.scale * 0.3);
        oldFilter ? oldTile.properties.filter.setTexture(oldFilter) : undefined;

        this.lastPlaced = oldTile;
        tempFood?.forEach(element => {
            newTile.properties.addFood(element);
            this.allFood.push(element);
        });
    }

    /**
     * Checks if it's time for the next game step.
     * 
     * @param {number} currentTime - the current time from the update function.
     * @return {boolean} - true if we have a new tick, false else.
     */
    nextStep(currentTime: number) {
        if (this.isTimerRunning) {
            if (currentTime >= this.lastStepTime + this.stepLength) {
                this.lastStepTime += this.stepLength;
                this.currentStep += 1;
                return true;
            }
            return false;
        }
    }

    update(time: number, delta: number): void {
        this.updateCameraCenterOnce();
        this.stepUpdate(time);
        this.controls.update(delta);
        this.updateGeneralMarker();
        this.allCookingStation.forEach(station => {
            station?.properties.tickCooking(time - this.lastTickTime, this.currentStep+1);
        });
        this.allFood.forEach(food => {
            food.tickUpdate(time - this.lastTickTime);
        })
        this.lastTickTime = time;
        this.moveCameraOnDrag();
        this.checkmaxLevelCompletionTimeExcess();
    }

    checkmaxLevelCompletionTimeExcess() {
        if (this.maxLevelCompletionTime < this.currentStep) {
            this.scene.start("ScoreScene", { score: 0, level: this.scene.key });
        }
    }


    stepUpdate(time: number) {
        while (this.nextStep(time)) {
            this.allCookingStation.forEach(station => {
                station?.properties.cooking(this.currentStep);
            });
            this.allFood.forEach(food => {
                food?.stepUpdate(this.currentStep);
            });
            this.targetTile.properties.checkWin(this.currentStep);

            //timer
            const timeLeft = this.maxLevelCompletionTime-this.currentStep;
            const timer = this.settingScene.tickVisual;
            timer?.setText?.(timeLeft.toString());

            //telling the player visually that time is running out soon
            if (timeLeft <= 20) timer?.setColor('red');
        }
    }

    public endGame(score: number) {
        this.scene.stop(this.scene.key);
        this.scene.start("ScoreScene", { score: score, level: this.scene.key });
    }

    //test bereich
    protected testSetup() {
        this.allIngerients = ["noneIngredient" ,"onion", "onionSliced", "pastaDone", "tomato", "tomatoSliced"];

        let temp: Phaser.Tilemaps.Tile = this.map.getTileAt(0, 0);
        let tile = copyArrowTile(this.tileSelector[1].getData('tile'));
        this.replaceTile(temp, tile);

        temp = this.map.getTileAt(1, 0);
        tile = copyArrowTile(this.tileSelector[4].getData('tile'));
        this.replaceTile(temp, tile);

        temp = this.map.getTileAt(1, 1);
        tile = copyArrowTile(this.tileSelector[2].getData('tile'));
        this.replaceTile(temp, tile);

        temp = this.map.getTileAt(0, 1);
        tile = copyArrowTile(this.tileSelector[3].getData('tile'));
        this.replaceTile(temp, tile);

        this.lastPlaced = undefined;

        const food1 = new Zutat(this.scene.scene, "onion", this.map.getTileAt(0, 0));
        this.map.getTileAt(0, 0).properties.addFood(food1);
        this.allFood.push(food1);

        temp = this.map.getTileAt(0, 9);
        tile = newDispensorTile(this.layer.layer, 5, 0, 9, "onion");
        temp.copy(tile);
        temp.properties.parent = temp;

        temp = this.map.getTileAt(24, 9);
        tile = newTargetTile(this.layer.layer, 6, 24, 9);
        tile.properties.addRequirements(["onionSliced","onionSliced","onionSliced"],31);
        this.targetTile = tile;
        temp.copy(tile);
        temp.properties.parent = temp;

        temp = this.map.getTileAt(16, 16);
        tile = newTrashTile(this.layer.layer, 6, 16, 16);
        temp.copy(tile);
        temp.properties.parent = temp;

        temp = this.map.getTileAt(8, 9);
        tile = newInputTile(this.layer.layer, 6, 8, 9);
        temp.copy(tile);
        temp.properties.parent = temp;

        temp = this.map.getTileAt(9, 9);
        tile = newCookingStation(this.layer.layer, 6, 9, 9);
        tile.properties.addRule(["onion","onion"],["onionSliced","onionSliced", "onionSliced"],3);
        tile.properties.addRule(["onionSliced", "onionSliced","onionSliced"],["tomato"],3);
        tile.properties.addRule(["tomato"],["onion","onion"],4);
        this.allCookingStation.push(tile);
        temp.copy(tile);
        temp.properties.parent = temp;
        
        temp = this.map.getTileAt(10, 9);
        tile = newOutputTile(this.layer.layer, 6, 10, 9);
        temp.copy(tile);
        temp.properties.parent = temp;
    }
}


