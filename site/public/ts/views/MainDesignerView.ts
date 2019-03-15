import {Camera}            from "../utils/Camera";
import {Renderer}          from "../utils/rendering/Renderer";
import {Grid}              from "../utils/rendering/Grid";
import {ToolRenderer}      from "../utils/rendering/ToolRenderer";
import {WireRenderer}      from "../utils/rendering/ioobjects/WireRenderer";
import {ComponentRenderer} from "../utils/rendering/ioobjects/ComponentRenderer";

import {ToolManager} from "../utils/tools/ToolManager";

import {CircuitDesigner} from "../models/CircuitDesigner";

import {IOObject}  from "../models/ioobjects/IOObject";

export class MainDesignerView {
    private canvas: HTMLCanvasElement;
    private renderer: Renderer;
    private camera: Camera;

    public constructor() {
        const canvas = document.getElementById("canvas");
        if (!(canvas instanceof HTMLCanvasElement))
            throw new Error("Canvas element not found!");
        this.canvas = canvas;
        this.renderer = new Renderer(this.canvas);
        this.camera = new Camera(this.canvas.width, this.canvas.height);

        this.resize();
    }

    public render(designer: CircuitDesigner, selections: Array<IOObject>, toolManager: ToolManager) {
        this.renderer.clear();

        // Render grid
        Grid.render(this.renderer, this.camera);

        // Render all wires (first so they are underneath objects)
        const wires = designer.getWires();
        for (let wire of wires) {
            const selected = selections.includes(wire);
            WireRenderer.render(this.renderer, this.camera, wire, selected);
        }

        // Render all objects
        const objects = designer.getObjects();
        for (let object of objects) {
            const selected = selections.includes(object);
            ComponentRenderer.render(this.renderer, this.camera, object, selected);
        }

        // Render current tool
        ToolRenderer.render(this.renderer, this.camera, toolManager);
    }

    public resize(): void {
        this.renderer.resize();
        this.camera.resize(this.canvas.width, this.canvas.height);
    }

    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }
    public getCamera(): Camera {
        return this.camera;
    }
}
