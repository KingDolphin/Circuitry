import {Z_KEY, Y_KEY} from "core/utils/Constants";
import {Input} from "core/utils/Input";
import {Tool} from "core/tools/Tool";

import {ActionManager} from "../actions/ActionManager";

export class ActionHelper {
    private disabled: boolean;
    private actionManager: ActionManager;

    public constructor(actionManager: ActionManager) {
        this.disabled = false;
        this.actionManager = actionManager;
    }

    public onEvent(_: Tool, event: string, input: Input, key?: number): boolean {
        if (this.disabled)
            return false;
        if (event != "keydown")
            return false;

        // Redo: CMD/CTRL + SHIFT + Z   or   CMD/CTRL + Y
        if (input.isModifierKeyDown() && input.isShiftKeyDown() && key == Z_KEY ||
            input.isModifierKeyDown() &&                           key == Y_KEY) {
            this.actionManager.redo();
            return true;
        }

        // Undo: CMD/CTRL + Z
        if (input.isModifierKeyDown() && key == Z_KEY) {
            this.actionManager.undo();
            return true;
        }

        return false;
    }

    public setDisabled(val: boolean = true): void {
        this.disabled = val;
    }
}
