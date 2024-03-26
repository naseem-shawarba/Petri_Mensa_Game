import { newArrowTile } from "./ArrowTiles";

export function newTrashTile(
    layer: Phaser.Tilemaps.LayerData,
    index: number,
    x: number,
    y: number,
    width?: number,
    height?: number,
    baseHeight?: number,
    properties?: any) {
    const result = newArrowTile(layer, index, x, y, null, width, height, baseHeight, properties);
    result.properties.lock = true;
    addStepUpdate(result);
    return result;
}

function addStepUpdate(tile: Phaser.Tilemaps.Tile) {
    tile.properties.stepUpdate = function (): void {
        tile.properties.removeAllFood();
    }
}