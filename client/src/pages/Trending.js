import React from "react";
import Article from "../components/home/Article";
import './page.css';
import Suggestedfollowing from "../components/home/Suggestedfollowing";

//Search for trending stories on blogger


const Trending = ()=>{   
    const [trendingArticle,setArticle] = React.useState([{ author: { avatar: "https://kkleap.github.io/assets/default.jpg", name: "kanhaiya" }, header: "Can anyone leave this home?", description: "Hello this story is about something ...", publishDate: "June 14,2000", readingTime: "5 min", isSaved: true, image: "https://miro.medium.com/fit/c/200/134/1*tHD954Dso7IdwZ1WqdTG7g.png" }, { author: { avatar: "https://kkleap.github.io/assets/default.jpg", name: "kanhaiya" }, header: "Can anyone leave this home?", description: "Hello this story is about something ...", publishDate: "June 14,2000", readingTime: "5 min", isSaved: false, image: "https://miro.medium.com/fit/c/200/134/1*tHD954Dso7IdwZ1WqdTG7g.png" }]); 

    const [suggestedUser,setSuggestedUser] = React.useState([]);
    
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