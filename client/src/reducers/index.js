import { combineReducers } from "redux";

// import reducers

import Explored from "./Explored";
import Following from "./Following";
import getFollowers from "./getFollowers";
import getFollowing from "./getFollowingpeople";
import getLatestStories from "./getLatestStories";
import getLikedStories from "./getLikedStories";
import getMyStories from "./getMyStories";
import getNotice from "./getNotice";
import getPopularStoires from "./getPopularStories";
import getSavedStory from "./getSavedStory";
import getSearchPeople from "./getSearchPeople";
import getSuggestedTopic from "./getSuggestedTopic";
import getTopicDetail from "./getTopicDetail";
import Profile from "./Profile";
import ReadingList from "./ReadingList";
import SearchStory from "./SearchStory";
import SuggestedUser from "./SuggestedUser";
import TrendingStory from "./TrendingStory";
import TrendingTopic from "./TrendingTopic";



export default combineReducers({
    explore:Explored,
    followingStories:Following,
    getFollowers:getFollowers,
    getFollowing:getFollowing,
    getLatestStories:getLatestStories,
    getLikedStories:getLikedStories,
    getMyStories:getMyStories,
    getNotice:getNotice,
    getPopularStoires:getPopularStoires,
    getSavedStory:getSavedStory,
    getSearchPeople:getSearchPeople,
    getSuggestedTopic:getSuggestedTopic,
    getTopicDetail:getTopicDetail,
    Profile:Profile,
    ReadingList:ReadingList,
    SearchStory:SearchStory,
    SuggestedUser:SuggestedUser,
    TrendingStory:TrendingStory,
    TrendingTopic:TrendingTopic,  
});