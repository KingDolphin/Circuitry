import {DEFAULT_SIZE,
        IO_PORT_LENGTH} from "core/utils/Constants";

import {Vector, V} from "Vector";
import {Transform} from "math/Transform";

import {GetNearestPointOnRect} from "math/MathUtils";

import {CopyGroup,
        CreateGraph,
        CreateGroup} from "core/utils/ComponentUtils";

import {DigitalObjectSet,
        SaveGroup,
        LoadGroup} from "digital/utils/ComponentUtils";

import {XMLNode} from "core/utils/io/xml/XMLNode";

import {IOObject} from "core/models/IOObject";
import {Port} from "core/models/ports/Port";
import {InputPort} from "digital/models/ports/InputPort";
import {OutputPort} from "digital/models/ports/OutputPort";

import {Label} from "./Label";
import {Switch} from "../inputs/Switch";
import {Button} from "../inputs/Button";
import {SevenSegmentDisplay} from "../outputs/SevenSegmentDisplay";

export class ICData {
    private transform: Transform;

    private collection: DigitalObjectSet;

    private inputPorts:  InputPort[];
    private outputPorts: OutputPort[];

    public constructor(collection?: DigitalObjectSet) {
        this.transform = new Transform(V(0,0), V(0,0));
        this.collection = collection;
        this.inputPorts  = [];
        this.outputPorts = [];

        if (collection) {
            this.calculateSize();
            this.createPorts(InputPort,  this.inputPorts,  this.collection.getInputs(), -1);
            this.createPorts(OutputPort, this.outputPorts, this.collection.getOutputs(), 1);
            this.positionPorts();
        }
    }

    private calculateSize(): void {
        const inputs  = this.collection.getInputs();
        const outputs = this.collection.getOutputs();

        // Set start size based on length of names and amount of ports
        let longestName = 0;
        for (const obj of inputs.concat(outputs))
            longestName = Math.max(obj.getName().length, longestName);

        const w = DEFAULT_SIZE + 20*longestName;
        const h = DEFAULT_SIZE/2*(Math.max(inputs.length, outputs.length));
        this.transform.setSize(V(w, h));
    }

    private createPorts(type: typeof InputPort | typeof OutputPort, ports: Array<Port>, arr: Array<IOObject>, side: -1 | 1): void {
        const w = this.transform.getSize().x;

        for (let i = 0; i < arr.length; i++) {
            const port = new type(undefined);

            let l = -DEFAULT_SIZE/2*(i - (arr.length)/2 + 0.5);
            if (i === 0) l -= 1;
            if (i === arr.length-1) l += 1;

            port.setName(arr[i].getName());
            port.setOriginPos(V(0, l));
            port.setTargetPos(V(side*(IO_PORT_LENGTH + (w/2 - DEFAULT_SIZE/2)), l));
            ports.push(port);
        }
    }

    public positionPorts(): void {
        const ports = this.getPorts();
        const size = this.transform.getSize();

        for (const port of ports) {
            // Scale by large number to make sure that the target position
            //  is not in the rectangle of the IC
            const target = this.transform.getMatrix().mul(port.getTargetPos());
            const origin = this.transform.getMatrix().mul(port.getOriginPos());
            const pos = target.add(target.sub(origin).normalize().scale(10000));

            const p = GetNearestPointOnRect(size.scale(-0.5), size.scale(0.5), pos);
            const v = p.sub(pos).normalize().scale(size.scale(0.5).sub(V(IO_PORT_LENGTH+size.x/2-25, IO_PORT_LENGTH+size.y/2-25))).add(p);

            port.setOriginPos(p);
            port.setTargetPos(v);
        }
    }

    public setSize(v: Vector): void {
        this.transform.setSize(v);
    }

    public getInputCount(): number {
        return this.collection.getInputs().length;
    }

    public getOutputCount(): number {
        return this.collection.getOutputs().length;
    }

    public getSize(): Vector {
        return this.transform.getSize();
    }

    public getInputPort(i: number): InputPort {
        return this.inputPorts[i];
    }

