import React,{useEffect} from "react";
import ProfileTabContent from "../components/profile/ProfileTabContent";
import deffault from "../assets/cover.png";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Fetchfollowers, FollowUnfollowStatus } from "../reducers/getFollowers";
import { Fetchfollowingpeople, FollowUnfollowStatusInAlreadyFollowing } from "../reducers/getFollowingpeople";
import { FetchLikedstory, SaveUnsaveLikedStory } from "../reducers/getLikedStories";
import { FetchMystory, SaveUnsaveMyStory } from "../reducers/getMyStories";
import { FetchSavedStory, saveUnsaveInSavedList } from "../reducers/getSavedStory";
import { clearProfile, FetchProfile, FollowUnfollowInProfile } from "../reducers/Profile";
import { FetchreadingList, SaveUnsaveReadStory } from "../reducers/ReadingList";
import { NotifyUser } from "../utils/NotifyUser";
import { togglefollowPeople, togglesaveUserStory } from "../reducers/user";
import { useToasts } from "react-toast-notifications";
import PermIdentityIcon from '@material-ui/icons/PermIdentity';

const Profile = ()=>{        

    const [tabstate,setTabState] = React.useState(2);

    const {Profile} = useSelector((state)=>state.profile);
    const {isFetchingfollower,Followers,curr2Index} = useSelector((state)=>state.followers);
    const {isFetchingfollowing,Followingpeople,currIndex} = useSelector((state)=>state.followingpeople);
    const {isFetchingMyStories,currindex,Mystories} = useSelector((state)=>state.Mystories);
    const {isFetchingSaved,SavedStories,curr5Index} = useSelector((state)=>state.SavedStory);
    const {isFetchingLiked,Likedstories,curr4Index} = useSelector((state)=>state.likedstory);
    const {isFetchingreadingList,readingList,curr3Index} = useSelector((state)=>state.readingList);

    const dispatch = useDispatch();
    const {user} = useParams();
    const {addToast} = useToasts();

    useEffect(()=>{
        fetchData({type:"profile"});//initially fetch basic profile info
        return ()=>{
            dispatch(clearProfile());
        }
    },[])

    const fetchData = ({type})=>{
        switch(type){
            case "profile":
                dispatch(FetchProfile({user}));
                break;
            case "followers":
                isFetchingfollower&&dispatch(Fetchfollowers({curr2Index,user}));
                break;
            case "following":
                isFetchingfollowing&&dispatch(Fetchfollowingpeople({currIndex,user}));
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

    const Useraction = ({type,payload})=>{
        switch(type){
            case "togglefollowpeople":
                dispatch(togglefollowPeople({payload,callback:function(res,msg){
                    if(res){
                        dispatch(FollowUnfollowInProfile(payload.uid));
                        dispatch(FollowUnfollowStatus(payload.uid));
                        dispatch(FollowUnfollowStatusInAlreadyFollowing(payload.uid))
                    }
                    else{
                        NotifyUser({content:msg,type:"error",addToast});
                    }
                }}));
                break;
            case "togglesavestory":
                dispatch(togglesaveUserStory({payload,callback:function(res,msg){
                    if(res){
                        dispatch(SaveUnsaveReadStory(payload));
                        dispatch(SaveUnsaveMyStory(payload));   
                        dispatch(SaveUnsaveLikedStory(payload));
                        dispatch(saveUnsaveInSavedList(payload));                                     
                    }
                    else{
                        NotifyUser({content:msg,type:"error",addToast});
                    }
                }}))
                break;
            default:
                break;
        }
    }

    return (
    <div className="profile_page">
        {(Profile&&Profile.cover)?(<div className="profile_header" style={{backgroundImage:`url(${Profile.cover})`}}>
            <div style={{width: "100%",height: "100%",background: "#ffffff66"}}>
                <h2>{Profile?.username}</h2>
            </div> </div>):
            (<div className="profile_header" style={{backgroundImage:`url(${deffault})`}}>
            <div style={{width: "100%",height: "100%",background: "#ffffff66"}}>
                <h2>{Profile?.username}</h2>
            </div>
        </div>)}
       
        <div className="profile_tab">
            {!Profile?.isMe?<div className="actionbtn" onClick={()=>Useraction({type:"togglefollowpeople",payload:{uid:Profile?._id}})}>
                {Profile?.isFollowing?<span className="bold">Following</span>:<span>Follow</span>}
            </div>:<div className="actionbtn">
                <span className="bold"><PermIdentityIcon/>&nbsp;Edit</span>
            </div>
        }
            <div className="p_tabs">
            <div className={tabstate===2?"selected-tab":""} onClick={()=>{fetchData({type:"profile"});setTabState(2)}}>
                About
            </div>
            <div className={tabstate===0?"selected-tab":""} onClick={()=>{fetchData({type:"mystory"});setTabState(0)}}>
                Stories
            </div>
            <div className={tabstate===1?"selected-tab":""} onClick={()=>{fetchData({type:"followers"});setTabState(1)}}>
                Followers
            </div>
            <div className={tabstate===3?"selected-tab":""} onClick={()=>{fetchData({type:"following"});setTabState(3)}}>
                Following
            </div>
            {(Profile?.isMe)&&(
                <>
                    <div className={tabstate===4?"selected-tab":""} onClick={()=>{fetchData({type:"readinglist"});setTabState(4)}}>
                    Read
                    </div>
                    <div className={tabstate===5?"selected-tab":""} onClick={()=>{fetchData({type:"likedstory"});setTabState(5)}}>
                    Liked
                    </div>
                    <div className={tabstate===6?"selected-tab":""} onClick={()=>{fetchData({type:"savedstory"});setTabState(6)}}>
                    Saved
                    </div>
                </>
            )}
            </div>
            
        </div>
        <ProfileTabContent tabstate={tabstate} profile={Profile} Followers={Followers} Followingpeople={Followingpeople} Useraction={Useraction} Mystories={Mystories} SavedStories={SavedStories} Likedstories={Likedstories} readingList={readingList}/>
    </div>
    )
}

export default Profile;