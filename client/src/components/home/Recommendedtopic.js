import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import './Home.css';

const Recommendedtopic = ()=>{
    const [loading,setLoading] = React.useState(true);
    const history = useHistory();
    const [data,setData] = useState([]);
    if(loading){
        return (
            <div className="recommendedtopic">
                <span className="title">TRENDING ON BLOGGER</span>
                <div className="topic_wrapper">
                <div className="topic" onClick={()=>history.push("/topic/technlogy")}>Technology</div>
                    <div className="topic" onClick={()=>history.push("/topic/technlogy")}>Money</div>
                    <div className="topic" onClick={()=>history.push("/topic/technlogy")}>Business</div>
                    <div className="topic">Technology</div>
                    <div className="topic">Money</div>
                    <div className="topic">Business</div>
                    <div className="topic">Love</div>
                    <div className="topic">Love</div>
                </div>
            </div>
        )
    }
    return (
        <div className="recommenededtopic">
            <span className="title">TRENDING ON BLOGGER</span>
            {data.map(tag=><div className="topic" onClick={()=>history.push(tag.url)}>{tag.name}</div>)}
        </div>
    )
}

export default Recommendedtopic;