import {Vector} from "Vector";
import {ClampedValue} from "math/ClampedValue";
import {Name} from "core/utils/Name";
import {XMLNode} from "core/utils/io/xml/XMLNode";

import {Positioner} from "core/models/ports/positioners/Positioner"

import {DigitalComponent} from "digital/models/DigitalComponent";
import {InputPort} from "digital/models/ports/InputPort";

//
// Gate is an abstract superclass for simple logical gates.
// Gate should always be a component with exactly 1 output port
//
export abstract class Gate extends DigitalComponent {
    protected not: boolean = false;

    public constructor(not: boolean, inputPortCount: ClampedValue, size: Vector, inputPositioner?: Positioner<InputPort>) {
        super(inputPortCount, new ClampedValue(1), size, inputPositioner);
        this.setNot(not);
    }

    // @Override
    public activate(on: boolean, i: number = 0): void {
        super.activate((this.not ? !on : on), i);
    }

    private setNot(not: boolean): void {
        // if flipped then flip output
        if (not != this.not)
            this.outputs.first.activate(!this.outputs.first.getIsOn());
        this.not = not;

        // change name to be the not'd name if name wasn't manually set by user
        if (!this.name.isSet())
            this.name = new Name(this.getDisplayName());
    }

    public isNot(): boolean {
        return this.not;
    }

    public copy(): Gate {
        const copy = <Gate>super.copy();
        copy.not = this.not;
        return copy;
    }

    public save(node: XMLNode): void {
        super.save(node);

        node.addAttribute("inputs", this.numInputs());
        node.addAttribute("not", this.not);
    }

    public load(node: XMLNode): void {
        super.load(node);

        this.setInputPortCount(node.getIntAttribute("inputs"));
        this.setNot(node.getBooleanAttribute("not"));
    }

}
