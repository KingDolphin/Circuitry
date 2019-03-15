import {DEFAULT_SIZE,
        IO_PORT_LENGTH} from "../../../utils/Constants";

import {Vector,V} from "../../../utils/math/Vector";
import {Transform} from "../../../utils/math/Transform";

import {GetNearestPointOnRect} from "../../../utils/math/MathUtils";

import {SeparatedComponentCollection,
        CopyGroup,
        CreateGraph,
        CreateGroup,
        SaveGroup,
        LoadGroup} from "../../../utils/ComponentUtils";

import {XMLNode} from "../../../utils/io/xml/XMLNode";

import {IOObject} from "../IOObject";
import {Port} from "../Port";
import {InputPort} from "../InputPort";
import {OutputPort} from "../OutputPort";

export class ICData {
    private transform: Transform;

    private collection: SeparatedComponentCollection;

    private inputPorts:  Array<InputPort>;
    private outputPorts: Array<OutputPort>;

    public constructor(collection?: SeparatedComponentCollection) {
        this.transform = new Transform(V(0,0), V(0,0));
        this.collection = collection;
        this.inputPorts  = [];
        this.outputPorts = [];

        if (collection) {
            this.calculateSize();
            this.createPorts(InputPort, this.inputPorts, this.collection.inputs, -1);
            this.createPorts(OutputPort, this.outputPorts, this.collection.outputs, 1);
            this.positionPorts();
        }
    }

    private calculateSize(): void {
        // Set start size based on length of names and amount of ports
        let longestName = 0;
        for (let obj of this.collection.inputs.concat(this.collection.outputs))
            longestName = Math.max(obj.getName().length, longestName);
        let w = DEFAULT_SIZE + 20*longestName;
        let h = DEFAULT_SIZE/2*(Math.max(this.collection.inputs.length, this.collection.outputs.length));
        this.transform.setSize(V(w, h));
    }

    private createPorts(type: typeof InputPort | typeof OutputPort, ports: Array<Port>, arr: Array<IOObject>, side: -1 | 1): void {
        let w = this.transform.getSize().x;

        for (let i = 0; i < arr.length; i++) {
            let port = new type(undefined);

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

        for (let i = 0; i < ports.length; i++) {
            let port = ports[i];
            // Scale by large number to make sure that the target position
            //  is not in the rectangle of the IC
            let target = this.transform.getMatrix().mul(port.getTargetPos());
            let origin = this.transform.getMatrix().mul(port.getOriginPos());
            let pos = target.add(target.sub(origin).normalize().scale(10000));

            let p = GetNearestPointOnRect(size.scale(-0.5), size.scale(0.5), pos);
            let v1 = p.sub(pos).normalize().scale(size.scale(0.5)).add(p);
            let v2 = p.sub(pos).normalize().scale(size.scale(0.5).sub(V(IO_PORT_LENGTH+size.x/2-25, IO_PORT_LENGTH+size.y/2-25))).add(p);

            port.setOriginPos(v1);
            port.setTargetPos(v2);
        }
    }

    public setSize(v: Vector): void {
        this.transform.setSize(v);
    }

    public getInputCount(): number {
        return this.collection.inputs.length;
    }

    public getOutputCount(): number {
        return this.collection.outputs.length;
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

    public copy(): SeparatedComponentCollection {
        return CopyGroup(this.collection);
    }

    public save(node: XMLNode, icIdMap: Map<ICData, number>): void {
        node.addVectorAttribute("size", this.transform.getSize());

        // Save Input Ports
        let inputsNode = node.createChild("inputs");
        for (let input of this.inputPorts) {
            let inputNode = inputsNode.createChild("input");
            inputNode.addAttribute("name", input.getName());
            inputNode.addVectorAttribute("origin", input.getOriginPos());
            inputNode.addVectorAttribute("target", input.getTargetPos());
        }

        // Save Output Ports
        let outputsNode = node.createChild("outputs");
        for (let output of this.outputPorts) {
            let outputNode = outputsNode.createChild("output");
            outputNode.addAttribute("name", output.getName());
            outputNode.addVectorAttribute("origin", output.getOriginPos());
            outputNode.addVectorAttribute("target", output.getTargetPos());
        }

        // Save internal circuit
        let circuitNode = node.createChild("circuit");
        SaveGroup(circuitNode, this.collection.getAllComponents(), this.collection.wires, icIdMap);
    }

    public load(node: XMLNode, icIdMap: Map<number, ICData>): void {
        this.setSize(node.getVectorAttribute("size"));

        // Load inputs
        let inputNodes = node.findChild("inputs").getChildren();
        for (let input of inputNodes) {
            let port = new InputPort(undefined);
            port.setName(input.getAttribute("name"));
            port.setOriginPos(input.getVectorAttribute("origin"));
            port.setTargetPos(input.getVectorAttribute("target"));
            this.inputPorts.push(port);
        }

        // Load outputs
        let outputNodes = node.findChild("outputs").getChildren();
        for (let output of outputNodes) {
            let port = new OutputPort(undefined);
            port.setName(output.getAttribute("name"));
            port.setOriginPos(output.getVectorAttribute("origin"));
            port.setTargetPos(output.getVectorAttribute("target"));
            this.outputPorts.push(port);
        }

        // Load components
        let groupNode = node.findChild("circuit");
        this.collection = LoadGroup(groupNode, icIdMap);
    }

    static IsValid(objects: Array<IOObject> | SeparatedComponentCollection): boolean {
        let group = (objects instanceof SeparatedComponentCollection) ? (objects) : (CreateGroup(objects));
        let graph = CreateGraph(group);

        // Make sure it's a connected circuit
        if (!graph.isConnected())
            return false;

        // Make sure it contains valid inputs (i.e. input w/ exactly 1 output)
        for (let input of group.inputs) {
            if (input.getOutputPortCount() != 1)
                return false;
        }
        // Make sure it contains valid outputs (i.e. output w/ exactly 1 input)
        for (let output of group.outputs) {
            if (output.getInputPortCount() != 1)
                return false;
        }

        return true;
    }

    static Create(objects: Array<IOObject>): ICData {
        let copies = CopyGroup(objects);
        if (!this.IsValid(copies))
            return undefined;

        return new ICData(copies);
    }
}
