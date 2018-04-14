import React, {Component} from 'react';
import Signup from './Signup';
import Login from './Login';
import NavBar1 from './NavBar1';
import PostProject from './PostProject';
import CompleteProfile from './CompleteProfile';
import ProjectDetails from './ProjectDetails';
import { Route, withRouter } from 'react-router-dom';
import UserProfile from './UserProfile';
import TransactionHistory from './TransactionHistory';
import TransactionData from './TransactionData';


class NewerHomePage extends Component{

  render() {
      return (
        <div>
          <Route exact path="/" render={(props) => <NavBar1 {...props} isLoggedIn={false} />}/>
          <Route exact path="/home" render={(props) => <NavBar1 {...props} isLoggedIn={true} />}/>
          <Route exact path="/signup" component={Signup}/>
          <Route exact path="/login" component={Login}/>
          <Route exact path = "/postproject" component={PostProject} />
          <Route exact path ="/completeProfile" component={CompleteProfile} />
          <Route exact path ="/projectDetails" component={ProjectDetails} />
          <Route exact  path ="/profile" component={UserProfile} />
          <Route exact path = "/transaction" component = {TransactionHistory}/>
          <Route exact path = "/mytransaction" component = {TransactionData}/>

        </div>

    );
}
}

export default withRouter(NewerHomePage);
