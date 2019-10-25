import {DEFAULT_SIZE} from "core/utils/Constants";

import {V} from "Vector";
import {ClampedValue} from "math/ClampedValue";
import {XMLNode}      from "core/utils/io/xml/XMLNode";

import {DigitalComponent} from "digital/models/DigitalComponent";

export class LED extends DigitalComponent {
    private color: string;

    public constructor() {
        super(new ClampedValue(1),
              new ClampedValue(0),
              V(50, 50));
        this.color = "#ffffff";

        // Make port face down instead of sideways
        this.inputs.first.setTargetPos(V(0, 2*DEFAULT_SIZE));
    }

    public setColor(color: string): void {
        this.color = color;
    }

    public isOn(): boolean {
        return this.inputs.first.getIsOn();
    }

    public getColor(): string {
        return this.color;
    }

    public getDisplayName(): string {
        return "LED";
    }

    public getImageName(): string {
        return "led.svg";
    }

    public getOnImageName(): string {
        return "ledLight.svg"
    }

    public getXMLName(): string {
        return "led";
    }

    public copy(): LED {
        const copy = <LED>super.copy();
        copy.color = this.color;
        return copy;
    }

    public save(node: XMLNode): void {
        super.save(node);
        node.addAttribute("color", this.getColor());
    }

    public load(node: XMLNode): void {
        super.load(node);
        this.setColor(node.getAttribute("color"));
    }

}
