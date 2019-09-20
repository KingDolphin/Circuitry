import {Action} from "../Action";
import {GroupAction} from "../GroupAction";
import {ReversableAction} from "../ReversableAction";

import {DigitalCircuitDesigner} from "digital/models/DigitalCircuitDesigner";
import {Component} from "digital/models/ioobjects/Component";

export class PlaceAction extends ReversableAction {
    private designer: DigitalCircuitDesigner;
    private obj: Component;

    public constructor(designer: DigitalCircuitDesigner, obj: Component, flip: boolean = false) {
        super(flip);

        this.designer = designer;
        this.obj = obj;
    }

    public normalExecute(): Action {
        this.designer.addObject(this.obj);

        return this;
    }

    public normalUndo(): Action {
        this.designer.removeObject(this.obj);

        return this;
    }

}

export class DeleteAction extends PlaceAction {
    public constructor(obj: Component) {
        super(obj.getDesigner(), obj, true);
    }
}


export function CreateGroupPlaceAction(designer: DigitalCircuitDesigner, objs: Array<Component>): GroupAction {
    return objs.reduce((acc, o) => {
        return acc.add(new PlaceAction(designer, o)) as GroupAction;
    }, new GroupAction());
}
