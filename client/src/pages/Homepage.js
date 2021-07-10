import React,{useEffect} from "react";
import { Redirect } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from 'react-toast-notifications'
import Article from "../components/home/Article";
import Recommendedtopic from "../components/home/Recommendedtopic";
import Suggestedfollowing from "../components/home/Suggestedfollowing";
import ReadingList from "../components/home/ReadingList";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { useHistory } from "react-router-dom";
import { NotifyUser } from "../utils/NotifyUser";
import { FetchExplored, SaveUnsaveStoryInExplored } from "../reducers/Explored";
import { FetchTrendingTopic } from "../reducers/TrendingTopic";
import { FetchreadingList } from "../reducers/ReadingList";
import { FetchSuggestedUser, FollowUnfollowSuggestedUser } from "../reducers/SuggestedUser";
import { FetchFollowingStory, SaveUnsaveStory } from "../reducers/Following";
import { togglefollowPeople, togglesaveUserStory } from "../reducers/user";




const Homepage = ()=>{
    const [selected,setSelected] = React.useState(0);
    const history = useHistory();
    const dispatch = useDispatch();
    const {addToast} = useToasts();
    const {exploredstories,currIndex,isFetching} = useSelector((state)=>state.explore);
    const {data} = useSelector((state)=>state.user);
    const {isFetchingfollowingstories,Followingstories,currindex} = useSelector((state)=>state.followingstory);
    const {trendingtopics} = useSelector((state)=>state.trendingtopic);
    const {curr5Index,readingList} = useSelector((state)=>state.readingList);
    const {SuggestedUsers} = useSelector((state)=>state.suggesteduser);

    useEffect(()=>{
        isFetching&&dispatch(FetchExplored({currIndex}));
        dispatch(FetchTrendingTopic({}));
        data?.username&&dispatch(FetchreadingList({curr5Index,uid:data.username}));
        dispatch(FetchSuggestedUser({limit:5}));
        console.log(exploredstories,currIndex,isFetching);
    },[])       
    
    
    const fetchArticle =({type})=>{
       // NotifyUser({type:"success",content:"Welcome to the rockingblogger",addToast})
       //console.log(Followingstories);
        switch(type){
            case 0:                     
                isFetching&&dispatch(FetchExplored({currIndex}));   
                setSelected(0);        
                return;
            case 1:                
                isFetchingfollowingstories&&dispatch(FetchFollowingStory({currIndex:currindex}));
                setSelected(1);
                return;
            default:
                break;
        }
    }

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
            case "togglesavestory":
                dispatch(togglesaveUserStory({payload,callback:function(res,msg){
                    if(res){
                        dispatch(SaveUnsaveStoryInExplored(payload));
                        dispatch(SaveUnsaveStory(payload));
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

    return <div className="main">
        <div className="main_component_home">
            <div onClick={()=>history.push("/follow-tag-or-people")} className="follow_people_tag"><AddCircleIcon/> Keep up with the latest update in any topic</div>
            <div className="main_tabs">
                <div className={"tab"+(selected===0?" selected-tab":"")} onClick={()=>fetchArticle({type:0})}>
                    Explore
                </div>
                <div className={"tab"+(selected===1?" selected-tab":"")} onClick={()=>fetchArticle({type:1})}>
                    Following
                </div>
            </div>
            {
                selected===0&&exploredstories.map(article=><Article article={article} key={article._id} Useraction={Useraction}/>)
            }
            {
                selected===1&&(data?Followingstories.map(article=><Article article={article} key={article._id} Useraction={Useraction}/>):<Redirect to="/signin"/>)
            }
        </div>
        <div className="main_right">
            <Recommendedtopic trendingtopics={trendingtopics}/>
            <Suggestedfollowing Useraction={Useraction} SuggestedUsers={SuggestedUsers}/>
            {data&&readingList&&readingList.length>0&&<ReadingList Useraction={Useraction} readingList={readingList}/>}
        </div>
    </div>
}

export default Homepage;