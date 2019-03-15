import {DEFAULT_SIZE,
        WIRE_THICKNESS} from "../../utils/Constants";

import {V,Vector} from "../../utils/math/Vector";
import {Matrix2x3} from "../../utils/math/Matrix";
import {BezierCurve} from "../../utils/math/BezierCurve";
import {XMLNode} from "../../utils/io/xml/XMLNode";
import {CullableObject}   from "./CullableObject";
import {Component}  from "./Component";
import {OutputPort} from "./OutputPort";
import {InputPort}  from "./InputPort";

export class Wire extends CullableObject {
    private input: OutputPort;
    private output: InputPort;

    private isOn: boolean;

    private shape: BezierCurve;
    private straight: boolean;

    private prevInputTransform: Matrix2x3;
    private prevOutputTransform: Matrix2x3;

	public constructor(input: OutputPort, output: InputPort) {
        super();

		this.input = input;
		this.output = output;

        this.isOn = false;

        this.shape = new BezierCurve(V(),V(),V(),V());
        this.straight = false;
	}

    private updateCurve(): void {
        if (this.input != null) {
            // If transform matrix differs then update curve
            const mat = this.input.getParent().getTransform().getMatrix();
            if (!mat.equals(this.prevInputTransform)) {
                this.prevInputTransform = mat;
                const pos = this.input.getWorldTargetPos();
                const dir = this.input.getWorldDir();
                this.shape.setP1(pos);
                this.shape.setC1(dir.scale(DEFAULT_SIZE).add(pos));
            }
        }
        if (this.output != null) {
            // If transform matrix differs then update curve
            const mat = this.output.getParent().getTransform().getMatrix();
            if (!mat.equals(this.prevOutputTransform)) {
                this.prevOutputTransform = mat;
                const pos = this.output.getWorldTargetPos();
                const dir = this.output.getWorldDir();
                this.shape.setP2(pos);
                this.shape.setC2(dir.scale(DEFAULT_SIZE).add(pos));
            }
        }
    }

	public activate(signal: boolean): void {
		// Don't do anything if signal is same as current state
		if (signal == this.isOn)
			return;

		this.isOn = signal;
		if (this.output != null)
			this.output.activate(signal);
	}

	public setInput(c: OutputPort): void {
		this.input = c;
	}

	public setOutput(c: InputPort): void {
		this.output = c;
	}

    public getInput(): OutputPort {
        return this.input;
    }

    public getInputComponent(): Component {
        return this.input.getParent();
    }

    public getOutput(): InputPort {
        return this.output;
    }

    public getOutputComponent(): Component {
        return this.output.getParent();
    }

    public getIsOn(): boolean {
        return this.isOn;
    }

    public getShape(): BezierCurve {
        this.updateCurve();
        return this.shape;
    }

    public isStraight(): boolean {
        return this.straight;
    }

    public getMinPos(): Vector {
        return this.getShape().getBoundingBox().getBottomLeft().sub(WIRE_THICKNESS/2, WIRE_THICKNESS/2);
    }

    public getMaxPos(): Vector {
        return this.getShape().getBoundingBox().getTopRight().add(WIRE_THICKNESS/2, WIRE_THICKNESS/2);
    }

    public save(node: XMLNode): void {
        super.save(node);

        // write curve
        const curveNode = node.createChild("curve");
        curveNode.addVectorAttribute("p1", this.shape.getP1());
        curveNode.addVectorAttribute("p2", this.shape.getP2());
        curveNode.addVectorAttribute("c1", this.shape.getC1());
        curveNode.addVectorAttribute("c2", this.shape.getC2());
    }

    public load(node: XMLNode): void {
        super.load(node);

        // load curve
        const curveNode = node.findChild("curve");
        this.shape.setP1(curveNode.getVectorAttribute("p1"));
        this.shape.setP2(curveNode.getVectorAttribute("p2"));
        this.shape.setC1(curveNode.getVectorAttribute("c1"));
        this.shape.setC2(curveNode.getVectorAttribute("c2"));
    }

    public getDisplayName(): string {
        return "Wire";
    }

    public getXMLName(): string {
        return "wire";
    }
}
