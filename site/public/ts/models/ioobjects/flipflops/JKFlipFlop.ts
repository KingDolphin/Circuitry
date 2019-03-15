import {V} from "../../../utils/math/Vector";
import {FlipFlop} from "./FlipFlop";

export class JKFlipFlop extends FlipFlop {

	public constructor() {
		super(3, V(80, 120));
		this.getInputPort(0).setName("K");
		this.getInputPort(1).setName(">");
		this.getInputPort(2).setName("J");
	}
	
	// @Override
	public activate() {
		this.last_clock = this.clock;
		this.clock = this.inputs[1].getIsOn();
		const set = this.inputs[0].getIsOn();
		const reset = this.inputs[2].getIsOn();
		if (this.clock && !this.last_clock) {
			if (set && reset) {
				this.state = !this.state;
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
		return "JK Flip Flop";
	}

	public getXMLName(): string {
		return "jkff";
	}
}
