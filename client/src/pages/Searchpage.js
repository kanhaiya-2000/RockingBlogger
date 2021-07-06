import React from "react";
import { useParams } from "react-router-dom";
import FollowTabComponent from "../components/follow/FollowTabComponent";
import SearchpageContent from "../components/search/SearchpageContent";
import './page.css';

//Search for people and topic matching on blogger


const Searchpage = ()=>{
    const [tabstate,setState] = React.useState(0);
    const {term} = useParams();
    
    const changeTab = (switchtoTab)=>{
        setState(switchtoTab);
    }
    return <div className="searchpage">
        <h1>Result matching your Search</h1>
        <p>Here are people, and stories that match your search</p>
        <FollowTabComponent tabstate={tabstate} changeTab={changeTab} secondTabName={"stories"}/>
        <SearchpageContent tabstate={tabstate} term={term}/>
        
    </div>
}



export default Searchpage;