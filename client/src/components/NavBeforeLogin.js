import  React , { Component} from 'react';
import NavBar2 from './NavBar2';
import PostProject from './PostProject';
import ProjectFeedItem from './ProjectFeedItem';
import FixedNav from './FixedNav';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getRecommendedProjects,getAllProjects } from '../actions';
import DashboardDecider from './DashboardDecider';

const mapStateToProps = (state) => {
  return {
    username: state.loginReducer.username,
    userID :localStorage.getItem("userid"),
    showDashboard : state.signupReducer.showDashboard,
    projectsWithSkills :state.postProjectReducer.projectsWithSkills,
    allprojects :state.postProjectReducer.allprojects

  }
}

const mapDispatchToProps = (dispatch)=>{
  console.log("mapDispatchToProps");
  let actions = {getRecommendedProjects,getAllProjects};
  return { ...actions, dispatch };
}
class NavbarAfterLogin extends Component{

  constructor(props){
    super(props);

  }



  render(){
    return(
      <div>
     <nav className="navbar navbar-default navbar1">
       <div className="container-fluid">
         <div className="navbar-header">
           <a className="navbar-brand a-logo" href="#"><img className = "logo" src = "./images/icon.PNG"></img></a>
         </div>

     <ul className="nav navbar-nav navbar-right before-login-list">
           <li><a onClick={() => { this.props.history.push("/login");}}> Log In </a></li>
           <li ><a onClick={() => { this.props.history.push("/signup");}}> Sign Up </a></li>


      </ul>
    </div>
  </nav>

      <div className="overlay1"><h1>Hire expert freelancers for any job, online</h1></div>
      <div className = "overlay2"><p>Millions of small businesses use Freelancer to turn their ideas into reality.</p></div>
      <div id="myCarousel" className="carousel" data-ride="carousel">
           <ol className="carousel-indicators">
              <li data-target="#myCarousel" data-slide-to="0" className="active"></li>
              <li data-target="#myCarousel" data-slide-to="1"></li>
              <li data-target="#myCarousel" data-slide-to="2"></li>
            </ol>
            <div className="carousel-inner">
                <div className="item active">
                  <img src="./images/1.JPG"/>
                </div>

                <div className="item">
                  <img src="./images/2.JPG"/>
                </div>

                <div className="item">
                  <img src="./images/3.JPG"/>
                 </div>
             </div>
           </div>
           <div className="row overlay3">
             <div className="col-sm-12 text-center">
                 <button id="btnHire" className="btn btn-primary btn-md center-block" >I want to Hire</button>
                  <button id="btnWork" className="btn btn-secondary btn-md center-block" >I want to Work</button>
              </div>
           </div>
     </div>
    );


  }

}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavbarAfterLogin));
