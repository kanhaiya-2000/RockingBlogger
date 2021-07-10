import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Article from "../components/home/Article";
import { FetchTopicdetail, togglefollowTopicIn } from "../reducers/getTopicDetail";
import { Fetchpopularstories, SaveUnsavePopularStory } from "../reducers/getPopularStories";
import { FetchlatestStory, SaveUnsaveLatestStory } from "../reducers/getLatestStories";
import { togglefollowTopic, togglesaveUserStory } from "../reducers/user";
import { NotifyUser } from "../utils/NotifyUser";
import { useToasts } from "react-toast-notifications";


const TopicPage = () => {    
    const { topicname } = useParams();
    const dispatch = useDispatch();
    const {topicDetail} = useSelector((state)=>state.Topicdetail);
    const {latestStories} = useSelector((state)=>state.latest);
    const {popularStories} = useSelector((state)=>state.popular);
    const {data} = useSelector((state)=>state.user);
    const history = useHistory();

    useEffect(()=>{
        //console.log(topicname);
        const callback = function(res){
            console.log(res);
            if(res){
                dispatch(Fetchpopularstories({limit:10,topic:topicname}));
                dispatch(FetchlatestStory({limit:10,topic:topicname}));  
            }
        }
        dispatch(FetchTopicdetail({topicname:topicname,callback}));
              
    },[])

    const {addToast} = useToasts();

    const Useraction = ({type,payload})=>{
        if(!data){
            history.push("/signin");
            return;
        }
        console.log(type,payload);
        switch(type){
            case "togglefollowtopic":
                dispatch(togglefollowTopic({payload,callback:function(res,msg){
                    if(res){
                        dispatch(togglefollowTopicIn(payload))
                    }
                    else{
                        NotifyUser({content:msg,type:"error",addToast});
                    }
                }}));
                break;
            case "togglesavestory":
                dispatch(togglesaveUserStory({payload,callback:function(res,msg){
                    if(res){
                        console.log(payload);
                        dispatch(SaveUnsaveLatestStory(payload));
                        dispatch(SaveUnsavePopularStory(payload));
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
        <div className="topicpage">
            <div className="left_side">
                <div className="topicimage" style={{ backgroundImage: `url(${topicDetail.cover})` }}>
                    <div className="topic_intro_mobile">
                        <div className="topic_name">
                            <div style={{ fontSize: "22px" }}>
                                {topicDetail.name}
                            </div>
                            <div onClick={()=>Useraction({type:"togglefollowtopic",payload:topicDetail.name})} className="follow_btn">
                                <span className="action_btn" >
                                    {topicDetail.isFollowing ? "Following" : "Follow"}
                                </span>
                            </div>
                        </div>
                        <div className="topic_des">
                            {topicDetail.description}
                        </div>
                    </div>
                </div>
                <div className="latest_article">
                    <div className="parameter">LATEST ARTICLE</div>
                    {latestStories.map(article => <Article key={Math.random()} article={article} Useraction={Useraction}/>)}
                </div>
            </div>
            <div className="right_side">
                <div className="topic_intro">
                    <div className="topic_name">
                        <div style={{ fontSize: "22px" }}>
                            {topicDetail.name}
                        </div>
                        <div className="follow_btn" onClick={()=>Useraction({type:"togglefollowtopic",payload:topicDetail.name})}>
                            <span className="action_btn">
                                {topicDetail.isFollowing ? "Following" : "Follow"}
                            </span>
                        </div>
                    </div>
                    <div className="topic_des">
                        {topicDetail.description}
                    </div>
                </div>
                <div className="related_topic">
                    <div className="parameter">RELATED TOPIC</div>
                    {topicDetail?.relatedTopics?.map(topic => <div className="rel_topic" onClick={()=>history.push(`/topic/${topic}`)}>{topic}</div>)}
                </div>
                <div className="popular_article_in_topic">
                    <div className="parameter">POPULAR ARTICLE</div>
                    {popularStories.map(article => <Article key={Math.random()} article={article} Useraction={Useraction}/>)}
                </div>
            </div>

        </div>);
}

export default TopicPage;