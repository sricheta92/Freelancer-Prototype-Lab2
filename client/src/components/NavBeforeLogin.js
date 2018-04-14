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
    this.state = {
      test :'',
      display : '',
      allProjects : true,
      skillRelated : false,
      projectsWithSkills : this.props.projectsWithSkills,
      allprojects : this.props.allprojects,
      currentProjectsWithSkillsPage: 1,
      currentAllProjectsPage : 1,
      todosPerPage: 1,
      pageNumbersForRelevantProjects: 1,
      currentProjectWithSkillsTodos :[]
    }



    this.searchProject = this.searchProject.bind(this);
    this.handleAllProjects = this.handleAllProjects.bind(this);
    this.skillRelatedProjects = this.skillRelatedProjects.bind(this);
  }

  static defaultProps = {
    showDashboard: false
  }



  handleAllProjects(){
    this.setState({
      allProjects : true,
      skillRelated :false
    });
  }

  skillRelatedProjects(){
    this.setState({
      skillRelated : true,
      allProjects :false
    });
  }

  searchProject(event){
    var  elem = event.target.value;
    var filter = elem.toUpperCase();
    this.setState({display : filter});
  }

  componentDidMount(){
    this.props.dispatch(getRecommendedProjects(this.props));
    this.props.dispatch(getAllProjects(this.props));
  }




  render(){


    return(
    <div>
      <FixedNav />

       {this.props.showDashboard ? <DashboardDecider role={localStorage.getItem("role")} /> :
       <div>
        <input type="text" className ="center-block" id="myInput" onKeyUp={this.searchProject} placeholder="Search for project names.." title="Type in a name"/>
        <div class=" news-feed panel panel-primary col-md-8 col-offset-md-4 ">
          <div class="panel-heading "><a className ="panelheading" onClick = {this.handleAllProjects}> All Projects</a> &nbsp; <a  className ="panelheading" onClick = {this.skillRelatedProjects}>Skill Related Projects</a></div>
          {this.state.skillRelated ?
            <div>
        { this.state.projectsWithSkills != undefined ?
          <div class="panel-body ">
            {this.state.projectsWithSkills.map(projectsWithSkill =>
              <ProjectFeedItem display = {this.state.display} key={projectsWithSkill.project.project_id} postedBy = {projectsWithSkill.postedBy} projectskills = {projectsWithSkill.skills} projectfeeditem = {projectsWithSkill} userdBidded = {projectsWithSkill.usersBidded}/> )}
                   </div>
          : <div class="panel-body ">Complete your profile to to see all open projects!
            <a className = "glyphicon glyphicon-arrow-right" onClick = {() =>   {this.props.history.push("/completeProfile")}}>   Complete your profile!</a>
        </div>} </div>: null}
          {this.state.allProjects ? <div>
        { this.state.allprojects != undefined ?
        <div class="panel-body ">
          {this.state.allprojects.map(projectsWithSkill =>
            <ProjectFeedItem display = {this.state.display} key={projectsWithSkill.project.project_id} postedBy = {projectsWithSkill.postedBy} projectskills = {projectsWithSkill.skills} projectfeeditem = {projectsWithSkill} userdBidded = {projectsWithSkill.usersBidded}/> )}
              </div>
        : <div class="panel-body ">Complete your profile to to see all open projects!
          <a className = "glyphicon glyphicon-arrow-right" onClick = {() =>   {this.props.history.push("/completeProfile")}}>   Complete your profile!</a>
      </div>} </div> :null}
        </div>
      </div>
      }
      </div>
    );


  }

}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavbarAfterLogin));
