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

export class Level08 extends MainScene {
    constructor(){
        super("Level08");
        this.levelName = "Level 8: Lachs in Lauchsauce"
    }

    preload(): void {
        this.load.tilemapCSV('map_08', 'assets/tilemaps/csv/level08.csv');
        this.load.pack("preload", "assets/pack.json", "preload");     
        this.load.pack("preload_level08", "assets/pack/level08.json", "preload_level08");
    }
    protected setupGrid(): void {
        this.map = this.make.tilemap({ key: 'map_08', tileWidth: 64, tileHeight: 64 });

        this.map.addTilesetImage('defaultTile', 'defaultTile', this.textureSize, this.textureSize, undefined, undefined, 0);
        this.map.addTilesetImage('arrowRight', 'arrowRight', this.textureSize, this.textureSize, undefined, undefined, 1);
        this.map.addTilesetImage('arrowLeft', 'arrowLeft', this.textureSize, this.textureSize, undefined, undefined, 2);
        this.map.addTilesetImage('arrowUp', 'arrowUp', this.textureSize, this.textureSize, undefined, undefined, 3);
        this.map.addTilesetImage('arrowDown', 'arrowDown', this.textureSize, this.textureSize, undefined, undefined, 4);
        this.map.addTilesetImage('finish', 'finish', this.textureSize, this.textureSize, undefined, undefined, 5);
        this.map.addTilesetImage('stationInput', 'stationInput', this.textureSize, this.textureSize, undefined, undefined, 6);
        this.map.addTilesetImage('stationOutput', 'stationOutput', this.textureSize, this.textureSize, undefined, undefined, 7);
        this.map.addTilesetImage('crateButter', 'crateButter', this.textureSize, this.textureSize, undefined, undefined, 8);
        this.map.addTilesetImage('crateCream', 'crateCream', this.textureSize, this.textureSize, undefined, undefined, 9);
        this.map.addTilesetImage('crateLeek', 'crateLeek', this.textureSize, this.textureSize, undefined, undefined, 10);
        this.map.addTilesetImage('crateOnions', 'crateOnions', this.textureSize, this.textureSize, undefined, undefined, 11);
        this.map.addTilesetImage('assemblyTable8', 'assemblyTable8', this.textureSize, this.textureSize, undefined, undefined, 12);
        this.map.addTilesetImage('cuttingBoard8', 'cuttingBoard8', this.textureSize, this.textureSize, undefined, undefined, 13);
        this.map.addTilesetImage('boiler1', 'boiler1', this.textureSize, this.textureSize, undefined, undefined, 14);
        this.map.addTilesetImage('boiler2', 'boiler2', this.textureSize, this.textureSize, undefined, undefined, 15);
        this.map.addTilesetImage('crateSalmon', 'crateSalmon', this.textureSize, this.textureSize, undefined, undefined, 16);
        this.map.addTilesetImage('crateWater', 'crateWater', this.textureSize, this.textureSize, undefined, undefined, 17);
        this.map.addTilesetImage('crateEgg', 'crateEgg', this.textureSize, this.textureSize, undefined, undefined, 19);

        this.layer = this.map.createLayer(0, ['defaultTile', 'arrowRight', 'arrowLeft', 'arrowUp', 'arrowDown', 'finish', 'crateButter', 'crateCream', 'stationInput', 'stationOutput', 'crateLeek', 'crateOnions', 'assemblyTable8', 'cuttingBoard8', 'boiler1', 'boiler2', 'crateSalmon', 'crateWater', 'crateEgg']);
        this.layer.x = 0//(this.cameras.main.width / 2) - this.layer.width / 2; //center on x
        this.layer.y = 0//(this                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     .cameras.main.height / 2) - this.layer.height / 2; //center on y
    }                                                           

