import {connect} from "react-redux";

import {SharedAppState} from "shared/state";
import {HeaderMenus, HeaderPopups} from "shared/state/Header/state";
import {OpenHeaderMenu, OpenHeaderPopup, CloseHeaderMenus} from "shared/state/Header/actions";

import {Dropdown} from "./Dropdown";


type OwnProps = {}
type StateProps = {
    curMenu: HeaderMenus;
}
type DispatchProps = {
    openMenu: (menu: HeaderMenus) => void;
    openPopup: (popup: HeaderPopups) => void;
    closeMenus: () => void;
}

type Props = StateProps & DispatchProps & OwnProps;
const _TutorialDropdown = ({ curMenu, openMenu, openPopup, closeMenus }: Props) => (
    <Dropdown open={(curMenu === "tutorial")}
              onClick={() => openMenu("tutorial")}
              onClose={() => closeMenus()}
              btnInfo={{title: "Help", src: "img/icons/help.svg"}}>
        <h1>Tours</h1>
        <hr/>
        <div className="disabled">
            <img src="img/icons/tour_general.svg" height="100%" alt="Take a tour of OpenCircuits"/>
            <span>General Tour</span>
        </div>
        <h1>Resources</h1>
        <hr/>
        <div onClick={() => { closeMenus(); openPopup("quick_start"); }}>
            <img src="img/icons/quick_start.svg" height="100%" alt="Check out our Quick Start guide" />
            <span>Quick Start</span>
        </div>
        <div className="disabled">
            <img src="img/icons/video_tutorials.svg" height="100%" alt="Check out our Video Tutorials" />
            <span>Video Tutorials</span>
        </div>
        <div className="disabled">
            <img src="img/icons/user_guide.svg" height="100%" alt="Read our User Guide" />
            <span>OpenCircuits User Guide</span>
        </div>
        <div className="disabled">
            <img src="img/icons/help_center.svg" height="100%" alt="Check out our Help Center" />
            <span>Help Center</span>
        </div>
        <div onClick={() => { closeMenus(); openPopup("keyboard_shortcuts"); }}>
            <img src="img/icons/keyboard.svg" height="100%" alt="See our Keyboard Shortcuts" />
            <span>Keyboard Shortcuts</span>
        </div>
    </Dropdown>
);


const MapState = (state: SharedAppState) => ({
    curMenu: state.header.curMenu
});
const MapDispatch = {
    openMenu: OpenHeaderMenu,
    openPopup: OpenHeaderPopup,
    closeMenus: CloseHeaderMenus
};
export const TutorialDropdown = connect<StateProps, DispatchProps, OwnProps, SharedAppState>(
    MapState,
    MapDispatch
)(_TutorialDropdown);
