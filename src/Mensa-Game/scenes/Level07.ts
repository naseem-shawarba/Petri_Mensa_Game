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

export class Level07 extends MainScene {
    constructor(){
        super("Level07");
        this.levelName = 'Level 7: Bruschetta'
    }

    preload(): void {
        this.load.tilemapCSV('map_07', 'assets/tilemaps/csv/level07.csv');
        this.load.pack("preload", "assets/pack.json", "preload");     
        this.load.pack("preload_level07", "assets/pack/level07.json", "preload_level07");
    }
    protected setupGrid(): void {
        this.map = this.make.tilemap({ key: 'map_07', tileWidth: 64, tileHeight: 64 });

        this.map.addTilesetImage('defaultTile', 'defaultTile', this.textureSize, this.textureSize, undefined, undefined, 0);
        this.map.addTilesetImage('arrowRight', 'arrowRight', this.textureSize, this.textureSize, undefined, undefined, 1);
        this.map.addTilesetImage('arrowLeft', 'arrowLeft', this.textureSize, this.textureSize, undefined, undefined, 2);
        this.map.addTilesetImage('arrowUp', 'arrowUp', this.textureSize, this.textureSize, undefined, undefined, 3);
        this.map.addTilesetImage('arrowDown', 'arrowDown', this.textureSize, this.textureSize, undefined, undefined, 4);
        this.map.addTilesetImage('finish', 'finish', this.textureSize, this.textureSize, undefined, undefined, 5);
        this.map.addTilesetImage('stationInput', 'stationInput', this.textureSize, this.textureSize, undefined, undefined, 6);
        this.map.addTilesetImage('stationOutput', 'stationOutput', this.textureSize, this.textureSize, undefined, undefined, 7);
        this.map.addTilesetImage('crateChiabatta', 'crateChiabatta', this.textureSize, this.textureSize, undefined, undefined, 8);
        this.map.addTilesetImage('crateTomatoes', 'crateTomatoes', this.textureSize, this.textureSize, undefined, undefined, 9);
        this.map.addTilesetImage('crateGarlic', 'crateGarlic', this.textureSize, this.textureSize, undefined, undefined, 10);
        this.map.addTilesetImage('crateOliveOil7', 'crateOliveOil7', this.textureSize, this.textureSize, undefined, undefined, 11);
        this.map.addTilesetImage('assemblyTable7', 'assemblyTable7', this.textureSize, this.textureSize, undefined, undefined, 12);
        this.map.addTilesetImage('cuttingBoard7', 'cuttingBoard7', this.textureSize, this.textureSize, undefined, undefined, 13);
        this.map.addTilesetImage('pan7', 'pan7', this.textureSize, this.textureSize, undefined, undefined, 14);

        this.layer = this.map.createLayer(0, ['defaultTile', 'arrowRight', 'arrowLeft', 'arrowUp', 'arrowDown', 'finish', 'crateChiabatta', 'crateTomatoes', 'stationInput', 'stationOutput', 'crateGarlic', 'crateOliveOil7', 'assemblyTable7', 'cuttingBoard7', 'pan7']);
        this.layer.x = 0//(this.cameras.main.width / 2) - this.layer.width / 2; //center on x
        this.layer.y = 0//(this                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     .cameras.main.height / 2) - this.layer.height / 2; //center on y
    }                                                           

