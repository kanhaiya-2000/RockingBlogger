import React from "react";
import {useHistory} from "react-router-dom";
import "./Navbar.css";
import Input from "@material-ui/core/Input";
import RockingBloggerLogo from "../../assets/RockingBloggerlogo.png";
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import NotificationsActiveOutlinedIcon from '@material-ui/icons/NotificationsActiveOutlined';
import WhatshotOutlinedIcon from '@material-ui/icons/WhatshotOutlined';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import Zoom from "@material-ui/core/Zoom";
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
import GroupAddOutlinedIcon from '@material-ui/icons/GroupAddOutlined';
import MenuOutlinedIcon from '@material-ui/icons/MenuOutlined';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import PermIdentityOutlinedIcon from '@material-ui/icons/PermIdentityOutlined';

const MobileSearchModal = ({ closeModal,history }) => {
    return (
        <div className="searchmodal mobile_pf">
            <div className="input-wrapper">
                <Input
                    type="text"
                    style={{ width: "100%" }}
                    placeholder="Search 🔍️"
                    autoFocus={true}
                    onBlur={closeModal}
                />
            </div>
        </div>
    )
}

const MobileMenu = ({ isAuthenticated,history,closeModal }) => {
    return (
        <div className="mobilemenu mobile_pf" onClick={closeModal}>
            <div className="menu_item" onClick={()=>history.push("/")}>
                <HomeOutlinedIcon />&nbsp;&nbsp;Home
            </div>
            <div className="menu_item" onClick={()=>history.push("/follow-tag-or-people")}>
                <GroupAddOutlinedIcon />&nbsp;&nbsp;Suggestions
            </div>
            <div className="menu_item" onClick={()=>history.push("/trending")}>
                <WhatshotOutlinedIcon />&nbsp;&nbsp;Trending
            </div>
            <div className="menu_item" onClick={()=>history.push("/notification")}>
                <NotificationsActiveOutlinedIcon />&nbsp;&nbsp;Notification
            </div>
            {!isAuthenticated &&
                <div className="menu_item" onClick={()=>history.push("/signin")}>
                    <VpnKeyOutlinedIcon />&nbsp;&nbsp;Log in
                </div>}
            {isAuthenticated && 
                <div className="menu_item" onClick={()=>history.push("/user/me")}>
                    <PermIdentityOutlinedIcon />&nbsp;&nbsp;Profile
                </div>}
        </div>
    )
}

const Navbar = () => {
    const isAuthenticated = localStorage.getItem("user");
    const history = useHistory();
    const [openMenu, isMenuOpen] = React.useState(false);
    const [search, isSearchOpen] = React.useState(false);
    const closeModal = () => {
        isSearchOpen(false);
        isMenuOpen(false);
    }
    return (
        <div className="header">
            {openMenu && <MobileMenu isAuthenticated={isAuthenticated} history={history} closeModal={closeModal}/>}
            {search && <MobileSearchModal closeModal={closeModal} history={history}/>}

            <div className="mainheader_wrapper">
                <div className="header_left">
                    <a href="/">
                        <div className="logo">
                            <img src={RockingBloggerLogo} alt="" id="logo" />
                        </div>
                    </a>
                    <div className="search">
                        <Input
                            type="text"
                            placeholder="Search 🔍️"
                        />
                    </div>
                </div>
                <div className="mobile_header">
                    <div className="search_mobile" onClick={() => { isSearchOpen(!search); isMenuOpen(false) }}>
                        <SearchOutlinedIcon />
                    </div>
                    <div className="create_new" onClick={()=>history.push("/newstory")}>
                        <AddCircleOutlineOutlinedIcon />
                    </div>
                    <div className="menu" onClick={() => { isSearchOpen(false); isMenuOpen(!openMenu) }}>
                        {openMenu ? <ClearOutlinedIcon /> : <MenuOutlinedIcon />}
                    </div>
                </div>
                <div className="header_right">
                    <Tooltip title="Suggested ♥️" TransitionComponent={Zoom} arrow>
                        <div className="suggestion_icon icon" onClick={()=>history.push("/follow-tag-or-people")}>
                            <GroupAddOutlinedIcon />
                        </div>
                    </Tooltip>
                    <Tooltip title="Notifications 🔔️" TransitionComponent={Zoom} arrow>
                        <div className="notification_icon icon" onClick={()=>history.push("/notification")}>
                            <NotificationsActiveOutlinedIcon />
                        </div>
                    </Tooltip>
                    <Tooltip title="Trending 🔥️" TransitionComponent={Zoom} arrow>
                        <div className="trending_icon icon" onClick={()=>history.push("/trending")}>
                            <WhatshotOutlinedIcon />
                        </div>
                    </Tooltip>
                    <Tooltip title="New story ✍️" TransitionComponent={Zoom} arrow>
                        <div className="create_new icon" onClick={()=>history.push("/newstory")}>
                            <AddCircleOutlineOutlinedIcon />
                        </div>
                    </Tooltip>                    

                    <div className="profile">{isAuthenticated ?
                        <Tooltip title="Your profile 😃️" TransitionComponent={Zoom} arrow>
                            <Avatar alt="" onClick={()=>history.push("/user/me")}/>
                        </Tooltip>
                        : <span onClick={()=>history.push("/signin")}>Log in</span>}</div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;