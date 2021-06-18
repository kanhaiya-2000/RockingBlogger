import React from "react";
import { Redirect } from "react-router";
import Article from "../components/home/Article";
import Recommendedtopic from "../components/home/Recommendedtopic";
import Suggestedfollowing from "../components/home/Suggestedfollowing";
import ReadingList from "../components/home/ReadingList";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { useHistory } from "react-router-dom";


const Homepage = ()=>{
    const [selected,setSelected] = React.useState(0);
    const history = useHistory();
    const isAuthenticated = localStorage.getItem("user");
    const [articleType1,setArticleType1] = React.useState([{author:{avatar:"https://kkleap.github.io/assets/default.jpg",name:"kanhaiya"},header:"Can anyone leave this home?",description:"Hello this story is about something ...",publishDate:"June 14,2000",readingTime:"5 min",isSaved:true,image:"https://miro.medium.com/fit/c/200/134/1*tHD954Dso7IdwZ1WqdTG7g.png"}]);
    const [articleType2,setArticleType2] = React.useState([]);

    const fetchArticle =({type})=>{
        switch(type){
            case 0:
                setSelected(0);
                return;
            case 1:
                setSelected(1);
                return;
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
                selected===0&&articleType1.map(article=><Article article={article} key={article?._id}/>)
            }
            {
                selected===1&&(isAuthenticated?articleType2.map(article=><Article article={article} key={article?._id}/>):<Redirect to="/signin"/>)
            }
        </div>
        <div className="main_right">
            <Recommendedtopic/>
            <Suggestedfollowing/>
            {isAuthenticated&&<ReadingList/>}
        </div>
    </div>
}

export default Homepage;