import { Application, Graphics } from "pixi.js";
import EventsLibrary from '../../Controllers/EventsLibrary';
import EventEmitter from '../../Controllers/EventEmitter';
export default class PixiScreen extends Application {
  bg: Graphics;
  constructor(_width: number, _height: number) {
    super({ antialias: true, width: _width, height: _height, backgroundColor: 0xFFFFFF });
    this.ticker.add(this.sendTick);
    this.bg = new Graphics();
    this.bg.beginFill(0xFF0000, 0);
    this.bg.drawRect(0, 0, _width, _height);
    this.bg.endFill();
    this.stage.addChild(this.bg);
    this.bg.interactive = true;
    this.bg.on('pointerdown', this.onStageCliked);

  }
  onStageCliked = (e: PIXI.interaction.InteractionEvent) => {

    EventEmitter.dispatch(EventsLibrary.PIXI_STAGE_CLIKED, e);
  }


  sendTick = () => {
    EventEmitter.dispatch(EventsLibrary.PIXI_TICK);
  }
  pre_destroy = () => {
    this.ticker.remove(this.sendTick);
  }


}

