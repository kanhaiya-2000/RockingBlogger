import React,{useEffect} from "react";
import { UserCard } from "../follow/FollowPagecontent";
import Article from "../home/Article";
import '../follow/Follow.css';
import { useDispatch, useSelector } from "react-redux";
import { FetchSearchedstory } from "../../reducers/SearchStory";
import { FetchSearchedUser } from "../../reducers/getSearchPeople";


const SearchpageContent = ({tabstate,term})=>{

    const dispatch = useDispatch();
    const {isFetching, SearchedUsers,currIndex} = useSelector((state)=>state.searchpeople);
    const {isFetchingStory,Searchedstories,curr2Index} = useSelector((state)=>state.searchstory);

    

    const fetchData = ({})=>{
        
        
    }
    useEffect(()=>{
        if(tabstate===1&&isFetchingStory){
            console.log(isFetchingStory);
            dispatch(FetchSearchedstory({term,curr2Index}));
        }
        if(tabstate===0&&isFetching){
            console.log(isFetching);
            dispatch(FetchSearchedUser({currIndex,term}));
        }
        //console.log(currIndex,tabstate);
    },[tabstate,dispatch,term,currIndex,curr2Index]);
    const [people,setPeople] = React.useState([{avatar:"https://cdn-images-1.medium.com/fit/c/60/60/1*vX3DADUFGFyyeoapA_MG6A.jpeg",username:"Vishnu*s Virtues",description:"Let’s achieve our writing dreams together | Topics: writing and relationships | Californian, Malaysian| 750K+ Med views. Blog: https://www.vishnusvirtues.com/",isFollowing:true},{avatar:"https://cdn-images-1.medium.com/fit/c/60/60/1*vX3DADUFGFyyeoapA_MG6A.jpeg",username:"Vishnu*s Virtues",description:"Let’s achieve our writing dreams together | Topics: writing and relationships | Californian, Malaysian| 750K+ Med views. Blog: https://www.vishnusvirtues.com/",isFollowing:false}]);

    const [stories,setStories] = React.useState([{author:{avatar:"https://kkleap.github.io/assets/default.jpg",name:"kanhaiya"},header:"Can anyone leave this home?",description:"Hello this story is about something ...",publishDate:"June 14,2000",readingTime:"5 min",isSaved:true,image:"https://miro.medium.com/fit/c/200/134/1*tHD954Dso7IdwZ1WqdTG7g.png"},{author:{avatar:"https://kkleap.github.io/assets/default.jpg",name:"kanhaiya"},header:"Can anyone leave this home?",description:"Hello this story is about something ...",publishDate:"June 14,2000",readingTime:"5 min",isSaved:false,image:"https://miro.medium.com/fit/c/200/134/1*tHD954Dso7IdwZ1WqdTG7g.png"}]);
    return (
        <div className="searchpagecontent">
            {tabstate===0&&people.map(user=><UserCard people={user}/>)}
            {tabstate===1&&stories.map(story=><Article short={false} article={story}/>)}
        </div>
        
    )
}
export default SearchpageContent;