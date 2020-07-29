import * as PIXI from 'pixi.js';
class ShapeData {
  pixiShapeData: PIXI.Circle | PIXI.Ellipse | PIXI.Rectangle | PIXI.Polygon | Array<PIXI.HitArea>;
  kinetic: number;
  baseArea: number;
  typeId: string;

  constructor(_typeId: string, _pixiShapeData: PIXI.Circle | PIXI.Ellipse | PIXI.Rectangle | PIXI.Polygon | Array<PIXI.HitArea>) {
    this.typeId = _typeId;
    this.pixiShapeData = _pixiShapeData;
    this.kinetic = 0;
    this.baseArea = 0;
  }

}
//We need. 3 sides, 4 sides, 5 sides, 6 sides, circle, ellipse, random (example Shape 3 some like mix of Elippses and Polygons)
function getRandomShape() {
  const allShapes: Array<ShapeData> = [
    new ShapeData('3side_1', new PIXI.Polygon([0, 0, 100, 100, 0, 200, 0, 0])),
    new ShapeData('4side_1', new PIXI.Polygon([0, 0, 100, 0, 150, 100, 50, 100, 0, 0])),
    new ShapeData('4side_2', new PIXI.Rectangle(0, 0, 300, 100)),
    new ShapeData('5side_1', new PIXI.Polygon([0, 0, 100, 0, 150, 100, 100, 150, 50, 100, 0, 0])),
    new ShapeData('6side_1', new PIXI.Polygon([0, 0, 100, 0, 50, 50, 150, 100, 100, 150, 50, 100, 0, 0])),
    new ShapeData('8side_1', new PIXI.Polygon(0, 0, 50, 25, 100, 0, 75, 50, 100, 100, 50, 75, 0, 100, 25, 50, 0, 0)),
    new ShapeData('Cside_1', new PIXI.Circle(0, 0, 30)),
    new ShapeData('Eside_1', new PIXI.Ellipse(0, 0, 30, 15)),
    new ShapeData('Custom_1', [new PIXI.Circle(0, 0, 10), new PIXI.Polygon(0, 0, 50, 25, 100, 0, 75, 50, 100, 100, 50, 75, 0, 100, 25, 50, 0, 0), new PIXI.Ellipse(50, 50, 60, 10)]),
    new ShapeData('Custom_2', [new PIXI.Ellipse(0, 0, 50, 10), new PIXI.Ellipse(0, 0, 5, 60), new PIXI.Ellipse(10, 10, 10, 15)]),
  ];
  return allShapes[Math.floor(Math.random() * allShapes.length)];
}


export default getRandomShape;




