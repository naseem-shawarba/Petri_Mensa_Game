
export class Zutat extends Phaser.GameObjects.Sprite {
    private tile: Phaser.Tilemaps.Tile; //current tile
    private distancePerSec: number; //movement speed
    public tilePosition;
    public readonly normalSize: number;
    public cooking: boolean;

    //centers on tile, sets data and size
    constructor(scene: Phaser.Scene, texture: string, starttile: Phaser.Tilemaps.Tile, distancePerSec = 100) {
        super(scene, starttile.properties.getPosition(null).x, starttile.properties.getPosition(null).y, texture);
        this.tile = starttile;
        this.distancePerSec = distancePerSec;
        this.cooking = false;
        this.tilePosition = this.tile.properties.getPosition(null);

        this.setSize(this.tile.baseWidth, this.tile.baseHeight);
        this.setDisplaySize(this.tile.baseWidth, this.tile.baseHeight);
        this.scene.add.existing(this);
        this.normalSize = this.scale;
    }

    public changeScale(delta: number):void{
        let destScale: number;
        if(this.tile.properties?.rules!=undefined)destScale = 0.8*this.normalSize/this.tile.properties.capacity;
        else destScale = this.normalSize/(Math.ceil(Math.sqrt(this.tile.properties.capacity))); 
        if(this.scale > (destScale))this.setScale(Math.max((this.scale*(destScale)**(delta/1000)),(destScale)));
        if(this.scale < (destScale))this.setScale(Math.min((this.scale*(destScale)**(-delta/1000)),(destScale)));
    }                                                       

    //movement to dest-tile
    private move(delta: number): void {

        const distance = this.distancePerSec * delta / 1000; //get the 1000 from tick size
        const diffx = Math.max(Math.min(this.tilePosition.x - this.x, distance), -distance);
        const diffy = Math.max(Math.min(this.tilePosition.y - this.y, distance), -distance);
        if (diffx != 0) this.x += diffx;
        if (diffy != 0) this.y += diffy;
    }

    public tickUpdate(delta: number) {
        this.changeScale(delta);
        this.move(delta);
    }

    public stepUpdate(currentStep: number) {
        this.tilePosition = this.tile.properties.getPosition(this);

        const newTile = this.tile.properties.moveFood(this);
        if (!newTile) return; //move is blocked by current tile
        
        const addedFood = newTile.properties.addFood?.(this);
        if( !addedFood || (addedFood == -1)) return; //move blocked by next tile
        
        this.tile.properties.popFood(this);
        this.tile = newTile;
        this.tilePosition = this.tile.properties.getPosition(this);
        newTile.properties.stepUpdate?.(currentStep);
    }
}
