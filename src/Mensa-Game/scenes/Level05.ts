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

export class Level05 extends MainScene {
    constructor() {
        super("Level05");
        this.levelName = "Level 5: Pho Nudelsuppe"
    }

    preload(): void {


        this.load.pack("preload_level05", "assets/pack/level05.json", "preload_level05");
        this.load.pack("preload", "assets/pack.json", "preload");
        this.load.tilemapCSV('map_05', 'assets/tilemaps/csv/level05.csv');
    }
    protected setupGrid(): void {

        this.map = this.make.tilemap({ key: 'map_05', tileWidth: 64, tileHeight: 64 });

        this.map.addTilesetImage('defaultTile', 'defaultTile', this.textureSize, this.textureSize, undefined, undefined, 0);
        this.map.addTilesetImage('arrowRight', 'arrowRight', this.textureSize, this.textureSize, undefined, undefined, 1);
        this.map.addTilesetImage('arrowLeft', 'arrowLeft', this.textureSize, this.textureSize, undefined, undefined, 2);
        this.map.addTilesetImage('arrowUp', 'arrowUp', this.textureSize, this.textureSize, undefined, undefined, 3);
        this.map.addTilesetImage('arrowDown', 'arrowDown', this.textureSize, this.textureSize, undefined, undefined, 4);
        this.map.addTilesetImage('finish', 'finish', this.textureSize, this.textureSize, undefined, undefined, 5);

        //Crates 
        this.map.addTilesetImage('crateBeef', 'crateBeef', this.textureSize, this.textureSize, undefined, undefined, 6);
        this.map.addTilesetImage('crateGinger', 'crateGinger', this.textureSize, this.textureSize, undefined, undefined, 7);
        this.map.addTilesetImage('crateBeefBone', 'crateBeefBone', this.textureSize, this.textureSize, undefined, undefined, 8)
        this.map.addTilesetImage('crateNoodlesPHO', 'crateNoodlesPHO', this.textureSize, this.textureSize, undefined, undefined, 9);
        this.map.addTilesetImage('crateCarrotsDirty', 'crateCarrotsDirty', this.textureSize, this.textureSize, undefined, undefined, 10);
        this.map.addTilesetImage('cratePakChoiDirty', 'cratePakChoiDirty', this.textureSize, this.textureSize, undefined, undefined, 11);
        //CookingStations
        this.map.addTilesetImage('cuttingBoardl5', 'cuttingBoardl5', this.textureSize, this.textureSize, undefined, undefined, 12);
        this.map.addTilesetImage('boiler[lvl5]', 'boiler[lvl5]', this.textureSize, this.textureSize, undefined, undefined, 13);
        this.map.addTilesetImage('pan[lvl5]', 'pan[lvl5]', this.textureSize, this.textureSize, undefined, undefined, 14);
        this.map.addTilesetImage('assemblyTable[lvl5]', 'assemblyTable[lvl5]', this.textureSize, this.textureSize, undefined, undefined, 15);
        this.map.addTilesetImage('washingStation[lvl5]', 'washingStation[lvl5]', this.textureSize, this.textureSize, undefined, undefined, 16);
        this.map.addTilesetImage('trashCan', 'trashCan', this.textureSize, this.textureSize, undefined, undefined, 17);
        //inputTile
        this.map.addTilesetImage('stationInput', 'stationInput', this.textureSize, this.textureSize, undefined, undefined, 33);
        //outputTile
        this.map.addTilesetImage('stationOutput', 'stationOutput', this.textureSize, this.textureSize, undefined, undefined, 34);
        this.layer = this.map.createLayer(0, ['crateCarrotsDirty', 'crateNoodlesPHO', 'defaultTile', 'arrowRight', 'arrowLeft', 'arrowUp', 'arrowDown', 'finish', 'crateOnions', 'crateGinger'
            , 'crateBeefBone', 'crateBeef', 'trashCan', 'NoodlesPHO', 'cratePakChoiDirty', 'assemblyTable[lvl5]', 'pan[lvl5]', 'boiler[lvl5]', 'cuttingBoardl5', 'stationInput', 'stationOutput', 'washingStation[lvl5]']);
        this.layer.x = 0//(this.cameras.main.width / 2) - this.layer.width / 2; //center on x
        this.layer.y = 0//(this.cameras.main.height / 2) - this.layer.height / 2; //center on y 
    }

