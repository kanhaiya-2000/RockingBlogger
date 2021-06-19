import React from "react";
import { useParams } from "react-router-dom";
import Article from "../components/home/Article";


const TopicPage = () => {
    const [detail, setDetail] = React.useState({ image: "https://miro.medium.com/max/680/0*leAtiXItRsZL1OEC", latest_article: [{ author: { avatar: "https://kkleap.github.io/assets/default.jpg", name: "kanhaiya" }, header: "Can anyone leave this home?", description: "Hello this story is about something ...", publishDate: "June 14,2000", readingTime: "5 min", isSaved: true, image: "https://miro.medium.com/fit/c/200/134/1*tHD954Dso7IdwZ1WqdTG7g.png" }, { author: { avatar: "https://kkleap.github.io/assets/default.jpg", name: "kanhaiya" }, header: "Can anyone leave this home?", description: "Hello this story is about something ...", publishDate: "June 14,2000", readingTime: "5 min", isSaved: false, image: "https://miro.medium.com/fit/c/200/134/1*tHD954Dso7IdwZ1WqdTG7g.png" }], popularArticle: [{ author: { avatar: "https://kkleap.github.io/assets/default.jpg", name: "kanhaiya" }, header: "Can anyone leave this home?", description: "Hello this story is about something ...", publishDate: "June 14,2000", readingTime: "5 min", isSaved: true, image: "https://miro.medium.com/fit/c/200/134/1*tHD954Dso7IdwZ1WqdTG7g.png" }, { author: { avatar: "https://kkleap.github.io/assets/default.jpg", name: "kanhaiya" }, header: "Can anyone leave this home?", description: "Hello this story is about something ...", publishDate: "June 14,2000", readingTime: "5 min", isSaved: false, image: "https://miro.medium.com/fit/c/200/134/1*tHD954Dso7IdwZ1WqdTG7g.png" }], relatedtopic: ["Economics", "dgdghdhdh", "dghdghdhdh", "ddhdhhdhddh", "sgdhshshsh"], name: "kanhaiya", isFollowing: false, description: "kk is here to help you.But you are not here i can make you understand the fact that i can do the following " });
    const { topicname } = useParams();

    return (
        <div className="topicpage">
            <div className="left_side">
                <div className="topicimage" style={{ backgroundImage: `url(${detail.image})` }}>
                    <div className="topic_intro_mobile">
                        <div className="topic_name">
                            <div style={{ fontSize: "22px" }}>
                                {detail.name}
                            </div>
                            <div className="follow_btn">
                                <span className="action_btn">
                                    {detail.isFollowing ? "Following" : "Follow"}
                                </span>
                            </div>
                        </div>
                        <div className="topic_des">
                            {detail.description}
                        </div>
                    </div>
                </div>
                <div className="latest_article">
                    <div className="parameter">LATEST ARTICLE</div>
                    {detail?.latest_article?.map(article => <Article article={article} noOption={true} />)}
                </div>
            </div>
            <div className="right_side">
                <div className="topic_intro">
                    <div className="topic_name">
                        <div style={{ fontSize: "22px" }}>
                            {detail.name}
                        </div>
                        <div className="follow_btn">
                            <span className="action_btn">
                                {detail.isFollowing ? "Following" : "Follow"}
                            </span>
                        </div>
                    </div>
                    <div className="topic_des">
                        {detail.description}
                    </div>
                </div>
                <div className="related_topic">
                    <div className="parameter">RELATED TOPIC</div>
                    {detail?.relatedtopic?.map(topic => <div className="rel_topic">{topic}</div>)}
                </div>
                <div className="popular_article_in_topic">
                    <div className="parameter">POPULAR ARTICLE</div>
                    {detail?.popularArticle?.map(article => <div className="popularArticle">
                        <div className="article_info_2">
                            <h3 className="head_article">
                                {article.header}
                            </h3>
                            <div className="read">{article.readingTime}</div>
                        </div><div className="article_img" style={{ backgroundImage: `url(${article.image})` }}>

                        </div>
                    </div>)}
                </div>
            </div>

        </div>);
}

export default TopicPage;