    protected testSetup(): void {
        this.allIngerients = ["noneIngredient", "butter", "cream", "creamEggYolk", "eggYolk", "leek", "leekSliced", "leekSlicedCooked", "onion", "onionSliced", "onionSlicedCooked", "onionSauce", "salmon", "salmonDish", "salmonSliced", "salmonSlicedCooked", "water", "egg"]
       
        let temp;
        let tile;

        //Create Dispensor
        //Butter
        temp = this.map.getTileAt(0, 1);
        tile = newDispensorTile(this.layer.layer, 8, 0, 1, "butter");
        temp.copy(tile);
        temp.properties.parent = temp; 
        //Cream 
        temp = this.map.getTileAt(0, 2);
        tile = newDispensorTile(this.layer.layer, 9, 0, 2, "cream");
        temp.copy(tile);
        temp.properties.parent = temp;  
        //Leek 
        temp = this.map.getTileAt(0, 4);
        tile = newDispensorTile(this.layer.layer, 10, 0, 4, "leek");
        temp.copy(tile);
        temp.properties.parent = temp;  
        //Onions
        temp = this.map.getTileAt(0, 5);
        tile = newDispensorTile(this.layer.layer, 11, 0, 5, "onion");
        temp.copy(tile);
        temp.properties.parent = temp;  
        //Egg
        temp = this.map.getTileAt(0, 7);
        tile = newDispensorTile(this.layer.layer, 19, 0, 7, "egg");
        temp.copy(tile);
        temp.properties.parent = temp;
        //Salmon
        temp = this.map.getTileAt(0, 8);
        tile = newDispensorTile(this.layer.layer, 16, 0, 8, "salmon");
        temp.copy(tile);
        temp.properties.parent = temp;
        //water
        temp = this.map.getTileAt(0, 10);
        tile = newDispensorTile(this.layer.layer, 17, 0, 10, "water");
        temp.copy(tile);
        temp.properties.parent = temp;  
        
        //Create Target
        temp = this.map.getTileAt(11, 6);
        tile = newTargetTile(this.layer.layer, 5, 11, 6);
        tile.properties.addRequirements(["salmonDish"], 100);
        this.targetTile = tile;
        temp.copy(tile);
        temp.properties.parent = temp;

        //All CookingStations
        let pos_x, pos_y: number; //Variables to set the position easier.
        
        //CuttingBoard
        pos_x = 6;
        pos_y = 3;
        //Create CookingStation Input
        temp = this.map.getTileAt(pos_x-1, pos_y);
        tile = newInputTile(this.layer.layer, 6, pos_x-1, pos_y);
        temp.copy(tile);
        temp.properties.parent = temp;
        //Create cooking Station
        temp = this.map.getTileAt(pos_x, pos_y);
        tile = newCookingStation(this.layer.layer, 13, pos_x, pos_y);
        tile.properties.addRule(["leek"], ["leekSliced"],2);  
        tile.properties.addRule(["salmon"], ["salmonSliced"],1);      
        tile.properties.addRule(["onion"], ["onionSliced"],2);     
        this.allCookingStation.push(tile);
        temp.copy(tile);
        temp.properties.parent = temp;
        //Create CookingStation Output
        temp = this.map.getTileAt(pos_x+1, pos_y);
        tile = newOutputTile(this.layer.layer, 7, pos_x+1, pos_y);
        temp.copy(tile);
        temp.properties.parent = temp;
        
        //Boiler1
        pos_x = 16;
        pos_y = 9;
        //Create CookingStation Input
        temp = this.map.getTileAt(pos_x-1, pos_y);
        tile = newInputTile(this.layer.layer, 6, pos_x-1, pos_y);
        temp.copy(tile);
        temp.properties.parent = temp;
        //Create cooking Station
        temp = this.map.getTileAt(pos_x, pos_y);
        tile = newCookingStation(this.layer.layer, 14, pos_x, pos_y);
        tile.properties.addRule(["leekSliced"], ["leekSlicedCooked"],12); 
        tile.properties.addRule(["salmonSliced", "salmonSliced", "water", "water"], ["salmonSlicedCooked"],3);     
        this.allCookingStation.push(tile);
        temp.copy(tile);
        temp.properties.parent = temp;
        //Create CookingStation Output
        temp = this.map.getTileAt(pos_x+1, pos_y);
        tile = newOutputTile(this.layer.layer, 7, pos_x+1, pos_y);
        temp.copy(tile);
        temp.properties.parent = temp;
        
        //Boiler2
        pos_x = 16;
        pos_y = 3;
        //Create CookingStation Input
        temp = this.map.getTileAt(pos_x-1, pos_y);
        tile = newInputTile(this.layer.layer, 6, pos_x-1, pos_y);
        temp.copy(tile);
        temp.properties.parent = temp;
        //Create cooking Station
        temp = this.map.getTileAt(pos_x, pos_y);
        tile = newCookingStation(this.layer.layer, 15, pos_x, pos_y);
        tile.properties.addRule(["onionSliced", "butter"], ["onionSlicedCooked"],3); 
        tile.properties.addRule(["onionSlicedCooked", "creamEggYolk"], ["onionSauce"],5);     
        this.allCookingStation.push(tile);
        temp.copy(tile);
        temp.properties.parent = temp;
        //Create CookingStation Output
        temp = this.map.getTileAt(pos_x+1, pos_y);
        tile = newOutputTile(this.layer.layer, 7, pos_x+1, pos_y);
        temp.copy(tile);
        temp.properties.parent = temp;
        
        //AssemblyTable
        pos_x = 6;
        pos_y = 9;
        //Create CookingStation Input
        temp = this.map.getTileAt(pos_x-1, pos_y);
        tile = newInputTile(this.layer.layer, 6, pos_x-1, pos_y);
        temp.copy(tile);
        temp.properties.parent = temp;
        //Create cooking Station
        temp = this.map.getTileAt(pos_x, pos_y);
        tile = newCookingStation(this.layer.layer, 12, pos_x, pos_y);
        tile.properties.addRule(["egg"], ["eggYolk"],1);    
        tile.properties.addRule(["eggYolk", "cream"], ["creamEggYolk"],1);    
        tile.properties.addRule(["leekSlicedCooked", "leekSlicedCooked", "leekSlicedCooked", "salmonSlicedCooked", "onionSauce"], ["salmonDish"],1);     
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