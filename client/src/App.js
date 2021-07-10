import './App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Homepage from './pages/Homepage';
import CreateBlog from './pages/createBlog';
import './pages/page.css';
import Blog from './pages/Blog';
import Profile from './pages/Profile';
import Searchpage from './pages/Searchpage';
import FollowPage from './pages/FollowPage';
import Navbar from './components/navbar/Navbar';
import Auth from './components/auth/Auth';
import Trending from "./pages/Trending";
import TopicPage from './pages/TopicPage'; 

import { useSelector } from 'react-redux';
import Reportstory from './pages/Reportstory';

function App() {
  const {data} = useSelector((state)=>state.user);
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route path="/signin" render={(props) =>!data?<Auth open={true} />:<Redirect to="/"/>}/>
        <Route path="/signup" component={() => !data?<Auth open={true} state={1} />:<Redirect to="/"/>} />
        <Route path="/trending" component={Trending}></Route>

        <Route path="/newstory" render={() => data ? <CreateBlog /> :
          <Auth open={true} />
        } />
        <Route path="/report/:sid" render={()=>data?<Reportstory key={window.location.pathname}/>:<Auth open={true}/>}/>
        <Route path="/editstory/:sid" render={() => data ? <CreateBlog key={window.location.pathname} isEditing={true}/> :
          <Auth open={true} />
        } />
        
        <Route exact path="/topic/:topicname" component={() => <TopicPage key={window.location.pathname} />} />
        <Route exact path="/search/:term" component={() => <Searchpage key={window.location.pathname} />} />
        <Route path="/follow-tag-or-people" component={FollowPage} />
        <Route exact path="/stories/:sid" component={() => <Blog key={window.location.pathname} />} />
        <Route exact path="/:user" component={()=><Profile key={window.location.pathname}/>}/>
        {/* <Route path="/users/:uid" component={Profile} /> */}
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default App;
