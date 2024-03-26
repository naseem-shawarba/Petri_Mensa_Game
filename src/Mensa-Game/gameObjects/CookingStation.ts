import { Zutat } from "./Zutat";
import { newArrowTile } from "./ArrowTiles";

export function newCookingStation(
    layer: Phaser.Tilemaps.LayerData,
    index: number,
    x: number,
    y: number,
    width?: number,
    height?: number,
    baseHeight?: number,
    properties?: any) {
    const result = newArrowTile(layer, index, x, y,"right", width, height, baseHeight, properties);
    result.properties.lock = true;
    result.properties.capacity = 0;
    result.properties.workingTimer = -1;
    result.properties.workingRule = -1;
    result.properties.rules = [];
    result.properties.activeRules = [];
    result.properties.cookingStep = -1;

    addGetPosition(result);
    addAddRule(result);
    addGetBestRule(result);
    addCheckStringLists(result);
    addCooking(result);
    addAddFood(result);
    addCreateFoodOfRule(result);
    addTickCooking(result);
    addInteract(result);
    return result;
}

/**
 * @Overwrite 
 * Simple function to add food to a tile.
 * Do not add food if it is working.
 * 
 * @param food - the food Object we want to put on the tile.
 * @returns -1 if foodarray reach the capacity or cookingStation is working or food doesnt come from input-tile (left-tile), new length otherwise
 */
function addAddFood(tile: Phaser.Tilemaps.Tile) {
    tile.properties.addFood = function (food: Zutat): number {
        if(food.cooking==true) return this.foodArray.push(food);
        return -1; 
    }
}


/**
 * check if first list is subseteq of second list 
 * 
 * @param -two String lists
 * @returns true if subseteq, else false
 */
function addCheckStringLists(tile: Phaser.Tilemaps.Tile){
    tile.properties.checkStringLists= function(list1: string[], list2: string[]): boolean{
        return list1.every(val => list2.includes(val) && list1.filter(el => el === val).length <= list2.filter(el => el === val).length);
    }
}

/**
 * check if two String-lists are matching
 * 
 * @param -two String lists
 * @returns index of first rule where the leftside and the list of not leaving food is even
 */
function addGetBestRule(tile: Phaser.Tilemaps.Tile){
    tile.properties.getBestRule = function(){
        const inputArray = this.parent.tilemap.getTileAt(this.parent.x-1,this.parent.y).properties.foodArray;

        const tmp: string[] =[];
        inputArray.forEach(a => tmp.push(a.texture.key));

        for(let i=0;i<this.rules.length;i++)if(this.checkStringLists(this.rules[i].input,tmp)){
            if(this.workingRule == -1 || this.rules[this.workingRule].input.length<this.rules[i].input.length)this.workingRule=i;
        }

        if(this.workingRule != -1)this.rules[this.workingRule].input.forEach(a => {
            inputArray.filter(e => e.texture.key==a && !e.cooking)[0].cooking=true;
        })
    }
}

/**
 * creates rightside of workingrule, spawn it on Cookingstation and add it to foodArray and scene.allFood
 */
function addCreateFoodOfRule(tile: Phaser.Tilemaps.Tile){
    tile.properties.createFoodOfRule = function(): void{
        for(let i =0;i<this.rules[this.workingRule].output.length;i++){
            const newFood = new Zutat(this.parent.tilemap.scene,this.rules[this.workingRule].output[i],this.parent);
            newFood.cooking = true;
            newFood.changeScale(1000);
            this.foodArray.push(newFood)
            this.parent.tilemap.scene.allFood?.push(newFood);            
        
        }
    }
}

/**
 * cooking process called by food instead of stepupdate so every step. Deletes
 * all not produces food and creates the result if we are finish now. Does 
 * nothing if we are working or dont have a matching rule.
 * 
 * find new Rule if we are not working   
 * 
 * @param -currentstep to check cookingtimer and food just to set it invisible
 */
function addCooking(tile: Phaser.Tilemaps.Tile){
    tile.properties.cooking = function (currentStep: number){

        //search a new Rule if we are ready or not working
        if(this.workingRule == -1){
            this.getBestRule();
            if(this.workingRule!=-1){
                this.workingTimer = this.rules[this.workingRule].timer + 1;
                this.cookingStep = 0;
            }
        }
    }
}
/**
 * handle our food moving over the cookingstation
 * 
 * @param delta time since last tick
 * @param timeStep last step-time
 * 
 * 
 */
function addTickCooking(tile: Phaser.Tilemaps.Tile){
    tile.properties.tickCooking = function (delta: number, timeStep: number){
        this.workingTimer-= delta/1000;
        switch(this.cookingStep){
            case 0:
                //food is on the way to the left Side of this cookingstation
                if(this.workingTimer <= this.rules[this.workingRule].timer+ 1/2){
                    this.cookingStep = 1;
                    this.foodArray.forEach(a => {
                        a.distancePerSec = this.parent.tilemap.tileWidth/this.rules[this.workingRule].timer;
                        a.tilePosition = this.getPosition(a);
                    });
                }
                break;
            case 1:
                //food is on the way to the center of this cookingstation
                if(this.workingTimer <= (this.rules[this.workingRule].timer+1)/2){
                    this.removeAllFood();
                    this.createFoodOfRule();
                    this.cookingStep = 2;
                    this.foodArray.forEach(a => {
                        a.tilePosition = this.getPosition(a);
                        a.distancePerSec = this.parent.tilemap.tileWidth/this.rules[this.workingRule].timer;
                    });
                }
                break;
            case 2:
                //food is on the way to the right Side of this cookingstation
                if(this.workingTimer <= 1/2){
                    this.foodArray.forEach(a => {
                        a.cooking = false;
                        a.distancePerSec = 100;
                        a.stepUpdate(timeStep);
                    });
                    if(this.foodArray.length == 0)this.cookingStep = 3;
                    else this.workingTimer += delta/1000; //if OutputTile is blocking we pause    
                }
                break;
            case 3:
                //food is placing in output-tile
                if(this.workingTimer <= 0){
                    this.cookingStep = -1;
                    this.workingRule = -1;
                } 
        }
    }
}
/**
 * add Rule
 * 
 * @param -leftSide: the food we need, rightSide: the food we produce, time in Steps
 */
function addAddRule(tile: Phaser.Tilemaps.Tile) {
    tile.properties.addRule = function (leftSide: string[], rightSide: string[], time: number): void {
        this.rules.push({input: leftSide, output: rightSide, timer: time});
        this.capacity++;
        return;
    }
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
        const top = this.parent.getTop();
        const left = this.parent.getLeft();
        const right = this.parent.getRight();
        const height = this.parent.getBottom() - top;
        switch(this.cookingStep){
            case 0:
                return {x: left, y: top + (height/(2*this.capacity))*(2*this.workingRule+1)};
            case 1:
                return {x: this.parent.getCenterX(),y: top + ((height)/(2*this.capacity))*(2*this.workingRule+1)};
            case 2:
                return {x: right, y: top + ((height)/(2*this.capacity))*(2*this.workingRule+1)};
            default:
                return {x: this.parent.getCenterX(), y: this.parent.getCenterY()};
        }
    }
}


function addInteract(tile: Phaser.Tilemaps.Tile) {
    tile.properties.interact = function (): void {
        const c = this.parent.tilemap.scene.cameras.add( window.innerWidth / 2 - 450, 70, 900, 300);
        this.parent.tilemap.scene.openedElement = c;
        c.zoom = 4.6;
        c.centerOn(this.parent.getCenterX(), this.parent.getCenterY());
        return;
    }
}
