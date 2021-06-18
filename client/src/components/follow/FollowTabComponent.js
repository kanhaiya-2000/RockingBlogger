import React from "react";
import './Follow.css';

const FollowTabComponent = ({tabstate,changeTab})=>{
    return <div className="follow_tabgroup">
            <div className={"tab"+(tabstate===0?" selected-tab":"")} onClick={()=>changeTab(0)}>People</div>
            <div className={"tab"+(tabstate===1?" selected-tab":"")} onClick={()=>changeTab(1)}>Topics</div>
        </div>
}
export default FollowTabComponent;