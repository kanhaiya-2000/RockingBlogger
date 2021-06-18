import React, { useEffect } from "react";
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const Article = ({article,short})=>{
    const [isBookmarked,setIsBookmarked] = React.useState(false);
    useEffect(()=>{
        setIsBookmarked(article?.isBookmarked);
    },[article]);
    
    
    return(
        <div style={{display:"flex",justifyContent:"space-between",width:"100%",alignItems:"center"}}>
        <div className={short?"article_comp":"article_comp_real"}>
            <div className="article_author">
                <img className="article_author_avatar" src={article.author.avatar} alt=""/>
                <span className="article_author_name">{article.author.name}</span>
            </div>
            <div className="article_header">{article.header}</div>
            <div className="article_short_des">{article.description}</div>
            <div className="article_info">
                <div className="article_left_info">
                    <div className="article_pb_date">{article.publishDate}</div>
                    <div className="article_expected_reading_time">{article.readingTime}</div>
                </div>
                <div className="article_right_info">
                    <div className="article_bkm_icon">{article.isSaved?<BookmarkIcon/>:<BookmarkBorderIcon/>}</div>
                    <div className="article_more_icon"><MoreVertIcon/></div>
                </div>
                
            </div>
        </div>
        {!short&&<div className="article_image"><img src={article.image} alt=""/></div>}
        </div>
    )

}

export default Article;