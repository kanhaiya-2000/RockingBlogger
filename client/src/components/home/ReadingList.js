import React from "react";

import Article from "./Article";

const ReadingList = ({Useraction,readingList})=>{   
    
    return (
        <div className="recent_read">
            <span className="title">RECENTLY READ</span>
            {readingList.map(article=><Article article={article} short={true} key={article._id}/>)}
        </div>
    )
}

export default ReadingList;