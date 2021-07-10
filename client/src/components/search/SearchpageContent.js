import React from "react";
import { UserCard } from "../follow/FollowPagecontent";
import Article from "../home/Article";
import '../follow/Follow.css';
import { useHistory } from "react-router-dom";


const SearchpageContent = ({tabstate,term,Useraction,SearchedUsers,Searchedstories})=>{

    const history = useHistory();
    
    return (
        <div className="searchpagecontent">
            {tabstate===0&&SearchedUsers.map(user=><UserCard people={user} Useraction={Useraction} history={history} key={user._id} isMe={JSON.parse(localStorage.getItem("user"))?.username===user?.username}/>)}
            {tabstate===1&&Searchedstories.map(story=><Article short={false} article={story} Useraction={Useraction} key={story._id}/>)}
        </div>
        
    )
}
export default SearchpageContent;