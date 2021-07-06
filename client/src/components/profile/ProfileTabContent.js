import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Fetchfollowers } from "../../reducers/getFollowers";
import { Fetchfollowingpeople } from "../../reducers/getFollowingpeople";
import { FetchLikedstory } from "../../reducers/getLikedStories";
import { FetchMystory } from "../../reducers/getMyStories";
import { FetchSavedStory } from "../../reducers/getSavedStory";
import { FetchProfile } from "../../reducers/Profile";
import { FetchreadingList } from "../../reducers/ReadingList";
import { UserCard } from "../follow/FollowPagecontent";
import Article from "../home/Article";




const ProfileTabContent = ({profile,tabstate})=>{
    const {Profile,isFetchingProfile} = useSelector((state)=>state.profile);
    const {isFetchingfollower,Followers,curr2Index} = useSelector((state)=>state.followers);
    const {isFetchingfollowing,Followingpeople,currIndex} = useSelector((state)=>state.followingpeople);
    const {isFetchingMyStories,currindex,Mystories} = useSelector((state)=>state.Mystories);
    const {isFetchingSaved,SavedStories,curr5Index} = useSelector((state)=>state.SavedStory);
    const {isFetchingLiked,Likedstories,curr4Index} = useSelector((state)=>state.likedstory);
    const {isFetchingreadingList,readingList,curr3Index} = useSelector((state)=>state.readingList);

    const dispatch = useDispatch();
    const {user} = useParams();

    useEffect(()=>{
        fetchData({type:"profile"});//initially fetch basic profile info
    },[])

    const fetchData = ({type})=>{
        switch(type){
            case "profile":
                isFetchingProfile&&dispatch(FetchProfile({user}));
                break;
            case "followers":
                isFetchingfollower&&dispatch(Fetchfollowers({curr2Index,user}));
                break;
            case "following":
                isFetchingfollowing&&dispatch(Fetchfollowingpeople({curr3Index,user}));
                break;
            case "mystory":
                isFetchingMyStories&&dispatch(FetchMystory({currindex,user}));
                break;
            case "savedstory":
                isFetchingSaved&&dispatch(FetchSavedStory({curr5Index,user}));
                break;
            case "likedstory":
                isFetchingLiked&&dispatch(FetchLikedstory({curr4Index,user}));
                break;
            case "readinglist":
                isFetchingreadingList&&dispatch(FetchreadingList({curr3Index,user}));
                break;
            default:
                break;
        }
    }
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