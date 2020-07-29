import EventEmitter from './EventEmitter';
import EventsLibrary from './EventsLibrary';
import DataStorage from '../Models/DataStorage';
import AppSape from '../Views/Pixi/Shapes/AppShape';
import getRandomShape from '../Models/ShapeTypes';

export default class Controller {
  dataStorage: DataStorage = new DataStorage();
  secondTimerId: number;
  constructor() {
    this.initEvents();
    this.secondTimerId = setInterval(this.onEverySecond, 1000);
  }

  destroy = () => {
    clearInterval(this.secondTimerId);
    EventEmitter.removeEventListener(EventsLibrary.PIXI_STAGE_CLIKED, this.onStageClicked);
    EventEmitter.removeEventListener(EventsLibrary.PIXI_SHAPE_CLIKED, this.onShapeClicked);
    EventEmitter.removeEventListener(EventsLibrary.PIXI_TICK, this.onEnterFrame);
    EventEmitter.removeEventListener(EventsLibrary.MAIN_INITED, this.updateHeaders);
    EventEmitter.removeEventListener(EventsLibrary.GRAVITY_DEC, this.onGravityDec);
    EventEmitter.removeEventListener(EventsLibrary.GRAVITY_INC, this.onGravityInc);
    EventEmitter.removeEventListener(EventsLibrary.SHAPE_PER_SEC_DEC, this.onShapeDec);
    EventEmitter.removeEventListener(EventsLibrary.SHAPE_PER_SEC_INC, this.onShapeInc);
  }
  private initEvents = () => {
    EventEmitter.addEventListener(EventsLibrary.PIXI_STAGE_CLIKED, this.onStageClicked);
    EventEmitter.addEventListener(EventsLibrary.PIXI_SHAPE_CLIKED, this.onShapeClicked);
    EventEmitter.addEventListener(EventsLibrary.PIXI_TICK, this.onEnterFrame);
    EventEmitter.addEventListener(EventsLibrary.MAIN_INITED, this.updateHeaders);
    EventEmitter.addEventListener(EventsLibrary.GRAVITY_DEC, this.onGravityDec);
    EventEmitter.addEventListener(EventsLibrary.GRAVITY_INC, this.onGravityInc);
    EventEmitter.addEventListener(EventsLibrary.SHAPE_PER_SEC_DEC, this.onShapeDec);
    EventEmitter.addEventListener(EventsLibrary.SHAPE_PER_SEC_INC, this.onShapeInc);
  }
  private updateHeaders = () => {
    EventEmitter.dispatch(EventsLibrary.UPDATE_HEADERS, this.dataStorage);
    EventEmitter.dispatch(EventsLibrary.UPDATE_COUNTERS, this.dataStorage);
  }
  private onGravityDec = () => {
    this.dataStorage.gravityValue--;
    this.normalizateValuesAndDraw();
  }
  private onGravityInc = () => {
    this.dataStorage.gravityValue++;
    this.normalizateValuesAndDraw();
  }

  private onShapeDec = () => {
    this.dataStorage.perSecondShapes--;
    this.normalizateValuesAndDraw();
  }
  private onShapeInc = () => {
    this.dataStorage.perSecondShapes++;
    this.normalizateValuesAndDraw();
  }

  private normalizateValuesAndDraw = () => {
    const minValues = 1;
    const maxValues = 25;
    const dataStorage = this.dataStorage;
    if (dataStorage.gravityValue < minValues) {
      dataStorage.gravityValue = minValues;
    }
    if (dataStorage.gravityValue > maxValues) {
      dataStorage.gravityValue = maxValues;
    }

    if (dataStorage.perSecondShapes < minValues) {
      dataStorage.perSecondShapes = minValues;
    }
    if (dataStorage.perSecondShapes > maxValues) {
      dataStorage.perSecondShapes = maxValues;
    }

    EventEmitter.dispatch(EventsLibrary.UPDATE_COUNTERS, this.dataStorage);
  }


  private onEnterFrame = () => {
    const SHAPE_MASS_PER_PIXEL = .00005;
    let letClearOcupAreaSize: number = 0;
    for (let i = 0; i < this.dataStorage.liveShapes.length; i++) {
      const el = this.dataStorage.liveShapes[i];
      el.kinetic += el.area * SHAPE_MASS_PER_PIXEL * this.dataStorage.gravityValue;
      el.shape.y += el.kinetic / 100;
      // console.log('>',el.area);

      if (el.shape.y > this.dataStorage.pixiScreenHeight + el.shape.getBounds().height) {
        this.dataStorage.liveShapes.splice(i, 1);
        letClearOcupAreaSize += el.area;
        el.shape.destroy();
        continue;
      }
    }

    if (letClearOcupAreaSize > 0) {
      this.dataStorage.numOfShapes = this.dataStorage.liveShapes.length;
      this.dataStorage.occupatedArea -= letClearOcupAreaSize;
      EventEmitter.dispatch(EventsLibrary.UPDATE_HEADERS, this.dataStorage);
    }
  }
  private onEverySecond = () => {
    this.createRandomShapes(this.dataStorage.perSecondShapes);
  }


