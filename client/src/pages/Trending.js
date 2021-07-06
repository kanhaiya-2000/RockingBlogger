import React, { useEffect } from "react";
import Article from "../components/home/Article";
import './page.css';
import { useDispatch, useSelector } from "react-redux";
import Suggestedfollowing from "../components/home/Suggestedfollowing";
import { FetchTrending } from "../reducers/TrendingStory";
import { FetchSuggestedUser } from "../reducers/SuggestedUser";

//Search for trending stories on blogger


const Trending = ()=>{   
    const [trendingArticle,setArticle] = React.useState([{ author: { avatar: "https://kkleap.github.io/assets/default.jpg", name: "kanhaiya" }, header: "Can anyone leave this home?", description: "Hello this story is about something ...", publishDate: "June 14,2000", readingTime: "5 min", isSaved: true, image: "https://miro.medium.com/fit/c/200/134/1*tHD954Dso7IdwZ1WqdTG7g.png" }, { author: { avatar: "https://kkleap.github.io/assets/default.jpg", name: "kanhaiya" }, header: "Can anyone leave this home?", description: "Hello this story is about something ...", publishDate: "June 14,2000", readingTime: "5 min", isSaved: false, image: "https://miro.medium.com/fit/c/200/134/1*tHD954Dso7IdwZ1WqdTG7g.png" }]); 

    const [suggestedUser,setSuggestedUser] = React.useState([]);
    const dispatch = useDispatch();

    const {isFetching,Trendingstories,currIndex} = useSelector((state)=>state.trendingstory);
    const {isFetchingSuggestedUsers,SuggestedUsers} = useSelector((state)=>state.suggesteduser);

    const fetchData = ()=>{
        if(isFetching)
            dispatch(FetchTrending({currIndex}));
    }

    useEffect(()=>{
        isFetching&&dispatch(FetchTrending({currIndex}));
        isFetchingSuggestedUsers&&dispatch(FetchSuggestedUser({limit:10}));
    },[isFetching,isFetchingSuggestedUsers,currIndex,dispatch])
    
    return <div className="searchpage trending">
        <h1>Trending stories</h1>
        <p>Here are the stories that are on lit on blogger</p>        
        <div className="trendingwrapper">
            {
                trendingArticle.map(article=><Article article={article} noOption={true}/>)
            }
        </div>
        <Suggestedfollowing suggested={true} />
        
    </div>
}



export default Trending;