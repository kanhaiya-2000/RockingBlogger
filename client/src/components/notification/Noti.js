import { Avatar } from "@material-ui/core";
import './Noti.css';
import React, { useEffect } from "react";

const Noticomponents = ({ notice }) => {
    return (
        <div className="notice_component">
            <div className="notice_avatar">
                <Avatar src={notice.avatar} />
            </div>
            <div className="noti_wrapper">
                <div className="notice_text">
                    {notice.text}
                </div>
                <div className="notice_createdAt">
                    {notice.createdAt}
                </div>
            </div>

        </div>
    )
}

const Noti = () => {

    const pointer = React.useRef(null);    
    
    useEffect(()=>{
        if(pointer.current){            
            const max = Math.max(document.getElementById("notibell").offsetLeft,document.getElementById("notibell2").offsetLeft);  
            //const parentLeft = pointerParent.current.offsetLeft;         
            pointer.current.style.left =  max+"px";
        }
    },[pointer])

    const [notices, setNotices] = React.useState([{ avatar: "", text: "This is a sample notice",createdAt:"4 hours ago" },{ avatar: "", text: "This is a sample notice",createdAt:"4 hours ago" },{ avatar: "", text: "This is a sample notice",createdAt:"4 hours ago" },{ avatar: "", text: "This is a sample notice",createdAt:"4 hours ago" },{ avatar: "", text: "This is a sample notice",createdAt:"4 hours ago" },{ avatar: "", text: "This is a sample notice",createdAt:"4 hours ago" }]);
    return (
        <div className="notice">
            <div className="notice_pointer" ref={pointer}></div>
            {notices.map(noti => <Noticomponents notice={noti} />)}
        </div>
    )
}

export default Noti;
