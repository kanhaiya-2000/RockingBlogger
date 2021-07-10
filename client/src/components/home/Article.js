import React from "react";
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { FormateDate } from "../../utils/connect";
import { useHistory } from "react-router-dom";
import { Avatar } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { NotifyUser } from "../../utils/NotifyUser";
import { useToasts } from "react-toast-notifications";
import { deleteStory } from "../../reducers/user";
import { Modal } from "../../pages/Blog";

const Article = ({ article, short, noOption, Useraction }) => {
    const history = useHistory();
    const [open, setModal] = React.useState(false);
    const { data } = useSelector((state) => state.user);
    const { addToast } = useToasts();
    const dispatch = useDispatch();


    const delstoryFunc = () => {
        if (!data) {
            history.push("/signin");
            NotifyUser({ content: "Please login first", type: "error", addToast });
            return;
        }
        const callback = (res) => {
            if (res) {
                window.location.replace("/");
            }
            else {
                NotifyUser({ content: "Something went wrong", type: "error", addToast: addToast })
            }
        }
        dispatch(deleteStory({ payload: article._id, callback: callback }));
    }

    const body = (
        <div className="modalbody">
            <div className="danger" onClick={() => setModal(false)}>Cancel</div>
            <div onClick={() => history.push(`/stories/${article._id}`)}>View story</div>
            {article.user.username === data?.username ? <div onClick={delstoryFunc} className="danger">Delete story</div> : <div onClick={() => history.push(`/report/${article._id}`)}>Report story</div>}

        </div>
    );

    return (
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", marginBottom: `${short ? "-10px" : "30px"}`, cursor: "pointer" }} className="article_container">
            {open && <Modal body={body} />}
            <div className={short ? "article_comp" : "article_comp_real"}>
                <div className="article_author" onClick={() => history.push(`/${article.user.username}`)}>
                    <Avatar className="article_author_avatar" src={article?.user?.avatar} alt="" />
                    <span className="article_author_name">{article?.user?.username}</span>
                </div>
                <div className="article_header" onClick={() => history.push(`/stories/${article._id}`)}>{article.title}</div>
                <div className="article_short_des" onClick={() => history.push(`/stories/${article._id}`)}>{article.short_des}</div>
                <div className="article_info">
                    <div className="article_left_info">
                        <div className="article_pb_date">{FormateDate(article.createdAt, true)} ago</div>
                        <div className="article_expected_reading_time">{article.readingTime + " read"}</div>
                    </div>
                    {!noOption && <div className="article_right_info">
                        <div className="article_bkm_icon" onClick={() => Useraction({ type: "togglesavestory", payload: article._id })}>{article.isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}</div>
                        <div className="article_more_icon" onClick={()=>setModal(true)}><MoreVertIcon /></div>
                    </div>
                    }

                </div>
            </div>
            {!short && <div className="article_image"><img src={article.cover} alt="" /></div>}
        </div>
    )

}

export default Article;