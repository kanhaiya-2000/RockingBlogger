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

function App() {
  const isAuthenticated = localStorage.getItem("user");
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route path="/signin" render={(props) => <Auth open={true} />} />
        <Route path="/signup" component={() => <Auth open={true} state={1} />} />
        <Route path="/trending" component={Trending}></Route>

        <Route path="/newstory" render={() => isAuthenticated ? <CreateBlog /> :
          <Auth open={true} />
        } />
        
        <Route path="/topic/:topicname" component={() => <TopicPage key={window.location.pathname} />} />
        <Route path="/search/:term" component={() => <Searchpage key={window.location.pathname} />} />
        <Route path="/follow-tag-or-people" component={FollowPage} />
        <Route path="/stories/:sid" component={() => <Blog key={window.location.pathname} />} />
        <Route exact path="/:username" component={Profile}/>
        {/* <Route path="/users/:uid" component={Profile} /> */}
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default App;
