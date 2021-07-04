import React from "react";
import { UserCard } from "../follow/FollowPagecontent";
import Article from "../home/Article";




const ProfileTabContent = ({profile,tabstate})=>{
    return (
        <div className={"profile_tab_content"+(tabstate===0?" additional_style":"")}>
            {tabstate===0&&profile.stories.map(story=><Article article={story}/>)}
            {tabstate===1&&profile.followers.map(user=><UserCard people={user}/>)}
            {tabstate===3&&profile.followers.map(user=><UserCard people={user}/>)}
            {tabstate===2&&
                <div className="profile_about">
                    <div className="profile_content">
                        <h2> About {profile.username}</h2>
                        <div>{profile.about}</div>
                    </div>
                    <div className="profile_avatar">
                        <img src={profile.avatar} alt=""/>
                    </div>
                </div>}
        </div>
    )
}

export default ProfileTabContent;