    protected testSetup(): void {
        this.allIngerients = ["noneIngredient", "tomato", "tomatoDiced", "garlicBulb", "garlicClove", "garlicMinced", "chiabatta", "chiabattaSliced", "chiabattaSlicedToasted", "oliveOil", "tomatoGarlicOliveOil", "bruschetta"];

        let temp;
        let tile;

        //Create Dispensor
        //Tomato
        temp = this.map.getTileAt(0, 1);
        tile = newDispensorTile(this.layer.layer, 9, 0, 1, "tomato");
        temp.copy(tile);
        temp.properties.parent = temp; 
        //Chiabatta 
        temp = this.map.getTileAt(0, 3);
        tile = newDispensorTile(this.layer.layer, 8, 0, 3, "chiabatta");
        temp.copy(tile);
        temp.properties.parent = temp;  
        //OliveOil
        temp = this.map.getTileAt(0, 5);
        tile = newDispensorTile(this.layer.layer, 11, 0, 5, "oliveOil");
        temp.copy(tile);
        temp.properties.parent = temp;  
        //Garlic
        temp = this.map.getTileAt(0, 7);
        tile = newDispensorTile(this.layer.layer, 10, 0, 7, "garlicBulb");
        temp.copy(tile);
        temp.properties.parent = temp;  
        
        //Create Target
        temp = this.map.getTileAt(23, 5);
        tile = newTargetTile(this.layer.layer, 5, 23, 5);
        tile.properties.addRequirements(["bruschetta"], 50);
        this.targetTile = tile;
        temp.copy(tile);
        temp.properties.parent = temp;

        //All CookingStations
        let pos_x, pos_y: number; //Variables to set the position easier.
        
        //CuttingBoard
        pos_x = 16;
        pos_y = 2;
        //Create CookingStation Input
        temp = this.map.getTileAt(pos_x-1, pos_y);
        tile = newInputTile(this.layer.layer, 6, pos_x-1, pos_y);
        temp.copy(tile);
        temp.properties.parent = temp;
        //Create cooking Station
        temp = this.map.getTileAt(pos_x, pos_y);
        tile = newCookingStation(this.layer.layer, 13, pos_x, pos_y);
        tile.properties.addRule(["tomato"],["tomatoDiced", "tomatoDiced"],2);  
        tile.properties.addRule(["garlicClove"],["garlicMinced"],2);      
        tile.properties.addRule(["chiabatta"],["chiabattaSliced"],1);     
        this.allCookingStation.push(tile);
        temp.copy(tile);
        temp.properties.parent = temp;
        //Create CookingStation Output
        temp = this.map.getTileAt(pos_x+1, pos_y);
        tile = newOutputTile(this.layer.layer, 7, pos_x+1, pos_y);
        temp.copy(tile);
        temp.properties.parent = temp;
        
        //Pan
        pos_x = 16;
        pos_y = 6;
        //Create CookingStation Input
        temp = this.map.getTileAt(pos_x-1, pos_y);
        tile = newInputTile(this.layer.layer, 6, pos_x-1, pos_y);
        temp.copy(tile);
        temp.properties.parent = temp;
        //Create cooking Station
        temp = this.map.getTileAt(pos_x, pos_y);
        tile = newCookingStation(this.layer.layer, 14, pos_x, pos_y);
        tile.properties.addRule(["chiabattaSliced"],["chiabattaSlicedToasted"],5);     
        this.allCookingStation.push(tile);
        temp.copy(tile);
        temp.properties.parent = temp;
        //Create CookingStation Output
        temp = this.map.getTileAt(pos_x+1, pos_y);
        tile = newOutputTile(this.layer.layer, 7, pos_x+1, pos_y);
        temp.copy(tile);
        temp.properties.parent = temp;
        
        //AssemblyTable
        pos_x = 8;
        pos_y = 4;
        //Create CookingStation Input
        temp = this.map.getTileAt(pos_x-1, pos_y);
        tile = newInputTile(this.layer.layer, 6, pos_x-1, pos_y);
        temp.copy(tile);
        temp.properties.parent = temp;
        //Create cooking Station
        temp = this.map.getTileAt(pos_x, pos_y);
        tile = newCookingStation(this.layer.layer, 12, pos_x, pos_y);
        tile.properties.addRule(["garlicBulb"],["garlicClove"],1);    
        tile.properties.addRule(["tomatoDiced", "garlicMinced", "oliveOil"],["tomatoGarlicOliveOil"],2);    
        tile.properties.addRule(["tomatoGarlicOliveOil","chiabattaSlicedToasted"],["bruschetta"],1);     
        this.allCookingStation.push(tile);
        temp.copy(tile);
        temp.properties.parent = temp;
        //Create CookingStation Output
        temp = this.map.getTileAt(pos_x+1, pos_y);
        tile = newOutputTile(this.layer.layer, 7, pos_x+1, pos_y);
        temp.copy(tile);
        temp.properties.parent = temp;
    }
} 