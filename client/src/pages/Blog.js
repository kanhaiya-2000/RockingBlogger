import React from "react";
import Avatar from "@material-ui/core/Avatar";
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import {useSelector,useDispatch} from "react-redux"; 
import { useHistory, useParams } from "react-router-dom";
import Input from "@material-ui/core/Input";
import { addcomment, addComment, deletecomment, deleteComment, toggleLikeComment, togglelikeComment, togglelikeStory, toggleLikeStory, togglesaveStory,fetchComments,getStory, toggleFollowAuthor } from "../reducers/story";
import { NotifyUser } from "../utils/NotifyUser";
import { useToasts } from "react-toast-notifications";
import ActivityIndicator from '@material-ui/core/CircularProgress';
import { addToReadingList, deleteStory, togglefollowPeople, togglesaveUserStory } from "../reducers/user";
import { FormateDate } from "../utils/connect";

export const Modal = ({body})=>{
    return(<div className="modalwrapper">
        {body}
    </div>
    )
}

export const CommentComp = ({comment,toggleLikeCommentFunc,history,openModal})=>{
    return (
        <div className="comment_piece">
            <div className="user_avatar" onClick={()=>history.push(`/${comment.user.username}`)}>
                <Avatar src={comment.user.avatar} alt=""/>
            </div>
            <div>
                <p>
                    <span onClick={()=>history.push(`/${comment.user.username}`)}>{comment.user.username}</span>
                    {comment.text}
                </p>
                <div className="timestamp">
                    
                    <div className="like" onClick={()=>toggleLikeCommentFunc({cid:comment._id})}>{comment.isLiked?<FavoriteIcon className="blog_like_filled"/>:<FavoriteBorderIcon/>}&nbsp;&nbsp;{comment.likesCount}</div>
                    <div>{FormateDate(comment.createdAt,true)}</div>
                    {comment.isMine&&<div onClick={()=>openModal({cid:comment._id})} className="comment_vert">
                                <MoreVertIcon/>
                    </div>
                    }
                </div>
            </div>
        </div>
    )
}

