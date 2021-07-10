import React from "react";
import { useHistory } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import './Home.css';


const Suggestedfollowing = ({suggested,Useraction,SuggestedUsers}) => {
    
    const history = useHistory();    
    
    return (
        <div className={"suggestedfollowing" +(suggested===true?" applyAditionalStyle":"")}>
            <div className="title">{suggested?"SUGGESTED USER":"WHO TO FOLLOW"}</div>
            {SuggestedUsers.map(user =>
                <div className="suggested_card" key={user._id}>
                    <div className="suggested_avatar" onClick={() => history.push(user.username)}>
                        <Avatar src={user.avatar} alt="" style={{zIndex:"-1"}}/>
                    </div>
                    <div className="suggested_info" onClick={() => history.push(user.username)}>
                        <div className="suggested_username">
                            {user.username}
                        </div>
                        <div className="suggested_des">
                            {user.bio||"This user has no bio"}
                        </div>
                    </div>
                    <div className="follow_btn" onClick={()=>Useraction({payload:{uid:user._id},type:"togglefollowpeople"})}>
                        {user.isFollowing?"Following":"Follow"}
                    </div>
                </div>)}
        </div>
    )
}

export default Suggestedfollowing;