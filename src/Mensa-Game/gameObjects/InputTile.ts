import { Zutat } from "./Zutat";
import { newArrowTile } from "./ArrowTiles";

export function newInputTile(
    layer: Phaser.Tilemaps.LayerData,
    index: number,
    x: number,
    y: number,
    width?: number,
    height?: number,
    baseHeight?: number,
    properties?) {
    const result = newArrowTile(layer, index, x, y, "right", width, height, baseHeight, properties);
    result.properties.lock = true;
    result.properties.capacity = 9;
    addGetPosition(result);
    addInteract(result);
    return result;
}

/**
 * returns the position of place on tile where the food has to move
 * 
 * @param food which wants to move
 * 
 * @returns the position where the food has to move
 */
function addGetPosition(tile: Phaser.Tilemaps.Tile){
    tile.properties.getPosition = function (food: Zutat){
        const index = this.foodArray?.indexOf(food); 
        const column = index%3
        const row = (index - column)/3;
        const left = this.parent.getLeft();
        const width = this.parent.getRight() - left;
        const top = this.parent.getTop();
        const height = this.parent.getBottom() - top;
        return {x: left + (width/3)*column + width/6, y: top + (height/3)*row + height/6};
    }
}

function addInteract(tile: Phaser.Tilemaps.Tile) {
    tile.properties.interact = function (): void {
        this.parent.tilemap.getTileAt(this.parent.x+1, this.parent.y).properties.interact();
        return;
    }
}

