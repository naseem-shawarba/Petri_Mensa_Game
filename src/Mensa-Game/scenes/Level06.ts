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

export class Level06 extends MainScene {
    constructor() {
        super("Level06");
        this.levelName = "Level 6: Pasta"
    }

    preload(): void {
        this.load.tilemapCSV('map_06', 'assets/tilemaps/csv/level06.csv');
        this.load.pack("preload", "assets/pack.json", "preload");
        this.load.pack("preload_level06", "assets/pack/level06.json", "preload_level06");
    }
    protected setupGrid(): void {
        this.map = this.make.tilemap({ key: 'map_06', tileWidth: 64, tileHeight: 64 });

        this.map.addTilesetImage('defaultTile', 'defaultTile', this.textureSize, this.textureSize, undefined, undefined, 0);
        this.map.addTilesetImage('arrowRight', 'arrowRight', this.textureSize, this.textureSize, undefined, undefined, 1);
        this.map.addTilesetImage('arrowLeft', 'arrowLeft', this.textureSize, this.textureSize, undefined, undefined, 2);
        this.map.addTilesetImage('arrowUp', 'arrowUp', this.textureSize, this.textureSize, undefined, undefined, 3);
        this.map.addTilesetImage('arrowDown', 'arrowDown', this.textureSize, this.textureSize, undefined, undefined, 4);
        this.map.addTilesetImage('finish', 'finish', this.textureSize, this.textureSize, undefined, undefined, 5);


        //Crates
        this.map.addTilesetImage('crateOnions', 'crateOnions', this.textureSize, this.textureSize, undefined, undefined, 6);
        this.map.addTilesetImage('crateTomatoes', 'crateTomatoes', this.textureSize, this.textureSize, undefined, undefined, 7);
        this.map.addTilesetImage('crateCarrots', 'crateCarrots', this.textureSize, this.textureSize, undefined, undefined, 8);
        this.map.addTilesetImage('pastaMaker', 'pastaMaker', this.textureSize, this.textureSize, undefined, undefined, 9);
        //CookingStations
        this.map.addTilesetImage('cuttingBoardl6', 'cuttingBoardl6', this.textureSize, this.textureSize, undefined, undefined, 10);
        this.map.addTilesetImage('boiler[lvl6]', 'boiler[lvl6]', this.textureSize, this.textureSize, undefined, undefined, 11);
        this.map.addTilesetImage('pan[lvl6]', 'pan[lvl6]', this.textureSize, this.textureSize, undefined, undefined, 12);
        this.map.addTilesetImage('assemblyTable[lvl6]', 'assemblyTable[lvl6]', this.textureSize, this.textureSize, undefined, undefined, 13);
        //inputTile
        this.map.addTilesetImage('stationInput', 'stationInput', this.textureSize, this.textureSize, undefined, undefined, 20);
        //outputTile
        this.map.addTilesetImage('stationOutput', 'stationOutput', this.textureSize, this.textureSize, undefined, undefined, 21);

        this.layer = this.map.createLayer(0, ['defaultTile', 'arrowRight', 'arrowLeft', 'arrowUp', 'arrowDown', 'finish', 'crateEgg'
            , 'crateOnions', 'crateTomatoes', 'crateCarrots', 'pastaMaker', 'cuttingBoardl6', 'boiler[lvl6]', 'pan[lvl6]', 'stationInput',
            'stationOutput', 'assemblyTable[lvl6]']);
        this.layer.x = 0//(this.cameras.main.width / 2) - this.layer.width / 2; //center on x
        this.layer.y = 0//(this.cameras.main.height / 2) - this.layer.height / 2; //center on y
    }
    //linter comment
    protected testSetup(): void {
        this.allIngerients = ["noneIngredient", "onion", "carrot", "tomato", "pastaDry", "onionDiced", "carrotCut", "tomatoSliced", "carrotOnionRoasted"
            , "tomatoSauceCooked", "pastaDone", "pastaDish"];
        let temp;
        let tile;
        //onionCrate
        temp = this.map.getTileAt(0, 1);
        tile = newDispensorTile(this.layer.layer, 6, 0, 1, "onion");
        temp.copy(tile);
        temp.properties.parent = temp;
        //carrotCrate
        temp = this.map.getTileAt(0, 2);
        tile = newDispensorTile(this.layer.layer, 8, 0, 2, "carrot");
        temp.copy(tile);
        temp.properties.parent = temp;
        //TomatoCrate
        temp = this.map.getTileAt(0, 3);
        tile = newDispensorTile(this.layer.layer, 7, 0, 3, "tomato");
        temp.copy(tile);
        temp.properties.parent = temp;
        //PastaCrate
        temp = this.map.getTileAt(0, 5);
        tile = newDispensorTile(this.layer.layer, 9, 0, 5, "pastaDry");
        temp.copy(tile);
        temp.properties.parent = temp;

        //SchneideStation Onions
        temp = this.map.getTileAt(3, 3);
        tile = newInputTile(this.layer.layer, 20, 3, 3);
        temp.copy(tile);
        temp.properties.parent = temp;

        temp = this.map.getTileAt(4, 3);
        tile = newCookingStation(this.layer.layer, 10, 4, 3);
        tile.properties.addRule(["onion"], ["onionDiced"], 3);
        tile.properties.addRule(["carrot"], ["carrotCut"], 3);
        tile.properties.addRule(["tomato"], ["tomatoSliced"], 2);
        this.allCookingStation.push(tile);
        temp.copy(tile);
        temp.properties.parent = temp;

        temp = this.map.getTileAt(5, 3);
        tile = newOutputTile(this.layer.layer, 21, 5, 3);
        temp.copy(tile);
        temp.properties.parent = temp;

        //pfanne Carrots, Onions
        temp = this.map.getTileAt(7, 1);
        tile = newInputTile(this.layer.layer, 20, 7, 1);
        temp.copy(tile);
        temp.properties.parent = temp;

        temp = this.map.getTileAt(8, 1);
        tile = newCookingStation(this.layer.layer, 12, 8, 1);
        tile.properties.addRule(["carrotCut", "onionDiced"], ["carrotOnionRoasted"], 3);
        this.allCookingStation.push(tile);
        temp.copy(tile);
        temp.properties.parent = temp;

        temp = this.map.getTileAt(9, 1);
        tile = newOutputTile(this.layer.layer, 21, 9, 1);
        temp.copy(tile);
        temp.properties.parent = temp;

        //Boileer Carrots, Onions, tomatoes
        temp = this.map.getTileAt(7, 5);
        tile = newInputTile(this.layer.layer, 20, 7, 5);
        temp.copy(tile);
        temp.properties.parent = temp;

        temp = this.map.getTileAt(8, 5);
        tile = newCookingStation(this.layer.layer, 11, 8, 5);
        tile.properties.addRule(["pastaDry"], ["pastaDone"], 20);
        tile.properties.addRule(["carrotOnionRoasted", "tomatoSliced", "tomatoSliced", "tomatoSliced", "tomatoSliced"], ["tomatoSauceCooked"], 3);
        this.allCookingStation.push(tile);
        temp.copy(tile);
        temp.properties.parent = temp;

        temp = this.map.getTileAt(9, 5);
        tile = newOutputTile(this.layer.layer, 21, 9, 5);
        temp.copy(tile);
        temp.properties.parent = temp;


        //AssemblyTable 
        temp = this.map.getTileAt(11, 3);
        tile = newInputTile(this.layer.layer, 20, 11, 3);
        temp.copy(tile);
        temp.properties.parent = temp;

        temp = this.map.getTileAt(12, 3);
        tile = newCookingStation(this.layer.layer, 13, 12, 3);
        tile.properties.addRule(["tomatoSauceCooked", "pastaDone"], ["pastaDish"], 3);
        this.allCookingStation.push(tile);
        temp.copy(tile);
        temp.properties.parent = temp;

        temp = this.map.getTileAt(13, 3);
        tile = newOutputTile(this.layer.layer, 21, 13, 3);
        temp.copy(tile);
        temp.properties.parent = temp;

        temp = this.map.getTileAt(14, 5);
        tile = newTargetTile(this.layer.layer, 5, 14, 5);
        tile.properties.addRequirements(["pastaDish"], 50);
        this.maxLevelCompletionTime=50;
        this.targetTile = tile;
        temp.copy(tile);
        temp.properties.parent = temp;
    }
} 