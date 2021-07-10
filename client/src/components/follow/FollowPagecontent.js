import React, { useEffect} from "react";
import './Follow.css';
import Avatar from "@material-ui/core/Avatar";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { useDispatch, useSelector } from "react-redux";
import { FetchSuggestedUser, FollowUnfollowSuggestedUser } from "../../reducers/SuggestedUser";
import { FetchsuggestedTopic, FollowUnfollowSuggestedTopic } from "../../reducers/getSuggestedTopic";

import { NotifyUser } from "../../utils/NotifyUser";
import { useToasts } from "react-toast-notifications";
import { togglefollowPeople, togglefollowTopic } from "../../reducers/user";
import { useHistory } from "react-router-dom";

export const UserCard = ({people,Useraction,history,isMe})=>{
    return <div className="usercard" style={{marginBottom:"30px",justifyContent:"space-between"}}>
        <div style={{display:"flex"}}><div className="avatar" onClick={()=>history.push(`/${people.username}`)}>
            <Avatar src={people.avatar} alt=""/>
        </div>
        <div className="userinfo" onClick={()=>history.push(`/${people.username}`)}>
            <div className="username">{people.username}</div>
            <div className="description">{people.bio||"This user prefers to keep no bio"}</div>
        </div>
        </div>
        {!isMe&&<div className="actionbtn" onClick={()=>Useraction({type:"togglefollowpeople",payload:{uid:people._id}})}>
            {people.isFollowing?<span className="bold">Following</span>:<span>Follow</span>}
        </div>
        }
    </div>
}

export const TopicCard = ({topic,Useraction,history})=>{
    return (
        <div className="topicbox" style={{cursor:"pointer"}}>
            <div className="topicheader">
                <div className="topicfollowbtn" onClick={()=>Useraction({type:"togglefollowtopic",payload:topic.name})}>
                    {topic.isFollowing?<CheckBoxIcon color="primary"/>:<AddCircleOutlineIcon/>}
                </div>
                <div className="topicname">
                    {topic.name}
                </div>
            </div>
            <div className="topic_image" style={{backgroundImage:`url(${topic.cover})`}} onClick={()=>history.push(`/topic/${topic.name}`)}>

            </div>

        </div>
    )
}

const FollowPagecontent = ({tabstate})=>{    

    const {isFetchingSuggestedUsers,SuggestedUsers} = useSelector((state)=>state.suggesteduser);
    const {isfetchingsuggestedtopic,suggestedtopics,currIndex2} =useSelector((state)=>state.suggestedtopic);
    const {data} = useSelector((state)=>state.user);
    const history = useHistory();
    const dispatch = useDispatch();
    const {addToast} = useToasts();
    
    const Useraction = ({type,payload})=>{
        if(!data){
            history.push("/signin");
            return;
        }
        switch(type){
            case "togglefollowpeople":
                dispatch(togglefollowPeople({payload,callback:function(res,msg){
                    if(res){
                        dispatch(FollowUnfollowSuggestedUser(payload.uid));
                    }
                    else{
                        NotifyUser({content:msg,type:"error",addToast});
                    }
                }}));
                break;
            case "togglefollowtopic":
                dispatch(togglefollowTopic({payload,callback:function(res,msg){
                    if(res){
                        dispatch(FollowUnfollowSuggestedTopic(payload));
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

    const fetchData = ()=>{
        if(tabstate===0&&isFetchingSuggestedUsers){
            dispatch(FetchSuggestedUser({limit:20}));
        }
        if(tabstate===1&&isfetchingsuggestedtopic){
            dispatch(FetchsuggestedTopic({currIndex2}));
        }
    }
    useEffect(()=>{
        if(tabstate===0&&isFetchingSuggestedUsers){
            dispatch(FetchSuggestedUser({limit:20}));
        }
        if(tabstate===1&&isfetchingsuggestedtopic){
            dispatch(FetchsuggestedTopic({currIndex2}));
        }
    },[tabstate,isFetchingSuggestedUsers,isfetchingsuggestedtopic,currIndex2,dispatch]);

    return <div className="followtabcontent">{
        tabstate===0&&(
            SuggestedUsers.map(people=><UserCard people={people} Useraction={Useraction} history={history} isMe={data?.username===people.username}/>)
        )        
    }
    {tabstate===1&&<h3 style={{marginTop:"-20px",marginBottom:"0px"}}>Topic you should follow</h3>}
    <div className="content_2">
        
    {
        tabstate===1&&(
            suggestedtopics.map(topic=><TopicCard topic={topic} Useraction={Useraction} history={history}/>)
        )
    }
    </div>
    </div>
}
export default FollowPagecontent;