  private onStageClicked = (e: PIXI.interaction.InteractionEvent) => {
    const creationPoint: PIXI.Point = new PIXI.Point(e.data.global.x, e.data.global.y);
    this.createRandomShapes(1, creationPoint);
  }

  private onShapeClicked = (el: AppSape) => {
    el.y += this.dataStorage.pixiScreenHeight + el.getBounds().height;
  }

  private createRandomShapes = (num: number, setToPoint: PIXI.Point = undefined) => {
    for (var i = 0; i < num; i++) {
      const MAX_SCALE = 1;
      const { typeId, pixiShapeData } = getRandomShape();
      const newShape: AppSape = new AppSape(typeId, pixiShapeData, undefined, 1 + Math.random() * MAX_SCALE);
      if (!setToPoint) {
        newShape.rotation = Math.random() * 360;
      }
      let baseAreay: { typeId: string, area: number } = this.dataStorage.shapesAreaCash.find(el => el.typeId === typeId);
      if (!baseAreay) {
        baseAreay = { typeId, area: this.countBaseArea(newShape) };
        this.dataStorage.shapesAreaCash.push(baseAreay);
      }
      const reallArea: number = baseAreay.area * (newShape._scale ** newShape._scale);
      this.dataStorage.liveShapes.push({ shape: newShape, kinetic: 0, area: reallArea });

      if (!setToPoint) {
        EventEmitter.dispatch(EventsLibrary.PIXI_ADD_SHAPE, newShape);
      } else {
        EventEmitter.dispatch(EventsLibrary.PIXI_ADD_SHAPE_TO_POINT, { newShape, setPosition: setToPoint });
      }


      this.dataStorage.occupatedArea += reallArea;
    }
    this.dataStorage.numOfShapes = this.dataStorage.liveShapes.length;
    EventEmitter.dispatch(EventsLibrary.UPDATE_HEADERS, this.dataStorage);
  }


  private countBaseArea(shape: AppSape) {
    let baseArea: number = 0;
    const pixiShapeData: PIXI.Circle | PIXI.Ellipse | PIXI.Rectangle | PIXI.Polygon | Array<PIXI.HitArea> = shape._shapeHitArey;
    if (pixiShapeData instanceof Array) {

      let testPassed: number = 0;
      for (let col = shape.getLocalBounds().x; col < shape.getLocalBounds().width + shape.getLocalBounds().x; col++) {
        for (let row = shape.getLocalBounds().y; row < shape.getLocalBounds().height + shape.getLocalBounds().y; row++) {
          const testPoint: PIXI.Point = new PIXI.Point(col, row);
          for (let i = 0; i < pixiShapeData.length; i++) {
            const pixiShapesType: PIXI.HitArea = pixiShapeData[i];
            if (pixiShapesType.contains(testPoint.x, testPoint.y)) {
              testPassed++;
              break;
            }
          }
        }
      }
      //   console.log(testPassed);
      baseArea = testPassed;
    } else {
      switch (pixiShapeData.type) {
        case 0://Polygon          
          baseArea = this.calcPolygonArea((pixiShapeData as PIXI.Polygon).points);
          break;
        case 1://Rectangle    
          const nR: PIXI.Rectangle = pixiShapeData as PIXI.Rectangle;
          baseArea = nR.width * nR.height;
          break;
        case 2://Circle          
          const nC: PIXI.Circle = pixiShapeData as PIXI.Circle;
          baseArea = Math.PI * nC.radius * nC.radius;
          break;
        case 3://Ellipse      
          const nE: PIXI.Ellipse = pixiShapeData as PIXI.Ellipse;
          baseArea = Math.PI * nE.height * nE.width;
          break;
        default:
          throw new Error(`Cant find <${pixiShapeData.type}> type in PIXI.HitArea interfaced objects.`);
      }
    }
    return baseArea;
  }


  private calcPolygonArea = (_vertices: Array<number>) => {
    const vertices: Array<PIXI.Point> = [];
    while (_vertices.length) {
      const x: number = _vertices.pop();
      const y: number = _vertices.pop();
      vertices.push(new PIXI.Point(x, y));
    }


    let total: number = 0;

    for (let i = 0, l = vertices.length; i < l; i += 1) {
      const addX: number = vertices[i].x;
      const addY: number = vertices[i == vertices.length - 1 ? 0 : i + 1].y;
      const subX: number = vertices[i == vertices.length - 1 ? 0 : i + 1].x;
      const subY: number = vertices[i].y;
      total += (addX * addY * 0.5);
      total -= (subX * subY * 0.5);
    }

    return Math.abs(total);
  }




}