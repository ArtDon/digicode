import { Graphics } from "pixi.js";

export default class DataStorage {
  perSecondShapes: number = 1;
  gravityValue: number = 1;
  numOfShapes: number = 0;
  occupatedArea: number = 0;
  liveShapes: Array<{ shape: Graphics, kinetic: number, area: number }> = [];
  shapesAreaCash: Array<{ typeId: string, area: number }> = [];
  pixiScreenHeight: number = 500;
}