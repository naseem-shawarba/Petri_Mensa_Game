import { Zutat } from "./Zutat";
export function newArrowTile(
    layer: Phaser.Tilemaps.LayerData,
    index: number,
    x: number,
    y: number,
    mainDirection: string,
    width?: number,
    height?: number,
    baseHeight?: number,
    properties?
): Phaser.Tilemaps.Tile {
    const result = new Phaser.Tilemaps.Tile(layer, index, x, y, width, height, baseHeight, properties);
    result.properties.capacity = 1;
    result.properties.foodArray = [] as Zutat[];
    result.properties.parent = result as Phaser.Tilemaps.Tile;
    result.properties.lock = false;
    result.properties.mainDirection = mainDirection;

    addAddFood(result);
    addPopFood(result);
    addInteract(result);
    addStepUpdate(result);
    addTickUpdate(result);
    addRemoveAllFood(result);
    addMoveFood(result);
    addGetPosition(result);
    result.properties.filter = new Zutat(layer.tilemapLayer.scene, "noneIngredient", result);
    return result;
}

export function copyArrowTile(tile: Phaser.Tilemaps.Tile): Phaser.Tilemaps.Tile {
    const result = newArrowTile(
        tile.layer,
        tile.index,
        tile.x,
        tile.y,
        tile.properties.mainDirection,
        tile.width,
        tile.height,
        tile.baseHeight,
        tile.properties);
    result.properties.capacity = tile.properties.capacity
    result.properties.lock = tile.properties.lock
    result.properties.mainDirection = tile.properties.mainDirection
    return result;
}
/**
 * returns the position where the food has to move on
 * 
 * @param food which wants to move
 * 
 * @returns the center of tile
 */
function addGetPosition(tile: Phaser.Tilemaps.Tile){
    tile.properties.getPosition = function (food: Zutat){
        return {x: this.parent.getCenterX(), y: this.parent.getCenterY()};        
    }
}


/**
 * Simple function to add Zutaten to a tile.
 * 
 * @param food - the food Object we want to put on the tile.
 * @returns -1 if foodarray reach the capacity, new lenght otherwise
 */
function addAddFood(tile: Phaser.Tilemaps.Tile) {
    tile.properties.addFood = function (food: Zutat): number {
        return ((this.foodArray.length >= this.capacity) ? -1 : this.foodArray.push(food));
    }
}

/**
 * Returns element and remove it from the foodarray.
 * 
 * @returns element if it is in foodarray, null else
 */
function addPopFood(tile: Phaser.Tilemaps.Tile) {
    tile.properties.popFood = function (food: Zutat): Zutat {
        return this.foodArray.splice(this.foodArray.indexOf(food),1);
    }
}

function addRemoveAllFood(tile: Phaser.Tilemaps.Tile) {
    tile.properties.removeAllFood = function (): void {
        this.foodArray.forEach(el => {
            this.parent.tilemap.scene.allFood.splice(this.parent.tilemap.scene.allFood.indexOf(el),1);
            el.destroy();   //remove food from existence
        });
        this.foodArray = [];
    }
}



function addMoveFood(tile: Phaser.Tilemaps.Tile) {
    tile.properties.moveFood = function (z: Zutat): Phaser.Tilemaps.Tile {

        //vertical horizontal neighbours
        const VHNeighbours = [
            {position : this.parent.tilemap.getTileAt(this.parent.x, this.parent.y - 1) , forbiddenDirection :"down" },
            {position : this.parent.tilemap.getTileAt(this.parent.x, this.parent.y +1) , forbiddenDirection :"up"},
            {position : this.parent.tilemap.getTileAt(this.parent.x - 1, this.parent.y ) , forbiddenDirection :"right"},
            {position : this.parent.tilemap.getTileAt(this.parent.x + 1, this.parent.y ) , forbiddenDirection :"left"},
        ];
        for(const neighbour of VHNeighbours){
            if( neighbour.position?.properties?.filter?.texture.key === z.texture.key && 
                neighbour.position?.properties?.mainDirection !== neighbour.forbiddenDirection &&
                neighbour.position?.properties?.foodArray.length <  neighbour.position?.properties?.capacity
            ){
                return neighbour.position
            }
        }
        

        //tiles will dump all food if the order is correct and the next tile can accept it [BUG]
        switch (this.mainDirection) {
            case "up":
                return this.parent.tilemap.getTileAt(this.parent.x, this.parent.y - 1);
            case "down":
                return this.parent.tilemap.getTileAt(this.parent.x, this.parent.y + 1);
            case "left":
                return this.parent.tilemap.getTileAt(this.parent.x - 1, this.parent.y);
            case "right":
                return this.parent.tilemap.getTileAt(this.parent.x + 1, this.parent.y);
            default:
                return null;
        }
    }
}


function addInteract(tile: Phaser.Tilemaps.Tile) {
    tile.properties.interact = function (): void {
        if (!this.mainDirection) return;
        this.parent.tilemap.scene.openedElement = this.parent.tilemap.scene.settingScene.createFilterUI(this.parent);
    }
}

function addTickUpdate(tile: Phaser.Tilemaps.Tile) {
    tile.properties.tickUpdate = function (): void {
        return;
    }
}

function addStepUpdate(tile: Phaser.Tilemaps.Tile) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tile.properties.stepUpdate = function (currentStep = 0): void {
        return;
    }
}