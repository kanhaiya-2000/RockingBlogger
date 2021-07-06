import React, { useEffect, useState } from "react";
import './Follow.css';
import Avatar from "@material-ui/core/Avatar";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { useDispatch, useSelector } from "react-redux";
import { FetchSuggestedUser } from "../../reducers/SuggestedUser";
import { FetchsuggestedTopic } from "../../reducers/getSuggestedTopic";

export const UserCard = ({people})=>{
    return <div className="usercard">
        <div className="avatar">
            <Avatar src={people.avatar} alt=""/>
        </div>
        <div className="userinfo">
            <div className="username">{people.username}</div>
            <div className="description">{people.description}</div>
        </div>
        <div className="actionbtn">
            {people.isFollowing?<span className="bold">Following</span>:<span>Follow</span>}
        </div>
    </div>
}

export const TopicCard = ({topic})=>{
    return (
        <div className="topicbox">
            <div className="topicheader">
                <div className="topicfollowbtn">
                    {topic.isFollowing?<CheckBoxIcon color="primary"/>:<AddCircleOutlineIcon/>}
                </div>
                <div className="topicname">
                    {topic.name}
                </div>
            </div>
            <div className="topic_image" style={{backgroundImage:`url(${topic.coverImage})`}}>

            </div>

        </div>
    )
}

const FollowPagecontent = ({tabstate})=>{
    const [suggestedPeople,setPeople] = useState([{avatar:"https://cdn-images-1.medium.com/fit/c/60/60/1*vX3DADUFGFyyeoapA_MG6A.jpeg",username:"Vishnu*s Virtues",description:"Let’s achieve our writing dreams together | Topics: writing and relationships | Californian, Malaysian| 750K+ Med views. Blog: https://www.vishnusvirtues.com/",isFollowing:true},{avatar:"https://cdn-images-1.medium.com/fit/c/60/60/1*vX3DADUFGFyyeoapA_MG6A.jpeg",username:"Vishnu*s Virtues",description:"Let’s achieve our writing dreams together | Topics: writing and relationships | Californian, Malaysian| 750K+ Med views. Blog: https://www.vishnusvirtues.com/",isFollowing:true}]);
    const [suggestedTopics,setTopics] = useState([{coverImage:"https://cdn-images-1.medium.com/fit/c/280/180/1*H2blBoEmzkSusI_a4Bk0dg@2x.jpeg",name:"chat",isFollowing:false},{coverImage:"https://cdn-images-1.medium.com/fit/c/280/180/1*H2blBoEmzkSusI_a4Bk0dg@2x.jpeg",name:"chat",isFollowing:true}]);

    const {isFetchingSuggestedUsers,SuggestedUsers} = useSelector((state)=>state.suggesteduser);
    const {isfetchingsuggestedtopic,suggestedtopics,currIndex2} =useSelector((state)=>state.suggestedtopic);
    const dispatch = useDispatch();
    

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
            suggestedPeople.map(people=><UserCard people={people}/>)
        )        
    }
    {tabstate===1&&<h3 style={{marginTop:"-20px",marginBottom:"0px"}}>Topic you should follow</h3>}
    <div className="content_2">
        
    {
        tabstate===1&&(
            suggestedTopics.map(topic=><TopicCard topic={topic}/>)
        )
    }
    </div>
    </div>
}
export default FollowPagecontent;