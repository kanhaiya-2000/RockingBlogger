import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import './Home.css';


const Suggestedfollowing = ({suggested}) => {
    const [loading, setLoading] = React.useState(false);
    const history = useHistory();
    const [data, setData] = useState([{url:"/",avatar:"https://miro.medium.com/fit/c/200/134/0*YWVJUCY3HXMHfDGz",username:"kk2000",bio:"Hello here!Are you happy?"}]);
    if (loading) {
        return (
            <div className={"suggestedfollowing" +(suggested===true?" applyAditionalStyle":"")}>
                <div className="title">{suggested?"SUGGESTED USER":"WHO TO FOLLOW"}</div>
            </div>
        )
    }
    return (
        <div className={"suggestedfollowing" +(suggested===true?" applyAditionalStyle":"")}>
            <div className="title">{suggested?"SUGGESTED USER":"WHO TO FOLLOW"}</div>
            {data.map(user =>
                <div className="suggested_card" onClick={() => history.push(user.url)}>
                    <div className="suggested_avatar">
                        <Avatar src={user.avatar} alt="" style={{zIndex:"-1"}}/>
                    </div>
                    <div className="suggested_info">
                        <div className="suggested_username">
                            {user.username}
                        </div>
                        <div className="suggested_des">
                            {user.bio}
                        </div>
                    </div>
                    <div className="follow_btn">
                        Follow
                    </div>
                </div>)}
        </div>
    )
}

export default Suggestedfollowing;