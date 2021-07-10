import React from "react";
import { useHistory } from "react-router-dom";

import { UserCard } from "../follow/FollowPagecontent";
import Article from "../home/Article";




const ProfileTabContent = ({profile,tabstate,Useraction,Likedstories,readingList,SavedStories,Mystories,Followingpeople,Followers})=>{


    const history = useHistory();
    
    return (
        <div className={"profile_tab_content"+(tabstate===0?" additional_style":"")}>
            {tabstate===0&&Mystories.map(story=><Article article={story} Useraction={Useraction} key={Math.random()}/>)}
            {tabstate===1&&Followers.map(user=><UserCard people={user} Useraction={Useraction} key={Math.random()} isMe={JSON.parse(localStorage.getItem("user"))?.username===user.username} history={history}/>)}
            {tabstate===3&&Followingpeople.map(user=><UserCard people={user} Useraction={Useraction} key={Math.random()} isMe={JSON.parse(localStorage.getItem("user"))?.username===user.username} history={history}/>)}
            {profile?.isMe&&<>
                {tabstate===4&&readingList.map(story=><Article article={story} Useraction={Useraction} key={Math.random()}/>)} 
                {
                    tabstate===5&&Likedstories.map(story=><Article article={story} Useraction={Useraction} key={Math.random()}/>)
                }
                {
                    tabstate===6&&SavedStories.map(story=><Article article={story} Useraction={Useraction} key={Math.random()}/>)
                }
            </>}
                {tabstate===2&&<div className="profile_about">
                    <div className="profile_content">
                        <h2> About {profile.username}</h2>
                        <div>{profile.about||"This user prefers to keep no bio"}</div>
                    </div>
                    {profile.avatar&&<div className="profile_avatar">
                        <img src={profile.avatar} alt=""/>
                    </div>
                    }
                </div>}
        </div>
    )
}

export default ProfileTabContent;