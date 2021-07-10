import React from "react";
import { useHistory } from "react-router-dom";
import './Home.css';

const Recommendedtopic = ({trendingtopics})=>{
    
    const history = useHistory();
    
    
    return (
        <div className="recommendedtopic">
            <span className="title">TRENDING ON BLOGGER</span>
            <div className="topic_wrapper">
            {trendingtopics.map(tag=><div className="topic" onClick={()=>history.push(`/topic/${tag.name}`)} key={tag._id}>{tag.name}</div>)}
            </div>
        </div>
    )
}

export default Recommendedtopic;