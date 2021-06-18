import React ,{useState} from "react";
import { useHistory } from "react-router";
import Article from "./Article";

const ReadingList = ()=>{
    const [loading,setLoading] = React.useState(false);
    const history = useHistory();
    const [data,setData] = useState([{author:{avatar:"https://kkleap.github.io/assets/default.jpg",name:"kanhaiya"},header:"Can anyone leave this home?",description:"Hello this story is about something ...",publishDate:"June 14,2000",readingTime:"5 min",isSaved:true,image:"https://miro.medium.com/fit/c/200/134/1*tHD954Dso7IdwZ1WqdTG7g.png"}]);
    if(loading){
        return (
            <div className="recent_read">
                <span className="title">RECENTLY READ</span>                
            </div>
        )
    }
    return (
        <div className="recent_read">
            <span className="title">RECENTLY READ</span>
            {data.map(article=><Article article={article} short={true}/>)}
        </div>
    )
}

export default ReadingList;