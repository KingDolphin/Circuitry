import "jest";

import {OPTION_KEY,
        MIDDLE_MOUSE_BUTTON} from "core/utils/Constants";

import {V} from "Vector";

import {Setup} from "test/helpers/Setup";


describe("Pan Tool", () => {
    const {camera, input} = Setup();

    afterEach(() => {
        // Reset camera position for each test
        camera.setPos(V());
    });

    test("Drag without option key", () => {
        input.drag(V(0, 0), V(-20, 0));
        expect(camera.getPos()).toEqual(V(0, 0));
    });

    test("Drag with option key", () => {
        input.pressKey(OPTION_KEY)
                .drag(V(0, 0), V(20, 0))
                .releaseKey(OPTION_KEY);
        expect(camera.getPos()).toEqual(V(-20, 0));
    });

    test("No drag with option key", () => {
        input.pressKey(OPTION_KEY)
                .press(V(0, 0))
                .releaseKey(OPTION_KEY)
                .release();
        expect(camera.getPos()).toEqual(V(0, 0));
    });

    test("Drag with middle mouse", () => {
        input.drag(V(0, 0), V(20, 0), MIDDLE_MOUSE_BUTTON);
        expect(camera.getPos()).toEqual(V(-20, 0));
    });

    test("Drag with two fingers", () => {
        input.touch(V(-20, 0))
                .touch(V(20, 0))
                .moveTouches(V(20, 0))
                .releaseTouch()
                .releaseTouch();
        expect(camera.getPos()).toEqual(V(-20, 0));
    });

});
