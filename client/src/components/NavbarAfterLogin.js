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
      currentPWSPage: 1,
      currentPPage :1,
      todosPerPage: 10
    
    }



    this.searchProject = this.searchProject.bind(this);
    this.handleAllProjects = this.handleAllProjects.bind(this);
    this.handlePWSClick = this.handlePWSClick.bind(this);
    this.skillRelatedProjects = this.skillRelatedProjects.bind(this);
    this.handlePClick = this.handlePClick.bind(this);
  }

  static defaultProps = {
    showDashboard: false
  }
handlePWSClick(event){
  this.setState({
          currentPWSPage: Number(event.target.id)
  });
}

handlePClick(event){
  this.setState({
          currentPPage: Number(event.target.id)
  });
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

  componentWillMount(){
    this.props.dispatch(getRecommendedProjects(this.props));
    this.props.dispatch(getAllProjects(this.props));
  }

  componentWillReceiveProps(props) {
    if(props.projectsWithSkills !== this.props.projectsWithSkills){
       this.setState({projectsWithSkills: props.projectsWithSkills});
     }
     if(props.allprojects !== this.props.allprojects){
        this.setState({allprojects: props.allprojects});
      }
   }



  render(){


     let renderPWSPageNumbers = null;
     let renderPPageNumbers =null;
     const { projectsWithSkills, allprojects,currentPWSPage,currentPPage, todosPerPage } = this.state;
     let currentPWS   = undefined;
     let currentP= undefined;
     /***********************************  Pagination for relevant Projectcs ***********************************/
     if(projectsWithSkills !== undefined){
       // Logic for displaying current todos
       const indexOfLastPWS = currentPWSPage * todosPerPage;
       const indexOfFirstPWS = indexOfLastPWS - todosPerPage;

      currentPWS = projectsWithSkills.slice(indexOfFirstPWS, indexOfLastPWS);


       // Logic for displaying page numbers
        const PWSPageNumbers = [];
        for (let i = 1; i <= Math.ceil(projectsWithSkills.length / todosPerPage); i++) {
          PWSPageNumbers.push(i);
        }

         renderPWSPageNumbers = PWSPageNumbers.map(number => {
          return (
            <li  className="page-item">
              <a class="page-link" key={number} id={number}  onClick={this.handlePWSClick}>{number}</a>
            </li>
          );
        });

      }
      /********************************* Pagination for relevant Projectcs ***********************************/

      /***********************************  Pagination for All Projectcs ***********************************/
      if(allprojects !== undefined){
        // Logic for displaying current todos
        const indexOfLastP = currentPPage * todosPerPage;
        const indexOfFirstP = indexOfLastP - todosPerPage;

       currentP = allprojects.slice(indexOfFirstP, indexOfLastP);


        // Logic for displaying page numbers
         const PPageNumbers = [];
         for (let i = 1; i <= Math.ceil(allprojects.length / todosPerPage); i++) {
           PPageNumbers.push(i);
         }

          renderPPageNumbers = PPageNumbers.map(number => {
           return (
             <li  className="page-item">
               <a class="page-link" key={number} id={number}  onClick={this.handlePClick}>{number}</a>
             </li>
           );
         });

       }
       /********************************* Pagination for relevant Projectcs ***********************************/



    return(
    <div>
      <FixedNav />
      {this.props.showDashboard ? <DashboardDecider role={localStorage.getItem("role")} /> :
       <div>
        <input type="text" className ="center-block" id="myInput" onKeyUp={this.searchProject} placeholder="Search for project names.." title="Type in a name"/>
        <div class=" news-feed panel panel-primary col-md-8 col-offset-md-4 ">
          <div class="panel-heading "><a className ="panelheading" onClick = {this.handleAllProjects}> All Projects</a><a  className ="panelheading" onClick = {this.skillRelatedProjects}>Skill Related Projects</a></div>
          {this.state.skillRelated ?
            <div>
         {currentPWS !== undefined ?

          <div class="panel-body">
            {currentPWS.map(projectsWithSkill =>
            <ProjectFeedItem display = {this.state.display} key={projectsWithSkill.project.project_id} postedBy = {projectsWithSkill.postedBy} projectskills = {projectsWithSkill.skills} projectfeeditem = {projectsWithSkill} userdBidded = {projectsWithSkill.usersBidded}/>
            )}
            <ul className="pagination home-paginate">
             {renderPWSPageNumbers}
           </ul>
          </div>  :

          <div class="panel-body ">Complete your profile to to see all open projects!
            <a className = "glyphicon glyphicon-arrow-right" onClick = {() => {this.props.history.push("/completeProfile")}}>   Complete your profile!</a>
        </div>} </div>: null}

          {this.state.allProjects ? <div>
        { currentP != undefined ?
        <div class="panel-body ">
          {currentP.map(projectsWithSkill =>
            <ProjectFeedItem display = {this.state.display} key={projectsWithSkill.project.project_id} postedBy = {projectsWithSkill.postedBy} projectskills = {projectsWithSkill.skills} projectfeeditem = {projectsWithSkill} userdBidded = {projectsWithSkill.usersBidded}/>
          )}     <ul className="pagination home-paginate">
               {renderPPageNumbers}
             </ul>
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
