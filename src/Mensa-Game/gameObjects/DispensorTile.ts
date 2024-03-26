import { Zutat } from "./Zutat";
import { newArrowTile } from "./ArrowTiles";
import { MainScene } from "../scenes/MainScene";

export function newDispensorTile(
    layer: Phaser.Tilemaps.LayerData,
    index: number,
    x: number,
    y: number,
    food: string,
    width?: number,
    height?: number,
    baseHeight?: number,
    properties?) {
    const result = newArrowTile(layer, index, x, y, "right", width, height, baseHeight, properties);
    result.properties.food = food;
    result.properties.idCount = 0;
    result.properties.lock = true;

    addInteract(result);

    return result;
}

function addInteract(tile: Phaser.Tilemaps.Tile) {
    tile.properties.interact = function (): void {
        const newFood = new Zutat(this.parent.tilemap.scene, //create food
            this.food,
            this.parent.tilemap.getTileAt(tile.x, tile.y));
        //if it can be added to the tile add it into the update list else destroy it
        if(this.addFood(newFood) !== -1){
            this.parent.tilemap.scene.allFood?.push(newFood);
            this.parent.tilemap.scene.settingScene.startGame();
        }else newFood.destroy();
    }
}