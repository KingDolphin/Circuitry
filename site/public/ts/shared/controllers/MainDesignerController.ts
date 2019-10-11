import {Vector} from "Vector";

import {CircuitView} from "site/shared/views/CircuitView";

import {TranslateTool} from "core/tools/TranslateTool";
import {RotateTool} from "core/tools/RotateTool";
import {PlaceComponentTool} from "core/tools/PlaceComponentTool";
import {WiringTool} from "core/tools/WiringTool";

import {CircuitDesigner} from "core/models/CircuitDesigner";
import {Component} from "core/models/Component";
import {ItemNavController} from "site/shared/controllers/ItemNavController";
import {DesignerController} from "./DesignerController";
import {SelectionPopupController} from "site/shared/controllers/SelectionPopupController";

export abstract class MainDesignerController extends DesignerController {
    protected itemNav: ItemNavController;
    protected selectionPopup: SelectionPopupController;

    protected constructor(designer: CircuitDesigner,
                          view: CircuitView,
                          CreateFromXML: (tag: string, not?: boolean) => Component) {
        super(designer, view);

        this.itemNav = new ItemNavController(this, CreateFromXML);
        this.selectionPopup = new SelectionPopupController(this);

        this.toolManager.getSelectionTool().addSelectionChangeListener(() => this.selectionPopup.update());
    }

    public setEditMode(editMode: boolean): void {
        // Disable some tools
        this.toolManager.disableTool(TranslateTool, !editMode);
        this.toolManager.disableTool(RotateTool, !editMode);
        this.toolManager.disableTool(PlaceComponentTool, !editMode);
        this.toolManager.disableTool(WiringTool, !editMode);

        // Disable actions/selections
        this.toolManager.disableActions(!editMode);
        this.clearSelections();
        this.toolManager.getSelectionTool().disableSelections(!editMode);

        // Toggle ItemNavController
        if (this.itemNav.isOpen())
            this.itemNav.toggle();

        // Disable or re-enable ItemNavController
        if (editMode)
            this.itemNav.enable();
        else
            this.itemNav.disable();

        this.render();
    }

    public abstract loadCircuit(contents: XMLDocument): void;
    public abstract saveCircuit(): string;

    public setActive(on: boolean): void {
        super.setActive(on);

        if (!on) {
            // Hide and disable ItemNavController
            if (this.itemNav.isOpen())
                this.itemNav.toggle();
            this.itemNav.disable();
        } else {
            this.itemNav.enable();
        }
    }

    protected onMouseDrag(button: number): boolean {
        if (super.onMouseDrag(button)) {
            this.selectionPopup.hide();
            return true;
        }
        return false;
    }

    protected onMouseUp(button: number): boolean {
        if (super.onMouseUp(button)) {
            this.selectionPopup.update();
            return true;
        }
        return false;
    }

    protected onClick(button: number): boolean {
        if (super.onClick(button)) {
            this.selectionPopup.update();
            return true;
        }
        return false;
    }

    protected onKeyDown(key: number): boolean {
        if (super.onKeyDown(key)) {
            this.selectionPopup.update();
            return true;
        }
        return false;
    }

    protected onZoom(zoom: number, center: Vector): boolean {
        super.onZoom(zoom, center);

        this.selectionPopup.update();

        return true;
    }
}