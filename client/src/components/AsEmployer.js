import React, {Component} from 'react';
import DashBoardSwitch from './DashBoardSwitch';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {getAllPostedProjectsbyMe,getProjectDetails,getProfileDetails,hideDashboard,getUserSkills} from '../actions'


  const mapDispatchToProps = (dispatch) => {

      let actions = {getAllPostedProjectsbyMe,getProjectDetails,getProfileDetails,hideDashboard,getUserSkills};
      return { ...actions, dispatch };

    }

      const mapStateToProps = (state) => {
        return {
          projectsPostedByMe: state.userReducer.projectsPostedByMe
        };
      }

class AsEmployer extends Component{

  constructor(props){
    super(props);
    let projectsPostedByMe = this.props.projectsPostedByMe;
    projectsPostedByMe.map(p =>
      p.display= ""
    );
    this.state ={
      display : true,
      projects : projectsPostedByMe,
      currentPage: 1,
      todosPerPage: 5
    }

    this.navigateToProjectDetails = this.navigateToProjectDetails.bind(this);
    this.searchProject = this.searchProject.bind(this);
    this.statusChange = this.statusChange.bind(this);
    this.navigateToUserDetails = this.navigateToUserDetails.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillReceiveProps(nextProps){
    // this.setState({
    //   projects : nextProps.projectsPostedByMe
    // })
    // let projectsPostedByMe = this.props.projectsPostedByMe;
    // projectsPostedByMe.map(p =>
    //   p.display= ""
    // );

    if(nextProps.projectsPostedByMe !== this.props.projectsPostedByMe){
      let projectsPostedByMe = nextProps.projectsPostedByMe;
      projectsPostedByMe.map(p =>
        p.display= ""
      );
      this.setState({
        projects : projectsPostedByMe
      })
     }
  }

  handleClick(event){
    this.setState({
            currentPage: Number(event.target.id)
    });
  }

  navigateToUserDetails(user){
    this.props.dispatch(this.props.getUserSkills( localStorage.getItem("userid")));
    this.props.dispatch(this.props.getProfileDetails(user));
    this.props.dispatch(this.props.hideDashboard(false))
    this.props.history.push("/profile");
  }

  statusChange(event){
    var elem = event.target.value;
    var selectedProjects = [];
    // this.props.projectsPostedByMe.map(projectpost =>  {
    //     if (projectpost.project.status.toUpperCase().indexOf(elem.toUpperCase()) > -1) {
    //       this.setState({
    //         display : true
    //       })
    //       selectedProjects.push(projectpost);
    //     }else{
    //       this.setState({
    //         display : false
    //       })
    //     }
    //   }
    // );

    this.state.projects.map(projectpost =>  {
      if (projectpost.project.project_name.toUpperCase().indexOf(elem.toUpperCase()) > -1) {
        projectpost.display= "";
        selectedProjects.push(projectpost);
      }else{
        projectpost.display= "none";
      }
     }
    );

    this.setState({
      projects : selectedProjects
    })
  }

  searchProject(event){
    var  elem = event.target.value;
    var filter = elem.toUpperCase();
    this.state.projects.map(projectpost =>  {
      if (projectpost.project.project_name.toUpperCase().indexOf(filter) > -1) {
        projectpost.display= "";
      }else{
        projectpost.display= "none";
      }
     }
    );
    this.setState({
      projects: this.state.projects
    })
  }

  static defaultProps = {
    projectsPostedByMe :[ ]
  }

  navigateToProjectDetails(projectbidded)  {
    this.props.dispatch(this.props.getProjectDetails(projectbidded))
    this.props.history.push("/projectDetails");
  }


  componentWillMount(){
    this.props.dispatch(this.props.getAllPostedProjectsbyMe(localStorage.getItem("userid")))
  }


  render(){
//    let display = this.state.display ? "" : "none";

    let renderPageNumbers = null;
    const { projects,currentPage, todosPerPage } = this.state;
    let current= undefined;
    /***********************************  Pagination for  Projectcs ***********************************/
    if(projects !== undefined){
      // Logic for displaying current todos
      const indexOfLast = currentPage * todosPerPage;
      const indexOfFirst= indexOfLast - todosPerPage;

     current = projects.slice(indexOfFirst, indexOfLast);


      // Logic for displaying page numbers
       const pageNumbers = [];
       for (let i = 1; i <= Math.ceil(projects.length / todosPerPage); i++) {
         pageNumbers.push(i);
       }

        renderPageNumbers = pageNumbers.map(number => {
         return (
           <li  className="page-item">
             <a class="page-link" key={number} id={number}  onClick={this.handleClick}>{number}</a>
           </li>
         );
       });

     }
    /***********************************  Pagination for  Projectcs ***********************************/

    return(
      <div>
        <DashBoardSwitch  />

          {this.state.projects.length>0 ?
            <div>
              <select className="form-control filter-dropdown" id="exampleFormControlSelect1"  onChange={this.statusChange} >
                <option>Open</option>
                <option>Closed</option>
                <option>Hiring</option>
              </select>

          <h3 className ="dashboard-heading">Project Posted by me</h3>
          <input type="text" className ="center-block" id="myInput" onKeyUp={this.searchProject} placeholder="Search for project names.." title="Type in a name"/>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Average Bid</th>
                <th>Freelancer Bidded</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {current.map(projectpost =>
                <tr style = {{display : projectpost.display}}>
                  <td> <a className = "cursor" onClick={() =>{this.navigateToProjectDetails(projectpost)}} >{projectpost.project.project_name} </a></td>
                  <td>{projectpost.mybid &&  projectpost.mybid.average_bid ? <div>$ {projectpost.mybid.average_bid }</div> : <div> No bids yet </div>}</td>
                  {projectpost.usersBidded !== undefined && projectpost.usersBidded.length > 0 ?
                  <td> {projectpost.usersBidded.map(user =>
                        <div><a className = "cursor" onClick = {()=> {this.navigateToUserDetails(user)}}>{user.username}</a></div>
                      )}</td> : <td>No bids yet</td>}
                  <td>{projectpost.project.status}</td>
                </tr>

              )}
                </tbody>
          </table>
          <ul className="pagination home-paginate">
           {renderPageNumbers}
         </ul>
         </div>:
            <div className = "dashboard-heading"><strong>Either your filter does not match the criteria or You havent posted a project yet!</strong>
              <div className = "row">
                <button className="btn-lg post-project-btn" onClick={() => { this.props.history.push("/postproject");}}  >Post a Project Now! </button>
              </div>
            </div>
         }
      </div>
    );
  }
}

export default withRouter(connect (mapStateToProps, mapDispatchToProps)(AsEmployer));
