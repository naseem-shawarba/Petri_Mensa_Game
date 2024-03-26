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

export class Level04 extends MainScene {
    constructor() {
        super("Level04");
        this.levelName = "Level 4: Caesar Salad";
    }

    preload(): void {


        this.load.pack("preload_level04", "assets/pack/level04.json", "preload_level04");
        this.load.pack("preload", "assets/pack.json", "preload");
        this.load.tilemapCSV('map_04', 'assets/tilemaps/csv/level04.csv');
    }
    protected setupGrid(): void {
        this.map = this.make.tilemap({ key: 'map_04', tileWidth: 64, tileHeight: 64 });

        this.map.addTilesetImage('defaultTile', 'defaultTile', this.textureSize, this.textureSize, undefined, undefined, 0);
        this.map.addTilesetImage('arrowRight', 'arrowRight', this.textureSize, this.textureSize, undefined, undefined, 1);
        this.map.addTilesetImage('arrowLeft', 'arrowLeft', this.textureSize, this.textureSize, undefined, undefined, 2);
        this.map.addTilesetImage('arrowUp', 'arrowUp', this.textureSize, this.textureSize, undefined, undefined, 3);
        this.map.addTilesetImage('arrowDown', 'arrowDown', this.textureSize, this.textureSize, undefined, undefined, 4);
        this.map.addTilesetImage('crateEgg', 'crateEgg', this.textureSize, this.textureSize, undefined, undefined, 5);
        this.map.addTilesetImage('finish', 'finish', this.textureSize, this.textureSize, undefined, undefined, 6);

        //Crates
        this.map.addTilesetImage('crateBreadSlices', 'crateBreadSlices', this.textureSize, this.textureSize, undefined, undefined, 15);
        this.map.addTilesetImage('crateTomatoesDirty', 'crateTomatoesDirty', this.textureSize, this.textureSize, undefined, undefined, 7);
        this.map.addTilesetImage('crateCucumberDirty', 'crateCucumberDirty', this.textureSize, this.textureSize, undefined, undefined, 8)
        this.map.addTilesetImage('crateLettuceDirty', 'crateLettuceDirty', this.textureSize, this.textureSize, undefined, undefined, 9);
        this.map.addTilesetImage('crateChickenRaw', 'crateChickenRaw', this.textureSize, this.textureSize, undefined, undefined, 10);
        //CookingStations
        this.map.addTilesetImage('washingStation[lvl4]', 'washingStation[lvl4]', this.textureSize, this.textureSize, undefined, undefined, 11);
        this.map.addTilesetImage('pan[lvl4]', 'pan[lvl4]', this.textureSize, this.textureSize, undefined, undefined, 12);
        this.map.addTilesetImage('cuttingBoard1', 'cuttingBoard1', this.textureSize, this.textureSize, undefined, undefined, 13);
        this.map.addTilesetImage('cuttingBoard2', 'cuttingBoard2', this.textureSize, this.textureSize, undefined, undefined, 16);
        this.map.addTilesetImage('assemblyTable[lvl4]', 'assemblyTable[lvl4]', this.textureSize, this.textureSize, undefined, undefined, 14);
        //inputTile
        this.map.addTilesetImage('stationInput', 'stationInput', this.textureSize, this.textureSize, undefined, undefined, 33);
        //outputTile
        this.map.addTilesetImage('stationOutput', 'stationOutput', this.textureSize, this.textureSize, undefined, undefined, 34);
        this.layer = this.map.createLayer(0, ['defaultTile', 'arrowRight', 'arrowLeft', 'arrowUp', 'arrowDown', 'finish', 'crateOnions', 'crateTomatoesDirty'
            , 'crateCucumberDirty', 'crateBreadSlices', 'crateLettuceDirty', 'crateChickenRaw', 'assemblyTable[lvl4]', 'pan[lvl4]', 'washingStation[lvl4]', 'stationInput', 'stationOutput'
            , 'cuttingBoard1', 'cuttingBoard2']);
        this.layer.x = 0//(this.cameras.main.width / 2) - this.layer.width / 2; //center on x
        this.layer.y = 0//(this.cameras.main.height / 2) - this.layer.height / 2; //center on y
    }

