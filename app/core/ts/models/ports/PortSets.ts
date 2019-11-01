import {ClampedValue} from "math/ClampedValue";

import {Component} from "core/models/Component";
import {Port}      from "core/models/ports/Port";

import {Positioner} from "./positioners/Positioner";

export class PortSet<T extends Port> {
    private parent: Component;

    // Keep track of old ports so that we can keep references intact
    //  for wire connections and such when we change the port count
    private oldPorts: T[];
    private currentPorts: T[];

    private count: ClampedValue;

    private type: new(c: Component) => T;

    private positioner: Positioner<T>;

    public constructor(parent: Component, count: ClampedValue,
                       positioner: Positioner<T> = new Positioner<T>(), type: new(c: Component) => T) {
        this.parent = parent;
        this.type = type;
        this.count = count;
        this.positioner = positioner;

        this.oldPorts = [];
        this.currentPorts = [];

        this.setPortCount(count.getValue());
    }

    /**
     * Set the number of Ports of this set.
     *  The value will be clamped and positions of ports
     *  will be updated.
     * @param val The new number of ports
     */
    public setPortCount(newVal: number): void {
        // no need to update if value is already
        //  the current amount
        if (newVal == this.currentPorts.length)
            return;

        // set count (will auto-clamp)
        this.count.setValue(newVal);

        // add or remove ports to meet target
        while (this.currentPorts.length > this.count.getValue())
            this.oldPorts.push(this.currentPorts.pop());
        while (this.currentPorts.length < this.count.getValue())
            this.currentPorts.push(this.oldPorts.pop() || new this.type(this.parent));

        // update positions
        this.positioner.updatePortPositions(this.currentPorts);
    }

    public get(i: number): T {
        return this.currentPorts[i];
    }

    public getPorts(): T[] {
        return this.currentPorts.slice();
    }

    public getCount(): ClampedValue {
        return this.count.copy();
    }

    public get length(): number {
        return this.currentPorts.length;
    }

    public get first(): T {
        return this.currentPorts[0];
    }

    public get last(): T {
        return this.currentPorts[this.currentPorts.length - 1];
    }

    public isEmpty(): boolean {
        return this.currentPorts.length == 0;
    }

    public copy(newParent: Component): PortSet<T> {
        const copy = new PortSet<T>(newParent, this.count.copy(), this.positioner, this.type);

        // Copy port positions
        copy.currentPorts.forEach((p, i) => {
            p.setOriginPos(this.currentPorts[i].getOriginPos());
            p.setTargetPos(this.currentPorts[i].getTargetPos());
        });

        return copy;
    }

}