    public getOutputPort(i: number): OutputPort {
        return this.outputPorts[i];
    }

    public getPorts(): Array<Port> {
        let ports: Array<Port> = [];
        ports = ports.concat(this.inputPorts);
        ports = ports.concat(this.outputPorts);
        return ports;
    }

    public copy(): DigitalObjectSet {
        return new DigitalObjectSet(CopyGroup(this.collection).toList());
    }

    public save(node: XMLNode, icIdMap: Map<ICData, number>): void {
        node.addVectorAttribute("size", this.transform.getSize());

        // Save Input Ports
        const inputsNode = node.createChild("inputs");
        for (const input of this.inputPorts) {
            const inputNode = inputsNode.createChild("input");
            inputNode.addAttribute("name", input.getName());
            inputNode.addVectorAttribute("origin", input.getOriginPos());
            inputNode.addVectorAttribute("target", input.getTargetPos());
        }

        // Save Output Ports
        const outputsNode = node.createChild("outputs");
        for (const output of this.outputPorts) {
            const outputNode = outputsNode.createChild("output");
            outputNode.addAttribute("name", output.getName());
            outputNode.addVectorAttribute("origin", output.getOriginPos());
            outputNode.addVectorAttribute("target", output.getTargetPos());
        }

        // Save internal circuit
        const circuitNode = node.createChild("circuit");
        SaveGroup(circuitNode, this.collection.getComponents(), this.collection.getWires(), icIdMap);
    }

    public load(node: XMLNode, icIdMap: Map<number, ICData>): void {
        this.setSize(node.getVectorAttribute("size"));

        // Load inputs
        const inputNodes = node.findChild("inputs").getChildren();
        for (const input of inputNodes) {
            const port = new InputPort(undefined);
            port.setName(input.getAttribute("name"));
            port.setOriginPos(input.getVectorAttribute("origin"));
            port.setTargetPos(input.getVectorAttribute("target"));
            this.inputPorts.push(port);
        }

        // Load outputs
        const outputNodes = node.findChild("outputs").getChildren();
        for (const output of outputNodes) {
            const port = new OutputPort(undefined);
            port.setName(output.getAttribute("name"));
            port.setOriginPos(output.getVectorAttribute("origin"));
            port.setTargetPos(output.getVectorAttribute("target"));
            this.outputPorts.push(port);
        }

        // Load components
        const groupNode = node.findChild("circuit");
        this.collection = LoadGroup(groupNode, icIdMap);
    }

    public static IsValid(objects: IOObject[] | DigitalObjectSet): boolean {
        const BLACKLIST = [SevenSegmentDisplay, Label];

        const group = (objects instanceof DigitalObjectSet) ? (objects) : (CreateGroup(objects));
        const graph = CreateGraph(group);

        const objs  = group.getComponents();
        const wires = group.getWires();

        // Make sure it's a connected circuit
        if (!graph.isConnected())
            return false;

        // Make sure there's nothing on the blacklist
        if (objs.some((o) => BLACKLIST.some((type) => o instanceof type)))
            return false;

        // Make sure all wires connected to components are in the group
        const allWires = objs.flatMap(o => o.getConnections());
        if (allWires.some((w) => !wires.includes(w)))
            return false;

        return true;
    }

    public static Create(objects: IOObject[]): ICData {
        const copies = new DigitalObjectSet(CopyGroup(objects).toList());
        if (!this.IsValid(copies))
            return undefined;

        // Move non-whitelisted inputs to regular components list
        //  So that the ports that come out of the IC are useful inputs and not
        //  things like ConstantHigh and ConstantLow which aren't interactive
        const INPUT_WHITELIST = [Switch, Button];

        const inputs = copies.getInputs().filter((i) => INPUT_WHITELIST.some((type) => i instanceof type));
        const others = copies.getOthers().concat(copies.getInputs())
                .filter((c) => !INPUT_WHITELIST.some((type) => c instanceof type));

        copies.setInputs(inputs);
        copies.setOthers(others);

        return new ICData(copies);
    }
}
