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

export class Level02 extends MainScene {
    constructor(){
        super("Level02");
        this.levelName = "Level 2: TK-Pizza"
    }

    preload(): void {
        this.load.tilemapCSV('map', 'assets/tilemaps/csv/level01.csv');
        this.load.pack("preload", "assets/pack.json", "preload");     
        this.load.pack("preload_level02", "assets/pack/level02.json", "preload_level02");
    }
    protected setupGrid(): void {
        this.map = this.make.tilemap({ key: 'map', tileWidth: 64, tileHeight: 64 });

        this.map.addTilesetImage('defaultTile', 'defaultTile', this.textureSize, this.textureSize, undefined, undefined, 0);
        this.map.addTilesetImage('arrowRight', 'arrowRight', this.textureSize, this.textureSize, undefined, undefined, 1);
        this.map.addTilesetImage('arrowLeft', 'arrowLeft', this.textureSize, this.textureSize, undefined, undefined, 2);
        this.map.addTilesetImage('arrowUp', 'arrowUp', this.textureSize, this.textureSize, undefined, undefined, 3);
        this.map.addTilesetImage('arrowDown', 'arrowDown', this.textureSize, this.textureSize, undefined, undefined, 4);
        this.map.addTilesetImage('cratePizza', 'cratePizza', this.textureSize, this.textureSize, undefined, undefined, 5);
        this.map.addTilesetImage('finish', 'finish', this.textureSize, this.textureSize, undefined, undefined, 6);
        this.map.addTilesetImage('oven', 'oven', this.textureSize, this.textureSize, undefined, undefined, 7);
        this.map.addTilesetImage('stationInput', 'stationInput', this.textureSize, this.textureSize, undefined, undefined, 8);
        this.map.addTilesetImage('stationOutput', 'stationOutput', this.textureSize, this.textureSize, undefined, undefined, 9);

        this.layer = this.map.createLayer(0, ['defaultTile', 'arrowRight', 'arrowLeft', 'arrowUp', 'arrowDown', 'finish', 'cratePizza', 'oven', 'stationInput', 'stationOutput']);
        this.layer.x = 0//(this.cameras.main.width / 2) - this.layer.width / 2; //center on x
        this.layer.y = 0//(this                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     .cameras.main.height / 2) - this.layer.height / 2; //center on y
    }                                                           

    protected testSetup(): void {
        this.allIngerients = ["noneIngredient", "pizzaUncooked", "pizzaCooked"];

        let temp;
        let tile;

        //Create Dispensor
        temp = this.map.getTileAt(0, 1);
        tile = newDispensorTile(this.layer.layer, 5, 0, 1, "pizzaUncooked");
        temp.copy(tile);
        temp.properties.parent = temp;  
        
        //Create Target
        temp = this.map.getTileAt(8, 1);
        tile = newTargetTile(this.layer.layer, 6, 8, 1);
        tile.properties.addRequirements(["pizzaCooked"], 10);
        this.targetTile = tile;
        temp.copy(tile);
        temp.properties.parent = temp;

        //Create CookingStation Input
        temp = this.map.getTileAt(3, 1);
        tile = newInputTile(this.layer.layer, 8, 3, 1);
        temp.copy(tile);
        temp.properties.parent = temp;

        //Create cooking Station
        temp = this.map.getTileAt(4, 1);
        tile = newCookingStation(this.layer.layer, 7, 4, 1);
        tile.properties.addRule(["pizzaUncooked"],["pizzaCooked"],3);     
        this.allCookingStation.push(tile);
        temp.copy(tile);
        temp.properties.parent = temp;

        //Create CookingStation Output
        temp = this.map.getTileAt(5, 1);
        tile = newOutputTile(this.layer.layer, 9, 5, 1);
        temp.copy(tile);
        temp.properties.parent = temp;
    }
} 