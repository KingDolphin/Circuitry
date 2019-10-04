import {V} from "Vector";
import {ClampedValue} from "math/ClampedValue";

import {Component} from "../Component";
import {XMLNode}      from "core/utils/io/xml/XMLNode";


export class Clock extends Component {
    private frequency: number;
    private isOn: boolean;

    public constructor() {
        super(new ClampedValue(0), new ClampedValue(1), V(60, 42));
        this.frequency = 1000;
        this.isOn = false;
        this.tick();
    }

    // Changing the clock
    public tick(): void {
        this.activate(!this.isOn);
        setTimeout(() => this.tick(), this.frequency);
    }

    public setFrequency(freq: number): void {
        this.frequency = freq;
    }

    // Activate changes state and image
    public activate(bool: boolean): void {
        super.activate(bool);
        this.isOn = bool;
        if (this.designer != undefined)
            this.designer.forceUpdate();
    }

    public getFrequency(): number {
        return this.frequency;
    }

    public getDisplayName(): string {
        return "Clock";
    }

    public getXMLName(): string {
        return "clock";
    }

    public getImageName(): string {
        return (this.isOn ? "clockOn.svg" : "clock.svg");
    }

    public save(node: XMLNode): void {
        super.save(node);
        node.addAttribute("frequency",this.frequency);
    }

    public load(node: XMLNode): void {
        super.load(node);
        this.frequency=node.getIntAttribute("frequency");
    }
}
