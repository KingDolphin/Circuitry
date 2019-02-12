import {IO_PORT_RADIUS} from "../../../utils/Constants";
import {V} from "../../../utils/math/Vector";
import {ClampedValue} from "../../../utils/ClampedValue";
import {Component} from "../Component";
import { Port } from "../Port";

export class SevenSegmentDisplay extends Component {
    public constructor() {
        super(new ClampedValue(7),
              new ClampedValue(0),
              V(70, 100));

        this.setInputPortCount(7);
    }

    protected updatePortPositions(arr: Array<Port>): void {
        for (let i = 0; i < arr.length; i++) {
            // Calculate y position of port
            let l = -(2*IO_PORT_RADIUS+1)*(i - arr.length/2 + 0.5);
            if (i === 0) l--;
            if (i === arr.length-1) l++;

            // Set y positions
            let port = arr[i];
            port.setOriginPos(V(port.getOriginPos().x, l));
            port.setTargetPos(V(port.getTargetPos().x, l));
        }
    }

    public getDisplayName(): string {
        return "7 Segment Display";
    }

    public getImageName(): string {
        return "";
    }

    public getXMLName() {
        return "sevensegmentdisplay";
    }
}
