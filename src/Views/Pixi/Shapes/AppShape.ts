import * as PIXI from "pixi.js";
//We need. 3 sides, 4 sides, 5 sides, 6 sides, circle, ellipse, random (example Shape 3 some like mix of Elippses and Polygons)
//I will make one view, becouse anyway PIXI can draw fixed shape types, and this view will draw all of possible kinds 
// 3,4,5,6 sides - will be polygon`s circle and Elippse, all other anyway will be array of mix PIXI.HitArea interfaced class.
import EventEmitter from '../../../Controllers/EventEmitter';
import EventsLibrary from '../../../Controllers/EventsLibrary';


export default class AppSape extends PIXI.Graphics {
  _color: number;
  _scale: number;
  _typeId: string;

  _shapeHitArey: PIXI.Circle | PIXI.Ellipse | PIXI.Rectangle | PIXI.Polygon | Array<PIXI.HitArea>;
  // This is from PIXI Documentation...
  //Polygon 0
  //Rectangle 1
  //Circle 2
  //Ellipse 3
  //Array will be special I like use some kind as EPS for this special Shape. but it is not a lot of time.... i will add simple functional
  constructor(typeId: string, shapeHitArey: PIXI.Circle | PIXI.Ellipse | PIXI.Rectangle | PIXI.Polygon | Array<PIXI.HitArea>, color: number = undefined, scale: number = 1) {
    super();
    this._typeId = typeId;
    this._shapeHitArey = shapeHitArey;
    this._color = color || Math.floor(Math.random() * 16777215);
    this._scale = scale;

    this.paintShape(true);

  }

  changeColor = (newColor: number) => {
    if (this._color != newColor) {
      this.clear();
      this._color = newColor;
      this.paintShape();
    }
  }

  private paintShape = (init: boolean = false) => {
    if (this._shapeHitArey instanceof Array) {//special type array of PIXI.HitArea interfaced objects
      for (let i = 0; i < this._shapeHitArey.length; i++) {
        this.drawGraphic(this._shapeHitArey[i], init && i === this._shapeHitArey.length - 1);
      };
    } else {
      this.drawGraphic(this._shapeHitArey, init);
    }
  }


  private drawGraphic = (shapeHitArey: any, endOfDrawing: boolean) => {
    this.beginFill(this._color, 1);
    switch (shapeHitArey.type) {
      case 0://Polygon          
        this.drawPolygon(shapeHitArey as PIXI.Polygon);
        break;
      case 1://Rectangle    
        const nR: PIXI.Rectangle = shapeHitArey as PIXI.Rectangle;
        this.drawRect(nR.x, nR.y, nR.width, nR.height);
        break;
      case 2://Circle          
        const nC: PIXI.Circle = shapeHitArey as PIXI.Circle;
        this.drawCircle(nC.x, nC.y, nC.radius);
        break;
      case 3://Ellipse      
        const nE: PIXI.Ellipse = shapeHitArey as PIXI.Ellipse;
        this.drawEllipse(nE.x, nE.y, nE.width, nE.height);
        break;
      default:
        throw new Error(`Cant find <${shapeHitArey.type}> type in PIXI.HitArea interfaced objects.`);
    }
    this.endFill();
    if (endOfDrawing) {
      this.scale = new PIXI.Point(this._scale, this._scale);
      this.pivot = new PIXI.Point(this.getBounds().x / this._scale, this.getBounds().y / this._scale);
      this.buttonMode = this.interactive = true;
      this.on('pointerdown', this.onClick);
    }
  }
  private onClick = () => {
    EventEmitter.dispatch(EventsLibrary.PIXI_SHAPE_CLIKED, this);
    // console.log('CLICKED');
  }

}

