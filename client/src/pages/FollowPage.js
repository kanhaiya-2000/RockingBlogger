import React from "react";
import FollowTabComponent from "../components/follow/FollowTabComponent";
import FollowPagecontent from "../components/follow/FollowPagecontent"; 

const FollowPage = ()=>{
    const [tabstate,setState] = React.useState(0);
    const changeTab = (switchtoTab)=>{
        setState(switchtoTab);
    }
    return <div className="followpage">
        <h1>Customize your interest</h1>
        <p>Here are people, and topics you should consider following on Blogger.</p>
        <FollowTabComponent tabstate={tabstate} changeTab={changeTab}/>
        <FollowPagecontent tabstate={tabstate}/>
    </div>
}

export default FollowPage;