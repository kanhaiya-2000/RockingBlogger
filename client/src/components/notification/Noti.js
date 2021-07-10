import { Avatar } from "@material-ui/core";
import './Noti.css';
import React, { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { FetchNotice } from "../../reducers/getNotice";
import { FormateDate } from "../../utils/connect";
import { useHistory } from "react-router-dom";

const Noticomponents = ({ notice,history }) => {
    

    return (
        <div className="notice_component" onClick={()=>history.push(`${notice.url}`)}>
            <div className="notice_avatar">
                <Avatar src={notice.avatar} />
            </div>
            <div className="noti_wrapper">
                <div className="notice_text">
                    {notice.Message}
                </div>
                <div className="notice_createdAt">
                    {FormateDate(notice.createdAt,false)}
                </div>
            </div>

        </div>
    )
}

const Noti = () => {

    const pointer = React.useRef(null);    
    const {isFetching,notices,currIndex} = useSelector((state)=>state.Notice);
    const dispatch = useDispatch();
    const history = useHistory();

    const fetchNotice = ()=>{
        isFetching&&dispatch(FetchNotice({currIndex}))
    }

    useEffect(()=>{
        fetchNotice();
    },[])
    useEffect(()=>{
        if(pointer.current){            
            const max = Math.max(document.getElementById("notibell").offsetLeft,document.getElementById("notibell2").offsetLeft);  
            //const parentLeft = pointerParent.current.offsetLeft;         
            pointer.current.style.left =  max+"px";
        }
    },[pointer])
    
    return (
        <div className="notice">
            <div className="notice_pointer" ref={pointer}></div>
            {notices.map(noti => <Noticomponents notice={noti} key={noti._id} history={history}/>)}
        </div>
    )
}

export default Noti;
