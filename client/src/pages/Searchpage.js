import React,{useEffect} from "react";

import { useHistory, useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import FollowTabComponent from "../components/follow/FollowTabComponent";
import SearchpageContent from "../components/search/SearchpageContent";
import { ClearSearchPeople, FollowUnfollowSearchPeople } from "../reducers/getSearchPeople";
import { ClearSearchStory, SaveUnsaveSearchStory } from "../reducers/SearchStory";
import { togglesaveStory } from "../reducers/story";
import { togglefollowPeople, togglesaveUserStory } from "../reducers/user";
import { NotifyUser } from "../utils/NotifyUser";
import './page.css';
import { useDispatch, useSelector } from "react-redux";
import { FetchSearchedstory } from "../reducers/SearchStory";
import { FetchSearchedUser } from "../reducers/getSearchPeople";

//Search for people and topic matching on blogger


const Searchpage = ()=>{
    const [tabstate,setState] = React.useState(0);
    const {data} = useSelector((state)=>state.user);
    const {term} = useParams();
    const history = useHistory();
    const {addToast} = useToasts();
    const dispatch = useDispatch();
    const changeTab = (switchtoTab)=>{
        if(switchtoTab===0){
            fetchData({type:"user"})
        }
        else{
            fetchData({type:"story"})
        }
        setState(switchtoTab);
    }

  
    const {isFetching, SearchedUsers,currIndex} = useSelector((state)=>state.searchpeople);
    const {isFetchingStory,Searchedstories,curr2Index} = useSelector((state)=>state.searchstory);

    

    const fetchData = ({type})=>{
        switch(type){
            case "user":
                isFetching&&dispatch(FetchSearchedUser({term,currIndex}));
                break;
            case "story":
                isFetchingStory&&dispatch(FetchSearchedstory({curr2Index,term}));
                break;
            default:
                break;
        }
        
    }
    
    useEffect(()=>{
        if(tabstate===1){
            console.log(isFetchingStory);
            dispatch(FetchSearchedstory({term,curr2Index}));
        }
        if(tabstate===0){
            console.log(isFetching);
            setTimeout(()=>
                dispatch(FetchSearchedUser({currIndex:0,term}))
            ,1000)
        }
        return()=>{
            dispatch(ClearSearchPeople());
            dispatch(ClearSearchStory());
        }
        //console.log(currIndex,tabstate);
    },[]);
    //const addToast = useToasts();
    const Useraction = ({type,payload})=>{
        if(!data){
            history.push("/signin");
            return;
        }
        switch(type){
            case "togglefollowpeople":
                dispatch(togglefollowPeople({payload,callback:function(res,msg){
                    if(res){
                        dispatch(FollowUnfollowSearchPeople(payload.uid));
                    }
                    else{
                        NotifyUser({content:msg,type:"error",addToast});
                    }
                }}));
                break;
            case "togglesavestory":
                dispatch(togglesaveUserStory({payload,callback:function(res,msg){
                    if(res){
                        dispatch(SaveUnsaveSearchStory(payload));
                        dispatch(togglesaveStory(payload));
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

    return <div className="searchpage">
        <h1>Result matching your Search</h1>
        <p>Here are people, and stories that match your search</p>
        <FollowTabComponent tabstate={tabstate} changeTab={changeTab} secondTabName={"stories"} />
        <SearchpageContent tabstate={tabstate} term={term} Useraction={Useraction} Searchedstories={Searchedstories} SearchedUsers={SearchedUsers}/>
        
    </div>
}



export default Searchpage;