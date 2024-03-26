import { MainScene } from "../scenes/MainScene";
import { newArrowTile } from "./ArrowTiles";
import { Zutat } from "./Zutat";

export function newTargetTile(
    layer: Phaser.Tilemaps.LayerData,
    index: number,
    x: number,
    y: number,
    width?: number,
    height?: number,
    baseHeight?: number,
    properties?) {
    const result = newArrowTile(layer, index, x, y, null, width, height, baseHeight, properties);
    result.properties.lock = true;
    result.properties.capacity = 0;
    result.properties.requirements = null;
    result.properties.emptyField = false;
    result.properties.maxTime=0;
    addAddFood(result);
    addAddRequirements(result);
    addGetPosition(result);
    addCheckWin(result);
    addevaluate(result);
    addGetTimeFactor(result);
    return result;
}

/**
 * Simple function to add Zutaten to a tile. only accept needed Food 
 * 
 * @param food - the food Object we want to put on the tile.
 * @returns -1 if foodarray reach the capacity, new lenght otherwise
 */
function addAddFood(tile: Phaser.Tilemaps.Tile) {
    tile.properties.addFood = function (food: Zutat): number {
        if(this.requirements == null)return -1;
        if(this.requirements.food.filter(a => a == food.texture.key).length > this.foodArray.filter(z => z.texture.key == food.texture.key).length){
            return this.foodArray.push(food);
        }
        return -1;
    }
}
/**
 * calculate timefactor
 * 
 * @param currentStep
 * 
 * @returns timeFactor
 */
function addGetTimeFactor(tile: Phaser.Tilemaps.Tile){
    tile.properties.getTimeFactor = function(currentStep: number):number{
        const perfectTime = this.requirements.time;
        return Math.max(Math.min((1/(((currentStep-perfectTime)/(2*(this.maxTime-perfectTime)))-1) + 2),1),0);
    }
}

/**
 * evaluate score depending on the time used and Arrowtiles
 * 
 * @param currentStep time-progress in steps 
 */
function addevaluate(tile: Phaser.Tilemaps.Tile){
    tile.properties.evaluate = function(currentStep: number):number{
        const map = this.parent.tilemap.getTilesWithin(0,0,this.parent.tilemap.width,this.parent.tilemap.height); //all tiles in game
        const tileFactor = Math.min(Math.sqrt(this.requirements.tiles)/Math.sqrt(map.filter( a => a.properties.mainDirection!=undefined).length),1);
        const timeFactor = this.getTimeFactor(currentStep);
        const foodFactor = Math.min(Math.sqrt(this.foodArray.length)/Math.sqrt(this.parent.tilemap.scene.allFood.length),1)
        return Math.max(Math.min(Math.ceil(100*((timeFactor**3)*tileFactor*foodFactor)),100),1);
    }
}

/**
 * checks if all requested food has arrived and if there is no more food on the field,
 * if this is the case we call the endgame() function
 *  
 */
function addCheckWin(tile: Phaser.Tilemaps.Tile){
    tile.properties.checkWin = function (currentStep: number): void{
        if(this.foodArray.length < this.requirements.food.length)return;
        if(this.emptyField && this.parent.tilemap.scene.allFood.length > this.foodArray.length) return;
        this.parent.tilemap.scene.endGame?.(this.evaluate(currentStep));
        return;
    }
}
/**
 * place the food on tile
 * 
 * @param food which has to be placed
 * 
 * @returns the position {x:..., y:...} where the food has to move on
 */
function addGetPosition(tile: Phaser.Tilemaps.Tile){
    tile.properties.getPosition = function (food: Zutat){
        const index = this.foodArray?.indexOf(food); 
        const sqrt = Math.ceil(Math.sqrt(this.capacity));
        const column = index%sqrt;
        const row = (index - column)/sqrt;
        const left = this.parent.getLeft();
        const width = this.parent.getRight() - left;
        const top = this.parent.getTop();
        const height = this.parent.getBottom() - top;
        return {x: left + (width/sqrt)*column + width/(2*sqrt), y: top + (height/sqrt)*row + height/(2*sqrt)};
    }
}
/**
 * Sets the winning-requirements
 * 
 */
function addAddRequirements(tile: Phaser.Tilemaps.Tile){
    tile.properties.addRequirements = function (foodList: string[], timer: number,emptyField = false, neededTiles: number = this.parent.tilemap.width*this.parent.tilemap.height): void{
        this.requirements = {food: foodList, tiles: neededTiles, time: timer};
        this.capacity = foodList.length;
        this.emptyField = emptyField;
        this.maxTime = Math.ceil(2*timer+((timer+300)/(timer+Math.sqrt(600)))*Math.log(timer));
        ((this.parent as Phaser.Tilemaps.Tile).tilemap.scene as MainScene).maxLevelCompletionTime = this.maxTime;
    }
}