const Blog = ()=>{
    const history = useHistory();
    
    const html =  React.useRef(null);
    const comment = React.useRef(null);
    const {story,currIndex,ShouldFetchComments} = useSelector((state)=>state.story);
    const {data} = useSelector((state)=>state.user);
    const {addToast} = useToasts();
    const [open,setModal] = React.useState(false);
    const {sid} = useParams();
    //const [ignored, forceUpdate] = React.useReducer(x => x + 0.5, 0);

    const dispatch = useDispatch();

    const SubmitComment = (e) =>{
        //console.log(comment.current.value);
        if(!data){       
            history.push("/signin");     
            NotifyUser({content:"Please login first",type:"error",addToast});
            return;
        }
        const callback = (res)=>{
            if(res){
                const {username,avatar} = JSON.parse(localStorage.getItem("user"));
                const mycomment = {user:{username,avatar},text:comment.current.value,createdAt:Date.now(),isLiked:false,likesCount:0,_id:Math.random()};
                comment.current.value = "";
                dispatch(addcomment(mycomment));
            }
            else{
                NotifyUser({content:"Failed to add comment",type:"error",addToast:addToast})
            }
        }
        if(e.keyCode===13&&comment.current&&comment.current.value){
            
            dispatch(addComment({payload:{text:comment.current.value,sid},callback:callback}));
            
        }
    }

    const toggleFollowUser = ()=>{
        if(!data){       
            history.push("/signin");     
            NotifyUser({content:"Please login first",type:"error",addToast});
            return;
        }
        dispatch(togglefollowPeople({payload:{uid:story.user._id},callback:function(res,msg){
            if(res){
                dispatch(toggleFollowAuthor());
            }
            else{
                NotifyUser({content:msg,type:"error",addToast});
            }
        }}))
    }

    const delstoryFunc = ()=>{
        if(!data){       
            history.push("/signin");     
            NotifyUser({content:"Please login first",type:"error",addToast});
            return;
        }
        const callback = (res)=>{
            if(res){
                window.location.replace("/");
            }
            else{
                NotifyUser({content:"Something went wrong",type:"error",addToast:addToast})
            }
        }
        dispatch(deleteStory({payload:sid,callback:callback}));
    }

    const toggleLikeStoryFunc = ()=>{
        if(!data){       
            history.push("/signin");     
            NotifyUser({content:"Please login first",type:"error",addToast});
            return;
        }
        const callback = (res)=>{
            if(res){
                dispatch(togglelikeStory());
            }
            else{
                NotifyUser({content:"Something went wrong",type:"error",addToast:addToast})
            }
        }
        dispatch(toggleLikeStory({payload:{sid},callback:callback}))
    }

    const toggleLikeCommentFunc = ({cid})=>{
        if(!data){       
            history.push("/signin");     
            NotifyUser({content:"Please login first",type:"error",addToast});
            return;
        }
        const callback = (res)=>{
            if(res){
                dispatch(togglelikeComment(cid));
            }
            else{
                NotifyUser({content:"Something went wrong",type:"error",addToast:addToast})
            }
        }
        dispatch(toggleLikeComment({payload:{cid},callback:callback}));
    }
    
    

    const savestoryFunc = () =>{
        if(!data){       
            history.push("/signin");     
            NotifyUser({content:"Please login first",type:"error",addToast});
            return;
        }
        const callback = (res)=>{
            if(res){
                dispatch(togglesaveStory());
            }
            else{
                NotifyUser({content:"Something went wrong",type:"error",addToast:addToast})
            }
        }
        dispatch(togglesaveUserStory({payload:sid,callback:callback}));
    }

    const fetchCommentsFunc = () =>{
        const callback = (res)=>{
            if(res){
                //
            }
            else{
                NotifyUser({content:"Something went wrong",type:"error",addToast:addToast})
            }
        }
        dispatch(fetchComments({payload:sid,callback:callback}));
    }

    

    const delcommentFunc = ({cid})=>{
        if(!data){       
            history.push("/signin");     
            NotifyUser({content:"Please login first",type:"error",addToast});
            return;
        }
        const callback = (res)=>{
            if(res){
                dispatch(deletecomment(cid));
            }
            else{
                NotifyUser({content:"Something went wrong",type:"error",addToast:addToast})
            }
        }
        dispatch(deleteComment({payload:cid,callback:callback}));
    }

    
    const callbackFun = (res)=>{
        if(res){                      
            data&&dispatch(addToReadingList({payload:sid,callback:function(res,msg){
                if(res){
                    
                }
            }}));
            setTimeout(()=>{
                //forceUpdate();
                html.current.innerHTML = res;
            },1000);           
           
        }
        else{
            NotifyUser({content:"Something went wrong",type:"error",addToast:addToast})
        }
    }

    const EditStory = ()=>{
        if(story){
            localStorage.setItem("content",story.html_content);
            setTimeout(()=>{
                history.push(`/editstory/${story._id}`)
            },100);
        }
    }

    React.useEffect(()=>{        
        dispatch(getStory({payload:sid,callback:callbackFun}));        
        //html.current.innerHTML = "<p style='margin-top:20px;color:gray'>Loading...</p>";
    },[]);
    if(!story.user){
        return <div className="blogpage"><div className="loader"><ActivityIndicator/></div></div>
    }
    const openModal=({cid})=>{
        if(window.confirm("Are u sure to delete this comment?")){
            delcommentFunc({cid});
        }
    }
    const body = (
        <div className="modalbody">
            <div className="danger" onClick={()=>setModal(false)}>Cancel</div>
            {story.user.username===data?.username?<div onClick={EditStory}>Edit story</div>:<div onClick={()=>history.push(`/report/${story._id}`)}>Report story</div>}
            {story.user.username===data?.username&&<div className="danger" onClick={delstoryFunc}>Delete story</div>}
        </div>
    );
    return <div className="blogpage">
                {open&&<Modal body={body}/>}
                <h1 className="blog_header">{story?.title}</h1>
                <div className="blog_short_des">{story?.short_des}</div>
                <div className="blog_author">
                    <div className="blog_author_avatar">
                        <Avatar lg src={story?.user?.avatar}/>
                    </div>
                    <div className="blog_author_info">
                        <div className="blog_author_info_1">
                            <div className="blog_author_username">
                                {story?.user?.username}
                            </div>
                            
                        </div>
                        <div className="blog_author_info_2">
                            <div className="blog_publish_date">
                                {FormateDate(story?.createdAt)}
                            </div>
                            &nbsp;&nbsp;.&nbsp;&nbsp;
                            <div className="blog_readTime">
                                {story?.readingTime}
                            </div>
                        </div>
                    </div>
                    {!story?.isMine?<div className="actionbtn" onClick={toggleFollowUser}>
                                {story?.user?.isFollowing?<span className="bold">Following</span>:<span>Follow</span>}
                    </div>:<div className="actionbtn" onClick={EditStory}><span className="bold">Edit</span></div>}
                </div>
                <div className="html_content" ref={html}>
                    <div style={{width:"100%",height:"200px",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <ActivityIndicator size={24}/>
                    </div>
                </div>
                <div className="blog_footer">
                    <div className="blog_tag">{
                        story?.topics?.map(tag=><div className="topic" onClick={()=>history.push(`/topic/${tag.name}`)} key={tag._id}>{tag.name}</div>)
                    }</div>
                    <div className="blog_action">
                        <div className="blog_icon">
                            <div className="blog_like_icon" onClick={toggleLikeStoryFunc}>
                                {story?.isLiked?<FavoriteIcon className="blog_like_filled"/>:<FavoriteBorderIcon/>}&nbsp;{story?.likesCount}
                            </div>
                            <div className="blog_bookm_icon" onClick={savestoryFunc}>
                                {story?.isSaved?<BookmarkIcon/>:<BookmarkBorderIcon/>}
                            </div>
                            <div className="blog_action_icon" onClick={()=>setModal(true)}>
                                <MoreVertIcon/>
                            </div>
                        </div>
                    </div>
                    <div className="blog_comment">
                        <div className="blog_comment_label">Comments</div>
                        <div className="add_comment">
                            <Input
                                placeholder="Leave a comment 🙂️"
                                style={{width:"100%",maxWidth:"100%"}}
                                onKeyDown={SubmitComment}
                                value={comment.current?.value}
                                ref={comment}
                                onChange={(e)=>comment.current.value=e.target.value}
                            />
                        </div>
                        
                        {
                            story?.comments?.map(comment=><CommentComp comment={comment} key={comment._id} toggleLikeCommentFunc={toggleLikeCommentFunc} history={history} openModal={openModal}/>)
                        }
                    </div>
                </div>
            </div>
}

export default Blog;