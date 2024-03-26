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

export class Level03 extends MainScene {
    constructor(){
        super("Level03");
        this.levelName = "Level 3: Nudeln mit Fertigsauce"
    }

    preload(): void {
        this.load.tilemapCSV('map03', 'assets/tilemaps/csv/level03.csv');
        this.load.pack("preload", "assets/pack.json", "preload");     
        this.load.pack("preload_level03", "assets/pack/level03.json", "preload_level03");        
    }
    protected setupGrid(): void {
        this.map = this.make.tilemap({ key: 'map03', tileWidth: 64, tileHeight: 64 });

        this.map.addTilesetImage('defaultTile', 'defaultTile', this.textureSize, this.textureSize, undefined, undefined, 0);
        this.map.addTilesetImage('arrowRight', 'arrowRight', this.textureSize, this.textureSize, undefined, undefined, 1);
        this.map.addTilesetImage('arrowLeft', 'arrowLeft', this.textureSize, this.textureSize, undefined, undefined, 2);
        this.map.addTilesetImage('arrowUp', 'arrowUp', this.textureSize, this.textureSize, undefined, undefined, 3);
        this.map.addTilesetImage('arrowDown', 'arrowDown', this.textureSize, this.textureSize, undefined, undefined, 4);
        this.map.addTilesetImage('crateTomatoSauce', 'crateTomatoSauce', this.textureSize, this.textureSize, undefined, undefined, 5);
        this.map.addTilesetImage('finish', 'finish', this.textureSize, this.textureSize, undefined, undefined, 6);
        this.map.addTilesetImage('stationInput', 'stationInput', this.textureSize, this.textureSize, undefined, undefined, 7);
        this.map.addTilesetImage('stationOutput', 'stationOutput', this.textureSize, this.textureSize, undefined, undefined, 8);
        this.map.addTilesetImage('boilerl3', 'boilerl3', this.textureSize, this.textureSize, undefined, undefined, 9);
        this.map.addTilesetImage('assemblyTablel3', 'assemblyTablel3', this.textureSize, this.textureSize, undefined, undefined, 10);
        this.map.addTilesetImage('pastaMaker', 'pastaMaker', this.textureSize, this.textureSize, undefined, undefined, 11);

        this.layer = this.map.createLayer(0, ['defaultTile', 'arrowRight', 'arrowLeft', 'arrowUp', 'arrowDown', 'finish', 'crateTomatoSauce', 'stationInput', 'stationOutput', 'boilerl3', 'assemblyTablel3', 'pastaMaker']);
        this.layer.x = 0//(this.cameras.main.width / 2) - this.layer.width / 2; //center on x
        this.layer.y = 0//(this                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     .cameras.main.height / 2) - this.layer.height / 2; //center on y
    }                                                           

    protected testSetup(): void {
        this.allIngerients = ["noneIngredient", "pastaDry", "pastaDone", "tomatoSauceGlass", "tomatoSauceUncoocked", "tomatoSauceCooked", "pastaDish"];
        let temp;
        let tile;

        //Create Dispensor
        temp = this.map.getTileAt(0, 3);
        tile = newDispensorTile(this.layer.layer, 5, 0, 3, "tomatoSauceGlass");
        temp.copy(tile);
        temp.properties.parent = temp; 

        temp = this.map.getTileAt(0, 1);
        tile = newDispensorTile(this.layer.layer, 11, 0, 1, "pastaDry");
        temp.copy(tile);
        temp.properties.parent = temp;  
        
        //Create Target
        temp = this.map.getTileAt(10, 2);
        tile = newTargetTile(this.layer.layer, 6, 10, 2);
        tile.properties.addRequirements(["pastaDish"], 28);
        this.targetTile = tile;
        temp.copy(tile);
        temp.properties.parent = temp;

        //Create Boiler Input
        temp = this.map.getTileAt(4, 1);
        tile = newInputTile(this.layer.layer, 7, 4, 1);
        temp.copy(tile);
        temp.properties.parent = temp;

        //Create Boiler
        temp = this.map.getTileAt(5, 1);
        tile = newCookingStation(this.layer.layer, 9, 5, 1);
        tile.properties.addRule(["pastaDry"],["pastaDone"],6);   
        tile.properties.addRule(["tomatoSauceUncoocked"],["tomatoSauceCooked"],3);   
        this.allCookingStation.push(tile);
        temp.copy(tile);
        temp.properties.parent = temp;

        //Create Boiler Output
        temp = this.map.getTileAt(6, 1);
        tile = newOutputTile(this.layer.layer, 8, 6, 1);
        temp.copy(tile);
        temp.properties.parent = temp;

        //Create Assembly Input
        temp = this.map.getTileAt(4, 3);
        tile = newInputTile(this.layer.layer, 7, 4, 3);
        temp.copy(tile);
        temp.properties.parent = temp;

        //Create Assembly
        temp = this.map.getTileAt(5, 3);
        tile = newCookingStation(this.layer.layer, 10, 5, 3);
        tile.properties.addRule(["tomatoSauceGlass"],["tomatoSauceUncoocked"],1); 
        tile.properties.addRule(["pastaDone", "tomatoSauceCooked"], ["pastaDish"],3); 
        
        this.allCookingStation.push(tile);
        temp.copy(tile);
        temp.properties.parent = temp;

        //Create Assembly Output
        temp = this.map.getTileAt(6, 3);
        tile = newOutputTile(this.layer.layer, 8, 6, 3);
        temp.copy(tile);
        temp.properties.parent = temp;
    }
} 