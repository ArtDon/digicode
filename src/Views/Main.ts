import DOMRefs from './HtmlContainersLibrary';
import DataStorage from '../Models/DataStorage';
import EventEmitter from '../Controllers/EventEmitter';
import EventsLibrary from '../Controllers/EventsLibrary';
import Controller from '../Controllers/Controller';
import AppSape from './Pixi/Shapes/AppShape';
import PixiScreen from './Pixi/PixiScreen';

export default class Main {
    DOMRefs: DOMRefs;
    controller: Controller;
    constructor() {
        this.controller = new Controller();
        this.DOMRefs = new DOMRefs();

    }

    public init = () => {
        this.addHeandlers();
        this.startPixi();
        EventEmitter.dispatch(EventsLibrary.MAIN_INITED);
    }

    private onControls = (e: any) => {
        const tar = e.target as HTMLElement;
        switch (tar) {
            case this.DOMRefs.countShapeInc:
                EventEmitter.dispatch(EventsLibrary.SHAPE_PER_SEC_INC);
                break;
            case this.DOMRefs.countShapeDec:
                EventEmitter.dispatch(EventsLibrary.SHAPE_PER_SEC_DEC);
                break;
            case this.DOMRefs.countGravityInc:
                EventEmitter.dispatch(EventsLibrary.GRAVITY_INC);
                break;
            case this.DOMRefs.countGravityDec:
                EventEmitter.dispatch(EventsLibrary.GRAVITY_DEC);
                break;
            default:
                throw new Error('Somsing strange ) don`t think we can have this error anytime.');

        }
    }
    private addHeandlers = () => {
        this.DOMRefs.countShapeInc.addEventListener('click', this.onControls);
        this.DOMRefs.countShapeDec.addEventListener('click', this.onControls);
        this.DOMRefs.countGravityInc.addEventListener('click', this.onControls);
        this.DOMRefs.countGravityDec.addEventListener('click', this.onControls);
        EventEmitter.addEventListener(EventsLibrary.UPDATE_COUNTERS, this.onUpdateCounters);
        EventEmitter.addEventListener(EventsLibrary.UPDATE_HEADERS, this.onUpdateHeaders);
        EventEmitter.addEventListener(EventsLibrary.PIXI_ADD_SHAPE, this.onAddShapeRandomly);
        EventEmitter.addEventListener(EventsLibrary.PIXI_ADD_SHAPE_TO_POINT, this.onAddShape);
    }
    private removeHeandlers = () => {
        this.DOMRefs.countShapeInc.removeEventListener('click', this.onControls);
        this.DOMRefs.countShapeDec.removeEventListener('click', this.onControls);
        this.DOMRefs.countGravityInc.removeEventListener('click', this.onControls);
        this.DOMRefs.countGravityDec.removeEventListener('click', this.onControls);
        EventEmitter.removeEventListener(EventsLibrary.UPDATE_COUNTERS, this.onUpdateCounters);
        EventEmitter.removeEventListener(EventsLibrary.UPDATE_HEADERS, this.onUpdateHeaders);
        EventEmitter.removeEventListener(EventsLibrary.PIXI_ADD_SHAPE, this.onAddShapeRandomly);
        EventEmitter.removeEventListener(EventsLibrary.PIXI_ADD_SHAPE_TO_POINT, this.onAddShape);
    }
    private onUpdateCounters = (data: DataStorage) => {
        this.DOMRefs.countShapeValue.textContent = `${data.perSecondShapes}`;
        this.DOMRefs.countGravityValue.textContent = `${data.gravityValue}`;
    }
    private onUpdateHeaders = (data: DataStorage) => {
        this.DOMRefs.countShapes.textContent = `${data.numOfShapes}`;
        this.DOMRefs.shapesArea.textContent = `${Math.round(data.occupatedArea)}`;
    }

    public destroy = () => {
        this.removeHeandlers();
    }



    private startPixi = () => {
        const cont = this.DOMRefs.container;
        const pixiScreen: PixiScreen = new PixiScreen(cont.clientWidth, cont.clientHeight);
        this.DOMRefs.container.appendChild(pixiScreen.view);
        this.DOMRefs.pixiStage = pixiScreen.stage;
    }

    private onAddShapeRandomly = (newShape: AppSape) => {
        newShape.y = -newShape.getBounds().height;
        newShape.x = Math.random() * ((this.DOMRefs.container.clientWidth - newShape.getBounds().width));
        this.DOMRefs.pixiStage.addChild(newShape);
    }


    private onAddShape = (data: { newShape: AppSape, setPosition: PIXI.Point }) => {
        data.newShape.y = data.setPosition.y;
        data.newShape.x = data.setPosition.x;
        this.DOMRefs.pixiStage.addChild(data.newShape);
    }


}



