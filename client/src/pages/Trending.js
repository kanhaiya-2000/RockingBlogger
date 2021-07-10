import React, { useEffect } from "react";
import Article from "../components/home/Article";
import './page.css';
import { useDispatch, useSelector } from "react-redux";
import Suggestedfollowing from "../components/home/Suggestedfollowing";
import { FetchTrending, SaveUnsaveTrendingStory } from "../reducers/TrendingStory";
import { FetchSuggestedUser, FollowUnfollowSuggestedUser } from "../reducers/SuggestedUser";
import { togglefollowPeople, togglesaveUserStory } from "../reducers/user";
import { NotifyUser } from "../utils/NotifyUser";
import { useToasts } from "react-toast-notifications";
import { useHistory } from "react-router-dom";

//Search for trending stories on blogger


const Trending = ()=>{    
    
    const dispatch = useDispatch();
    const history = useHistory();
    const {data} = useSelector((state)=>state.user);

    const {isFetching,Trendingstories,currIndex} = useSelector((state)=>state.trendingstory);
    const {isFetchingSuggestedUsers,SuggestedUsers} = useSelector((state)=>state.suggesteduser);

    const fetchData = ()=>{
        if(isFetching)
            dispatch(FetchTrending({currIndex}));
    }

    const {addToast} = useToasts();

    useEffect(()=>{
        fetchData();
        isFetchingSuggestedUsers&&dispatch(FetchSuggestedUser({limit:10}));
    },[])

    const Useraction = ({type,payload})=>{
        if(!data){
            NotifyUser({content:"Please login to continue further",error:true,addToast})
            history.push("/signin");
            return;
        }
        switch(type){
            case "togglefollowpeople":
                dispatch(togglefollowPeople({payload,callback:function(res,msg){
                    if(res){
                        dispatch(FollowUnfollowSuggestedUser(payload.uid))
                    }
                    else{
                        NotifyUser({content:msg,type:"error",addToast});
                    }
                }}));
                break;
            case "togglesavestory":
                dispatch(togglesaveUserStory({payload,callback:function(res,msg){
                    if(res){
                        dispatch(SaveUnsaveTrendingStory(payload));
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
    
    return <div className="searchpage trending">
        <h1>Trending stories</h1>
        <p>Here are the stories that are on lit on blogger</p>        
        <div className="trendingwrapper">
            {
                Trendingstories.map(article=><Article article={article} Useraction={Useraction} key={article._id}/>)
            }
        </div>
        <Suggestedfollowing suggested={true} Useraction={Useraction} SuggestedUsers={SuggestedUsers}/>
        
    </div>
}



export default Trending;