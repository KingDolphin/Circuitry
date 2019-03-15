import {V} from "../../../utils/math/Vector";
import {FlipFlop} from "./FlipFlop";

export class SRFlipFlop extends FlipFlop {

	public constructor() {
		super(3, V(80, 120));
		this.getInputPort(0).setName("R");
		this.getInputPort(1).setName(">");
		this.getInputPort(2).setName("S");
	}

	// @Override
	public activate() {
		this.last_clock = this.clock;
		this.clock = this.inputs[1].getIsOn();
		const set = this.inputs[0].getIsOn();
		const reset = this.inputs[2].getIsOn();
		if (this.clock && !this.last_clock) {
			if (set && reset) {
				// undefined behavior
			} else if (set) {
				this.state = true;
			} else if (reset) {
				this.state = false;
			}
		}

		super.activate(this.state, 0);
		super.activate(!this.state, 1);
	}

	public getDisplayName() {
		return "SR Flip Flop";
	}

	public getXMLName(): string {
		return "srff";
	}
}
