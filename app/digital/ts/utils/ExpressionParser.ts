import {DigitalComponent} from "digital/models/index";
import {DigitalObjectSet} from "digital/utils/ComponentUtils";

/**
 * Main driver function for parsing an expression into a circuit
 *
 * @param  inputs A map correlating input name to the DigitalComponent it represents
 * @param  expression The expression to be parsed
 * @param  output The DigitalComponent to use as an output, port 0 will be used
 * @return The circuit generated by the given expression, null on error (see above)
 * @throws {Error} if any of the input parameters are null or undefined
 * @throws {Error} if an input in inputs is has an input port or does not have an output port
 *                   (thus is not a "real" Input)
 * @throws {Error} if output has an output port or does not have an input port
 *                   (thus is not a "real" Output)
 * @throws {Error} if expression requests an input not found in inputs
 * @throws {Error} if there is an unmatched '(' or ')'
 * @throws {Error} if there is a '!', '&', '^', or '|' that is missing an operand
 */
export function ExpressionToCircuit(inputs: Map<string, DigitalComponent>,
                                    expression: string,
                                    output: DigitalComponent): DigitalObjectSet {
    if(inputs == null)  throw new Error("Null Parameter: inputs");
    if(expression == null) throw new Error("Null Parameter: expression");
    if(output == null) throw new Error("Null Parameter: output");

    for(let [name, component] of inputs) {
        if(component.getInputPortCount().getValue() != 0
          || component.getOutputPortCount().getValue() == 0) {
            throw new Error("Not An Input: " + name);
        }
    }

    if(output.getInputPortCount().getValue() == 0
      || output.getOutputPortCount().getValue() != 0) {
        throw new Error("Supplied Output Is Not An Output");
    }

    return new DigitalObjectSet()
}