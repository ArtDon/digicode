import { Container } from 'pixi.js';
export default class ContainersLibrary {
  constructor(
    _root: string = 'root',
    _container: string = 'container',
    _countShapes: string = 'countShapes',
    _shapesArea: string = 'shapesArea',
    _countShapeDec: string = 'countShapeDec',
    _countShapeInc: string = 'countShapeInc',
    _countShapeValue: string = 'countShapeValue',
    _countGravityDec: string = 'countGravityDec',
    _countGravityInc: string = 'countGravityInc',
    _countGravityValue: string = 'countGravityValue',
  ) {
    this.root = document.getElementById(_root);
    this.container = document.getElementById(_container);
    this.countShapes = document.getElementById(_countShapes);
    this.shapesArea = document.getElementById(_shapesArea);
    this.countShapeDec = document.getElementById(_countShapeDec);
    this.countShapeInc = document.getElementById(_countShapeInc);
    this.countShapeValue = document.getElementById(_countShapeValue);
    this.countGravityDec = document.getElementById(_countGravityDec);
    this.countGravityInc = document.getElementById(_countGravityInc);
    this.countGravityValue = document.getElementById(_countGravityValue);
  }
  root: HTMLElement;
  container: HTMLElement;
  countShapes: HTMLElement;
  shapesArea: HTMLElement;
  countShapeDec: HTMLElement;
  countShapeInc: HTMLElement;
  countShapeValue: HTMLElement;
  countGravityDec: HTMLElement;
  countGravityInc: HTMLElement;
  countGravityValue: HTMLElement;

  pixiStage: Container;
}
