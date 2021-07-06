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
import story from "./story";
import ReadingList from "./ReadingList";
import SearchStory from "./SearchStory";
import SuggestedUser from "./SuggestedUser";
import TrendingStory from "./TrendingStory";
import TrendingTopic from "./TrendingTopic";
import user from "./user";



export default combineReducers({
    explore:Explored,
    followingstory:Following,
    followers:getFollowers,
    followingpeople:getFollowing,
    latest:getLatestStories,
    likedstory:getLikedStories,
    Mystories:getMyStories,
    Notice:getNotice,
    popular:getPopularStoires,
    SavedStory:getSavedStory,
    searchpeople:getSearchPeople,
    suggestedtopic:getSuggestedTopic,
    Topicdetail:getTopicDetail,
    profile:Profile,
    readingList:ReadingList,
    searchstory:SearchStory,
    story:story,
    suggesteduser:SuggestedUser,
    trendingstory:TrendingStory,
    trendingtopic:TrendingTopic,  
    user:user,
});