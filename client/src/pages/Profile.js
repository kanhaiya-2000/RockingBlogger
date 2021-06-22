import React from "react";
import ProfileTabContent from "../components/profile/ProfileTabContent";


const Profile = ()=>{    

    const [profile,setProfile] = React.useState({isFollowing:true,username:"Kanhaiya kumar",followerCount:"2.7k",avatar:"https://miro.medium.com/fit/c/680/680/1*vX3DADUFGFyyeoapA_MG6A.jpeg",coverImage:"https://miro.medium.com/max/700/0*IgpG9_SlB9t1HbRZ",followers:[{avatar:"https://cdn-images-1.medium.com/fit/c/60/60/1*vX3DADUFGFyyeoapA_MG6A.jpeg",username:"Vishnu*s Virtues",description:"Let’s achieve our writing dreams together | Topics: writing and relationships | Californian, Malaysian| 750K+ Med views. Blog: https://www.vishnusvirtues.com/",isFollowing:true},{avatar:"https://cdn-images-1.medium.com/fit/c/60/60/1*vX3DADUFGFyyeoapA_MG6A.jpeg",username:"Vishnu*s Virtues",description:"Let’s achieve our writing dreams together | Topics: writing and relationships | Californian, Malaysian| 750K+ Med views. Blog: https://www.vishnusvirtues.com/",isFollowing:true}],about:"Let’s achieve our writing dreams together | Topics: writing and relationships | Californian, Malaysian| 750K+ Med views. Blog: https://www.vishnusvirtues.com/",stories:[{author:{avatar:"https://kkleap.github.io/assets/default.jpg",name:"kanhaiya"},header:"Can anyone leave this home?",description:"Hello this story is about something ...",publishDate:"June 14,2000",readingTime:"5 min",isSaved:true,image:"https://miro.medium.com/fit/c/200/134/1*tHD954Dso7IdwZ1WqdTG7g.png"},{author:{avatar:"https://kkleap.github.io/assets/default.jpg",name:"kanhaiya"},header:"Can anyone leave this home?",description:"Hello this story is about something ...",publishDate:"June 14,2000",readingTime:"5 min",isSaved:true,image:"https://miro.medium.com/fit/c/200/134/1*tHD954Dso7IdwZ1WqdTG7g.png"},{author:{avatar:"https://kkleap.github.io/assets/default.jpg",name:"kanhaiya"},header:"Can anyone leave this home?",description:"Hello this story is about something ...",publishDate:"June 14,2000",readingTime:"5 min",isSaved:true,image:"https://miro.medium.com/fit/c/200/134/1*tHD954Dso7IdwZ1WqdTG7g.png"}]});

    const [tabstate,setTabState] = React.useState(0);

    return (
    <div className="profile_page">
        <div className="profile_header" style={{backgroundImage:`url(${profile.coverImage})`}}>
            <div style={{width: "100%",height: "100%",background: "#ffffff66"}}>
                <h2>{profile.username}</h2>
            </div>
        </div>
        <div className="profile_tab">
            <div className="actionbtn">
                {profile.isFollowing?<span className="bold">Following</span>:<span>Follow</span>}
            </div>
            <div className={tabstate===0?"selected-tab":""} onClick={()=>setTabState(0)}>
                Stories
            </div>
            <div className={tabstate===1?"selected-tab":""} onClick={()=>setTabState(1)}>
                Followers
            </div>
            <div className={tabstate===2?"selected-tab":""} onClick={()=>setTabState(2)}>
                About
            </div>
        </div>
        <ProfileTabContent tabstate={tabstate} profile={profile}/>
    </div>
    )
}

export default Profile;