import {createRef} from "react";

import {InteractionTool}    from "core/tools/InteractionTool";
import {PanTool}            from "core/tools/PanTool";
import {RotateTool}         from "core/tools/RotateTool";
import {TranslateTool}      from "core/tools/TranslateTool";
import {WiringTool}         from "core/tools/WiringTool";
import {SplitWireTool}      from "core/tools/SplitWireTool";
import {SelectionBoxTool}   from "core/tools/SelectionBoxTool";

import {CircuitMetadataBuilder} from "core/models/CircuitMetadata";

import {SetCircuitSaved} from "shared/state/CircuitInfo/actions";

import {ContextMenu}     from "shared/containers/ContextMenu";
import {Header}          from "shared/containers/Header";
import {SideNav}         from "shared/containers/SideNav";

import {LoginPopup}           from "shared/containers/LoginPopup";
import {SelectionPopup}       from "shared/containers/SelectionPopup";
import {PositionModule}       from "shared/containers/SelectionPopup/modules/PositionModule";

import {DigitalPaste} from "site/digital/utils/DigitalPaste";
import {Setup}        from "site/digital/utils/CircuitInfo/Setup";

import {AppStore} from "site/digital/state";

import {DigitalItemNav}         from "site/digital/containers/DigitalItemNav";
import {ICDesigner}             from "site/digital/containers/ICDesigner";
import {ICViewer}               from "site/digital/containers/ICViewer";
import {KeyboardShortcutsPopup} from "site/digital/containers/KeyboardShortcutsPopup";
import {MainDesigner}           from "site/digital/containers/MainDesigner";
import {QuickStartPopup}        from "site/digital/containers/QuickStartPopup";

import {ViewICButtonModule}   from "site/digital/containers/SelectionPopup/modules/ViewICButtonModule";
import {InputCountModule}     from "site/digital/containers/SelectionPopup/modules/InputCountModule";
import {ColorModule}          from "site/digital/containers/SelectionPopup/modules/ColorModule";
import {ClockFrequencyModule} from "site/digital/containers/SelectionPopup/modules/ClockFrequencyModule";
import {OutputCountModule}    from "site/digital/containers/SelectionPopup/modules/OutputCountModule";
import {SegmentCountModule}   from "site/digital/containers/SelectionPopup/modules/SegmentCountModule";
import {TextColorModule}      from "site/digital/containers/SelectionPopup/modules/TextColorModule";
import {BusButtonModule}      from "site/digital/containers/SelectionPopup/modules/BusButtonModule";
import {CreateICButtonModule} from "site/digital/containers/SelectionPopup/modules/CreateICButtonModule";

import exampleConfig from "site/digital/data/examples.json";

import "./index.scss";


const exampleCircuits = exampleConfig.examples.map((example) =>
    new CircuitMetadataBuilder()
        .withId(example.file)
        .withName(example.name)
        .withOwner("Example")
        .withDesc("Example Circuit")
        .withThumbnail(example.thumbnail)
        .build()
);

export const App = ((store: AppStore) => {
    const canvas = createRef<HTMLCanvasElement>();

    // Setup circuit and get the CircuitInfo and helpers
    const [info, helpers] = Setup(
        store, canvas,
        new InteractionTool(),
        PanTool, RotateTool,
        TranslateTool, WiringTool,
        SplitWireTool, SelectionBoxTool
    );

    info.history.addCallback(() => {
        store.dispatch(SetCircuitSaved(false));
    });


    return function AppView() {
        return (
            <div className="App">
                <SideNav helpers={helpers}
                         exampleCircuits={exampleCircuits} />

                <div className="App__container">
                    <Header img="img/icons/logo.svg"
                            helpers={helpers} />

                    <main>
                        <MainDesigner info={info} />

                        <DigitalItemNav info={info} />

                        <SelectionPopup info={info}
                                        modules={[PositionModule, InputCountModule,
                                                  OutputCountModule, SegmentCountModule,
                                                  ClockFrequencyModule,
                                                  ColorModule, TextColorModule,
                                                  BusButtonModule, CreateICButtonModule,
                                                  ViewICButtonModule]} />

                        <ContextMenu info={info}
                                     paste={(data) => DigitalPaste(data, info)} />
                    </main>
                </div>

                <ICDesigner mainInfo={info} />
                <ICViewer mainInfo={info} />

                <QuickStartPopup />
                <KeyboardShortcutsPopup />

                <LoginPopup />
            </div>
        );
    }
});