    protected testSetup(): void {
        this.allIngerients = ["noneIngredient", "tomatoDirty", "CucumberDirty", "LettuceDirty", "Bread", "ChickenRaw", "tomato", "CucumberClean",
            "LettuceClean", "tomatoSliced", "LettuceSliced", "CucumberSliced", "ChickenRawSliced", "BreadSliced", "ChickenFried", "BreadFried", "DishCesarSalad"];
        let temp;
        let tile;
        //TomatoCrate
        temp = this.map.getTileAt(1, 1);
        tile = newDispensorTile(this.layer.layer, 7, 1, 1, "tomatoDirty");
        temp.copy(tile);
        temp.properties.parent = temp;
        //CucumberCrate
        temp = this.map.getTileAt(1, 3);
        tile = newDispensorTile(this.layer.layer, 8, 1, 3, "CucumberDirty");
        temp.copy(tile);
        temp.properties.parent = temp;
        //LettuceCrate
        temp = this.map.getTileAt(1, 5);
        tile = newDispensorTile(this.layer.layer, 9, 1, 5, "LettuceDirty");
        temp.copy(tile);
        temp.properties.parent = temp;
        //BreadCrate
        temp = this.map.getTileAt(1, 7);
        tile = newDispensorTile(this.layer.layer, 15, 1, 7, "Bread");
        temp.copy(tile);
        temp.properties.parent = temp;
        //ChickenCrate
        temp = this.map.getTileAt(1, 9);
        tile = newDispensorTile(this.layer.layer, 10, 1, 9, "ChickenRaw");
        temp.copy(tile);
        temp.properties.parent = temp;
        //Waschstation for lettuce_dirty, tomato_dirty and cucumber_dirty
        temp = this.map.getTileAt(5, 3);
        tile = newInputTile(this.layer.layer, 33, 5, 3);
        temp.copy(tile);
        temp.properties.parent = temp;

        temp = this.map.getTileAt(6, 3);
        tile = newCookingStation(this.layer.layer, 11, 6, 3);
        tile.properties.addRule(["tomatoDirty"], ["tomato"], 3);
        tile.properties.addRule(["CucumberDirty"], ["CucumberClean"], 3);
        tile.properties.addRule(["LettuceDirty"], ["LettuceClean"], 4);
        this.allCookingStation.push(tile);
        temp.copy(tile);
        temp.properties.parent = temp;

        temp = this.map.getTileAt(7, 3);
        tile = newOutputTile(this.layer.layer, 34, 7, 3);
        temp.copy(tile);
        temp.properties.parent = temp;
        //Schneidebrett for all 
        temp = this.map.getTileAt(10, 5);
        tile = newInputTile(this.layer.layer, 33, 10, 5);
        temp.copy(tile);
        temp.properties.parent = temp;

        temp = this.map.getTileAt(11, 5);
        tile = newCookingStation(this.layer.layer, 13, 11, 5);
        tile.properties.addRule(["tomato"], ["tomatoSliced"], 3);
        tile.properties.addRule(["CucumberClean"], ["CucumberSliced"], 4);
        tile.properties.addRule(["LettuceClean"], ["LettuceSliced"], 3);
        this.allCookingStation.push(tile);
        temp.copy(tile);
        temp.properties.parent = temp;

        temp = this.map.getTileAt(12, 5);
        tile = newOutputTile(this.layer.layer, 34, 12, 5);
        temp.copy(tile);
        temp.properties.parent = temp;
        //Schneidebrett for all 
        temp = this.map.getTileAt(6, 8);
        tile = newInputTile(this.layer.layer, 33, 6, 8);
        temp.copy(tile);
        temp.properties.parent = temp;

        temp = this.map.getTileAt(7, 8);
        tile = newCookingStation(this.layer.layer, 16, 7, 8);
        tile.properties.addRule(["ChickenRaw"], ["ChickenRawSliced"], 4);
        tile.properties.addRule(["Bread"], ["BreadSliced"], 4);
        this.allCookingStation.push(tile);
        temp.copy(tile);
        temp.properties.parent = temp;

        temp = this.map.getTileAt(8, 8);
        tile = newOutputTile(this.layer.layer, 34, 8, 8);
        temp.copy(tile);
        temp.properties.parent = temp;
        //Pfanne for Chickenbreast and bread
        temp = this.map.getTileAt(15, 7);
        tile = newInputTile(this.layer.layer, 33, 15, 7);
        temp.copy(tile);
        temp.properties.parent = temp;

        temp = this.map.getTileAt(16, 7);
        tile = newCookingStation(this.layer.layer, 12, 16, 7);
        tile.properties.addRule(["ChickenRawSliced"], ["ChickenFried"], 3);
        tile.properties.addRule(["BreadSliced"], ["BreadFried"], 3);
        this.allCookingStation.push(tile);
        temp.copy(tile);
        temp.properties.parent = temp;

        temp = this.map.getTileAt(17, 7);
        tile = newOutputTile(this.layer.layer, 34, 17, 7);
        temp.copy(tile);
        temp.properties.parent = temp;

        //AssemblyTable
        temp = this.map.getTileAt(19, 5);
        tile = newInputTile(this.layer.layer, 33, 19, 5);
        temp.copy(tile);
        temp.properties.parent = temp;

        temp = this.map.getTileAt(20, 5);
        tile = newCookingStation(this.layer.layer, 14, 20, 5);
        tile.properties.addRule(["ChickenFried", "BreadFried", "BreadFried", "LettuceSliced", "CucumberSliced", "CucumberSliced", "tomatoSliced", "tomatoSliced"], ["DishCesarSalad"], 3);
        this.allCookingStation.push(tile);
        temp.copy(tile);
        temp.properties.parent = temp;

        temp = this.map.getTileAt(21, 5);
        tile = newOutputTile(this.layer.layer, 34, 21, 5);
        temp.copy(tile);
        temp.properties.parent = temp;
        //FinishTile
        temp = this.map.getTileAt(24, 5);
        tile = newTargetTile(this.layer.layer, 6, 24, 5);
        tile.properties.addRequirements(["DishCesarSalad"], 80); 
        this.targetTile = tile;
        temp.copy(tile);
        temp.properties.parent = temp;
    }
} 