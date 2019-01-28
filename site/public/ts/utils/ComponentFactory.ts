import {Component} from "../models/ioobjects/Component";

import {Switch} from "../models/ioobjects/inputs/Switch";

import {LED} from "../models/ioobjects/outputs/LED";

import {BUFGate} from "../models/ioobjects/gates/BUFGate";
import {ANDGate} from "../models/ioobjects/gates/ANDGate";
import {ORGate}  from "../models/ioobjects/gates/ORGate";
import {XORGate} from "../models/ioobjects/gates/XORGate";

import {DFlipFlop}  from "../models/ioobjects/flipflops/DFlipFlop";
import {JKFlipFlop} from "../models/ioobjects/flipflops/JKFlipFlop";
import {SRFlipFlop} from "../models/ioobjects/flipflops/SRFlipFlop";
import {TFlipFlop}  from "../models/ioobjects/flipflops/TFlipFlop";

const INPUTS    = [Switch];
const OUTPUTS   = [LED];
const GATES     = [BUFGate, ANDGate, ORGate, XORGate];
const FLIPFLOPS = [DFlipFlop, JKFlipFlop, SRFlipFlop, TFlipFlop];

let XML_COMPONENTS = new Map<string, any>();

// Helper to add a bunch of types to the COMPONENTS map
function addXMLTypes(types: Array<any>) {
    for (let type of types)
        XML_COMPONENTS.set(new type().getXMLName(), type);
}

addXMLTypes(INPUTS);
addXMLTypes(OUTPUTS);
addXMLTypes(GATES);
addXMLTypes(FLIPFLOPS);

/**
 * Helper method that creates an object from the
 *  given XML tag
 *
 * @param  val [description]
 * @return     [description]
 */
export function CreateComponentFromXML(tag: string, not: boolean = false): Component {
    if (XML_COMPONENTS.has(tag)) {
        let type = XML_COMPONENTS.get(tag);
        return <Component>(new type(not));
    }
    return undefined;
}

export function GetAllComponentInputs() {
    return INPUTS.slice();
}
export function GetAllComponentOutputs() {
    return OUTPUTS.slice();
}
export function GetAllComponentGates() {
    return GATES.slice();
}
export function GetAllComponentFlipFlops() {
    return FLIPFLOPS.slice();
}
