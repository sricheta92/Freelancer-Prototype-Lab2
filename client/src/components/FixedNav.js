import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import {requestLogout,showDashboard, hideDashboard,getProfileDetails,getUserSkills,getTransactionUserDetails,requestAuth} from '../actions';

const mapStateToProps = (state) => {
   return {
     bloburl: localStorage.getItem("bloburl") ? localStorage.getItem("bloburl") :  state.loginReducer.bloburl,
     user : state.loginReducer.user,
     isAuthentic : state.userReducer.isAuthentic
   }
 }

const mapDispatchToProps = (dispatch)=>{
  let actions = {showDashboard,hideDashboard,getProfileDetails,getUserSkills,getTransactionUserDetails,requestLogout, requestAuth};
  return { ...actions, dispatch };
}

class FixedNav extends Component{

  static defaultProps ={

      bloburl :""
  }

  constructor(props){
    super(props);
    this.state = {
      showDashboard : false,
      bloburl : this.props.bloburl

    }
    this.handleLogout = this.handleLogout.bind(this);
    this.goToDashBoard = this.goToDashBoard.bind(this);
    this.goToProjectFeed = this.goToProjectFeed.bind(this);
    this.navigateToUserDetails = this.navigateToUserDetails.bind(this);
    this.navigateToTransactionManager = this.navigateToTransactionManager.bind(this);
  }

componentWillReceiveProps(nextProps){
  this.setState({
    bloburl :nextProps.bloburl
  })
}
  goToDashBoard(){
    this.setState({showDashboard : true}, function(){
      this.props.dispatch(this.props.showDashboard(this.state.showDashboard))
    });
  }

  componentWillMount(){
    this.props.dispatch(this.props.requestAuth(this.state))
    .then(() => !this.props.isAuthentic ? this.props.history.push('/home') : null);
}

  navigateToTransactionManager(){
      this.props.dispatch(this.props.getTransactionUserDetails(this.props.user))
      this.props.history.push("/mytransaction");
  }

  navigateToUserDetails(){
    this.props.dispatch(this.props.getUserSkills( localStorage.getItem("userid")));
    this.props.dispatch(this.props.getProfileDetails(this.props.user))
    this.props.history.push("/profile");
  }

   goToProjectFeed(){
     this.setState({showDashboard : false}, function(){
        this.props.dispatch(this.props.hideDashboard(this.state.showDashboard))
       this.props.history.push('/home');
     });
   }

  handleLogout(){
  	localStorage.removeItem('userid');
  	localStorage.removeItem('jwtToken');
  	localStorage.removeItem('username');
    localStorage.removeItem('bloburl');
    localStorage.removeItem('role');
    this.props.dispatch(this.props.requestLogout(this.props))
  	.then(() => this.props.history.push('/login'));
  }

  render(){

    return(
      <div>

    <nav className="navbar navbar-default navbar1">
      <div className="container-fluid">
        <div className="navbar-header">
          <a className="navbar-brand a-logo" href="#"><img className = "logo" src = "./images/icon.PNG"></img></a>
        </div>


    <ul className="nav navbar-nav">
    <li className="dropdown">
    <a className="dropdown-toggle" data-toggle="dropdown" href="#"> Work <span class="caret"></span>
    </a>
        <ul className="dropdown-menu">


        </ul>


      </li>

      <li className="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#"> My Projects <span class="caret"></span></a>
          <ul className="dropdown-menu">
            <li><a href="#">Page 1-1</a></li>
            <li><a href="#">Page 1-2</a></li>
            <li><a href="#">Page 1-3</a></li>
          </ul>
        </li>

    </ul>
      <ul className="nav navbar-nav navbar-right">
        <li><a href="#"><span className="  glyphicon glyphicon-bell"></span></a></li>

<li class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#">  <img src = {this.state.bloburl} height="42"></img></a>
          <ul class="dropdown-menu">
                  <li><a className="cursor" onClick={this.navigateToUserDetails} >My Profile</a></li>
                  <li><a className="cursor" onClick={this.navigateToTransactionManager} >Bid Funds</a></li>
          </ul>
      </li>



        <li><a><button type="button" class="btn btn-default btn-sm" onClick = {this.handleLogout}>
        <span class="glyphicon glyphicon-log-out"></span> Log out
      </button></a></li>

     </ul>
     <form className="navbar-form navbar-right" action="/action_page.php">
      <div className="input-group">

        <div className="input-group-btn">
          <button className="btn btn-default" type="submit">
            <i className="glyphicon glyphicon-search"></i>
       </button>
        </div>
        <input type="text" className="form-control" placeholder="Search" name="search"/>
      </div>
    </form>

    </div>
    </nav>
    <nav className="navbar navbar-inverse navbar2 ">
        <div className="container-fluid">

          <ul className="nav navbar-nav">
            <li className="active"><a  onClick= { this.goToProjectFeed }>Projects</a></li>
            <li><a    onClick= { this.goToDashBoard }>Dashboard</a></li>
            <li><a href="#">Inbox</a></li>
          </ul>
            <button onClick={() => { this.props.history.push("/postproject");}} className="btn navbar-btn btn-pull-right">Post a Project</button>
        </div>


      </nav>


    </div>

  )
}

}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FixedNav));