    protected testSetup(): void {
        this.allIngerients = ["noneIngredient", "Ginger", "BeefBone", "NoodlesPHO", "NoodlesPHOCooked", "GingerSliced", "PakChoiDirty", "carrotDirty", "carrot", "CarrotSliced", "Bone"
            , "BeefRawSliced", "BeefBoneBrothGingerCarrot", "wastebag", "PakChoiClean", "BeefFried", "DishPhoNoodles"];
        let temp;
        let tile;
        //RindfleischCrate
        //temp = this.map.getTileAt(1, 1);
        //tile = newDispensorTile(this.layer.layer, 6, 1, 1, "BeefRaw");
        //temp.copy(tile);
        //temp.properties.parent = temp;
        //IngwerCrate
        temp = this.map.getTileAt(1, 3);
        tile = newDispensorTile(this.layer.layer, 7, 1, 3, "Ginger");
        temp.copy(tile);
        temp.properties.parent = temp;
        //RinderKnochenCrate
        temp = this.map.getTileAt(1, 5);
        tile = newDispensorTile(this.layer.layer, 8, 1, 5, "BeefBone");
        temp.copy(tile);
        temp.properties.parent = temp;
        //NoodlesPhoCrate
        temp = this.map.getTileAt(1, 7);
        tile = newDispensorTile(this.layer.layer, 9, 1, 7, "NoodlesPHO");
        temp.copy(tile);
        temp.properties.parent = temp;
        //CarrotCrate
        temp = this.map.getTileAt(1, 9);
        tile = newDispensorTile(this.layer.layer, 10, 1, 9, "carrotDirty");
        temp.copy(tile);
        temp.properties.parent = temp;
        //PakChoiCrate
        temp = this.map.getTileAt(1, 11);
        tile = newDispensorTile(this.layer.layer, 11, 1, 11, "PakChoiDirty");
        temp.copy(tile);
        temp.properties.parent = temp;
        //Schneidebrett für Rindfleisch/Ingwer
        temp = this.map.getTileAt(4, 2);
        tile = newInputTile(this.layer.layer, 33, 4, 2);
        temp.copy(tile);
        temp.properties.parent = temp;

        temp = this.map.getTileAt(5, 2);
        tile = newCookingStation(this.layer.layer, 12, 5, 2);
        tile.properties.addRule(["BeefBone"], ["BeefRawSliced", "Bone", "Bone"], 3);
        tile.properties.addRule(["Ginger"], ["GingerSliced"], 3);
        tile.properties.addRule(["carrot"], ["CarrotSliced"], 3);
        this.allCookingStation.push(tile);
        temp.copy(tile);
        temp.properties.parent = temp;

        temp = this.map.getTileAt(6, 2);
        tile = newOutputTile(this.layer.layer, 34, 6, 2);
        temp.copy(tile);
        temp.properties.parent = temp;

        //Kochtopf für Knochen/Pasta/carroten
        temp = this.map.getTileAt(4, 6);
        tile = newInputTile(this.layer.layer, 33, 4, 6);
        temp.copy(tile);
        temp.properties.parent = temp;

        temp = this.map.getTileAt(5, 6);
        tile = newCookingStation(this.layer.layer, 13, 5, 6);
        tile.properties.addRule(["NoodlesPHO"], ["NoodlesPHOCooked"], 3);
        tile.properties.addRule(["Bone", "Bone", "CarrotSliced", "CarrotSliced", "GingerSliced"], ["BeefBoneBrothGingerCarrot", "wastebag", "wastebag"], 3);
        this.allCookingStation.push(tile);
        temp.copy(tile);
        temp.properties.parent = temp;

        temp = this.map.getTileAt(6, 6);
        tile = newOutputTile(this.layer.layer, 34, 6, 6);
        temp.copy(tile);
        temp.properties.parent = temp;
        //Waschstation Carrots/PakChoi
        temp = this.map.getTileAt(4, 10);
        tile = newInputTile(this.layer.layer, 33, 4, 10);
        temp.copy(tile);
        temp.properties.parent = temp;

        temp = this.map.getTileAt(5, 10);
        tile = newCookingStation(this.layer.layer, 16, 5, 10);
        tile.properties.addRule(["PakChoiDirty"], ["PakChoiClean"], 3);
        tile.properties.addRule(["carrotDirty"], ["carrot"], 3);
        this.allCookingStation.push(tile);
        temp.copy(tile);
        temp.properties.parent = temp;

        temp = this.map.getTileAt(6, 10);
        tile = newOutputTile(this.layer.layer, 34, 6, 10);
        temp.copy(tile);
        temp.properties.parent = temp;
        //Pfanne Rindfleisch
        temp = this.map.getTileAt(10, 4);
        tile = newInputTile(this.layer.layer, 33, 10, 4);
        temp.copy(tile);
        temp.properties.parent = temp;

        temp = this.map.getTileAt(11, 4);
        tile = newCookingStation(this.layer.layer, 14, 11, 4);
        tile.properties.addRule(["BeefRawSliced"], ["BeefFried"], 3);
        this.allCookingStation.push(tile);
        temp.copy(tile);
        temp.properties.parent = temp;

        temp = this.map.getTileAt(12, 4);
        tile = newOutputTile(this.layer.layer, 34, 12, 4);
        temp.copy(tile);
        temp.properties.parent = temp;


        //AssemblyTable
        temp = this.map.getTileAt(16, 8);
        tile = newInputTile(this.layer.layer, 33, 16, 8);
        temp.copy(tile);
        temp.properties.parent = temp;

        temp = this.map.getTileAt(17, 8);
        tile = newCookingStation(this.layer.layer, 15, 17, 8);
        tile.properties.addRule(["BeefBoneBrothGingerCarrot", "BeefFried", "PakChoiClean", "PakChoiClean", "PakChoiClean", "NoodlesPHOCooked"], ["DishPhoNoodles"], 3);
        this.allCookingStation.push(tile);
        temp.copy(tile);
        temp.properties.parent = temp;

        temp = this.map.getTileAt(18, 8);
        tile = newOutputTile(this.layer.layer, 34, 18, 8);
        temp.copy(tile);
        temp.properties.parent = temp;
        //FinishTile
        temp = this.map.getTileAt(23, 6);
        tile = newTargetTile(this.layer.layer, 5, 23, 6);
        tile.properties.addRequirements(["DishPhoNoodles"], 60);
        this.targetTile = tile;
        temp.copy(tile);
        temp.properties.parent = temp;
        //TrashTile
        temp = this.map.getTileAt(18, 1);
        tile = newTrashTile(this.layer.layer, 17, 18, 1);
        temp.copy(tile);
        temp.properties.parent = temp;

    }
} 