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
import { MainScene } from "./MainScene";

export class Level01 extends MainScene {
    constructor(){
        super("Level01");
        this.levelName = "Level 1: Hartgekochtes Ei"
    }

    preload(): void {
        this.load.tilemapCSV('map', 'assets/tilemaps/csv/level01.csv');
        this.load.pack("preload", "assets/pack.json", "preload");     
        this.load.pack("preload_level01", "assets/pack/level01.json", "preload_level01");        
    }
    protected setupGrid(): void {
        this.map = this.make.tilemap({ key: 'map', tileWidth: 64, tileHeight: 64 });

        this.map.addTilesetImage('defaultTile', 'defaultTile', this.textureSize, this.textureSize, undefined, undefined, 0);
        this.map.addTilesetImage('arrowRight', 'arrowRight', this.textureSize, this.textureSize, undefined, undefined, 1);
        this.map.addTilesetImage('arrowLeft', 'arrowLeft', this.textureSize, this.textureSize, undefined, undefined, 2);
        this.map.addTilesetImage('arrowUp', 'arrowUp', this.textureSize, this.textureSize, undefined, undefined, 3);
        this.map.addTilesetImage('arrowDown', 'arrowDown', this.textureSize, this.textureSize, undefined, undefined, 4);
        this.map.addTilesetImage('crateEgg', 'crateEgg', this.textureSize, this.textureSize, undefined, undefined, 5);
        this.map.addTilesetImage('finish', 'finish', this.textureSize, this.textureSize, undefined, undefined, 6);

        this.layer = this.map.createLayer(0, ['defaultTile', 'arrowRight', 'arrowLeft', 'arrowUp', 'arrowDown', 'finish', 'crateEgg']);
        this.layer.x = 0//(this.cameras.main.width / 2) - this.layer.width / 2; //center on x
        this.layer.y = 0//(this.cameras.main.height / 2) - this.layer.height / 2; //center on y
    }

    protected testSetup(): void {
        this.allIngerients = ["egg"];

        let temp;
        let tile;
        temp = this.map.getTileAt(0, 1);
        tile = newDispensorTile(this.layer.layer, 5, 0, 1, "egg");
        temp.copy(tile);
        temp.properties.parent = temp;  
        
        temp = this.map.getTileAt(8, 1);
        tile = newTargetTile(this.layer.layer, 6, 8, 1);
        tile.properties.addRequirements(["egg"],8);
        this.targetTile = tile;
        temp.copy(tile);
        temp.properties.parent = temp;
    }
} 