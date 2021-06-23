import React from "react";
import Avatar from "@material-ui/core/Avatar";
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import { useHistory } from "react-router-dom";


export const CommentComp = ({comment})=>{
    return (
        <div className="comment_piece">
            <div className="user_avatar">
                <Avatar src={comment.user.avatar} alt=""/>
            </div>
            <div>
                <p>
                    <span>{comment.user.username}</span>&nbsp;&nbsp;
                    {comment.text}
                </p>
                <div className="timestamp">
                    <div>{comment.createdAt}</div>
                    <div className="like">{comment.isLiked?<FavoriteIcon className="blog_like_filled"/>:<FavoriteBorderIcon/>}&nbsp;&nbsp;{comment.likesCount}</div>
                </div>
            </div>
        </div>
    )
}

const Blog = ()=>{
    const history = useHistory();
    const [blog,setBlog] = React.useState({isSaved:true,likesCount:"2.7k",isLiked:true,tags:[{url:"/topic/money",text:"Money"},{url:"/topic/money",text:"Money"},{url:"/topic/money",text:"Money"}],html:"<h2>Hello</h2>",header:"The Most Essential People Are The Least Celebrated",short_des:"Why are workers who matter most, valued less?",author:{
        username:"Vishnu*s Virtues",avatar:"https://miro.medium.com/fit/c/96/96/1*vX3DADUFGFyyeoapA_MG6A.jpeg",isFollowing:true},publish_date:"Jun 18",readTime:"5min"        
    ,comments:[{user:{avatar:"https://miro.medium.com/fit/c/96/96/1*vX3DADUFGFyyeoapA_MG6A.jpeg",username:"kk2000"},text:"https://miro.medium.com/fit/c/96/96/1*vX3DADUFGFyyeoapA_MG6A.jpeg",createdAt:"4m ago",isLiked:true,likesCount:2},{user:{avatar:"https://miro.medium.com/fit/c/96/96/1*vX3DADUFGFyyeoapA_MG6A.jpeg",username:"kk2000"},text:"This is my comment",createdAt:"4m ago",isLiked:true,likesCount:2}]});
    const html =  React.useRef(null);
    React.useEffect(()=>{
        html.current.innerHTML = blog?.html;
    },[html,blog])
    return <div className="blogpage">
                <h1 className="blog_header">{blog.header}</h1>
                <div className="blog_short_des">{blog.short_des}</div>
                <div className="blog_author">
                    <div className="blog_author_avatar">
                        <Avatar lg src={blog.author.avatar}/>
                    </div>
                    <div className="blog_author_info">
                        <div className="blog_author_info_1">
                            <div className="blog_author_username">
                                {blog.author.username}
                            </div>
                            
                        </div>
                        <div className="blog_author_info_2">
                            <div className="blog_publish_date">
                                {blog.publish_date}
                            </div>
                            &nbsp;&nbsp;.&nbsp;&nbsp;
                            <div className="blog_readTime">
                                {blog.readTime}
                            </div>
                        </div>
                    </div>
                    <div className="actionbtn">
                                {blog.author.isFollowing?<span className="bold">Following</span>:<span>Follow</span>}
                    </div>
                </div>
                <div className="html_content" ref={html}>
                    
                </div>
                <div className="blog_footer">
                    <div className="blog_tag">{
                        blog.tags.map(tag=><div className="topic" onClick={()=>history.push(`/${tag.url}`)}>{tag.text}</div>)
                    }</div>
                    <div className="blog_action">
                        <div className="blog_icon">
                            <div className="blog_like_icon">
                                {blog.isLiked?<FavoriteIcon className="blog_like_filled"/>:<FavoriteBorderIcon/>}&nbsp;{blog.likesCount}
                            </div>
                            <div className="blog_bookm_icon">
                                {blog.isSaved?<BookmarkIcon/>:<BookmarkBorderIcon/>}
                            </div>
                            <div className="blog_action_icon">
                                <MoreVertIcon/>
                            </div>
                        </div>
                    </div>
                    <div className="blog_comment">
                        <div className="blog_comment_label">Comments</div>
                        <hr/>
                        {
                            blog.comments.map(comment=><CommentComp comment={comment}/>)
                        }
                    </div>
                </div>
            </div>
}

export default Blog;