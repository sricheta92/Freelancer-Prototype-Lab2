import React, {Component} from 'react';
import DashBoardSwitch from './DashBoardSwitch';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {getAllBiddedProject,getProjectDetails,getUserDetails,hideDashboard} from '../actions'

const mapDispatchToProps = (dispatch) => {

    let actions = {getAllBiddedProject,getProjectDetails,getUserDetails,hideDashboard};
    return { ...actions, dispatch };

  }

  const mapStateToProps = (state) => {
    return {
      projectsBiddedByMe: state.userReducer.projectsBiddedByMe
    };
  }

class AsFreelancer extends Component{

  constructor(props){
    super(props);
    this.state ={
          display : true,
          showDashboard : true,
          projects : this.props.projectsBiddedByMe,
          currentPage: 1,
          todosPerPage: 1
    }
    this.navigateToProjectDetails = this.navigateToProjectDetails.bind(this);
    this.navigateToUserDetails = this.navigateToUserDetails.bind(this);
    this.searchProject = this.searchProject.bind(this);
    this.goToProjectFeed = this.goToProjectFeed.bind(this);
    this.statusChange = this.statusChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.projectsBiddedByMe !== this.props.projectsBiddedByMe){
      this.setState({
        projects : nextProps.projectsBiddedByMe
      })
     }
  }

  handleClick(event){
    this.setState({
            currentPage: Number(event.target.id)
    });
  }

  goToProjectFeed(){
    this.setState({showDashboard : false}, function(){
       this.props.dispatch(this.props.hideDashboard(this.state.showDashboard))
      this.props.history.push('/home');
    });
  }
  navigateToProjectDetails(projectbidded)  {
    this.props.dispatch(this.props.getProjectDetails(projectbidded))
    this.props.history.push("/projectDetails");
  }

  searchProject(event){
    var  elem = event.target.value;
    var filter = elem.toUpperCase();
    this.props.projectsBiddedByMe.map(projectpost =>  {
      if (projectpost.project.project_name.toUpperCase().indexOf(filter) > -1) {
        this.setState({
          display : true
        })
      }else{
        this.setState({
          display : false
        })
      }
    }
    );
  }
  navigateToUserDetails(postedby){
      this.props.dispatch(this.props.hideDashboard(false))
    this.props.dispatch(this.props.getUserDetails(postedby.userid))
    .then(()=>this.props.history.push("/user/"+ postedby.username ));
  }


  componentWillMount(){
    this.props.dispatch(this.props.getAllBiddedProject(localStorage.getItem("userid")))
  }

  static defaultProps = {
    projectsBiddedByMe :[

    ]
  }

  statusChange(event){
    var elem = event.target.value;
    var selectedProjects = [];
    this.props.projectsBiddedByMe.map(projectpost =>  {
        if (projectpost.project.status.toUpperCase().indexOf(elem.toUpperCase()) > -1) {
          this.setState({
            display : true
          })
          selectedProjects.push(projectpost);
        }else{
          this.setState({
            display : false
          })
        }
      }
    );
    this.setState({
      projects : selectedProjects
    })
  }

    render(){
      let display = this.state.display ? "" : "none";

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
            <DashBoardSwitch />
            {this.props.projectsBiddedByMe.length>0 ?
              <div>
                <select className="form-control filter-dropdown" id="exampleFormControlSelect1"  onChange={this.statusChange} >
                  <option>Open</option>
                  <option>Closed</option>
                  <option>Hiring</option>
                </select>

            <h3 className ="dashboard-heading">Project Bidded by me</h3>

           <input type="text" className ="center-block" id="myInput" onKeyUp={this.searchProject} placeholder="Search for project names.." title="Type in a name"/>
            <table class="table table-striped">
              <thead>
                <tr style = {{display : display}}>
                  <th>Project Name</th>
                  <th>Avg Bid</th>
                  <th>Your Bid</th>
                  <th>Status of  Project</th>
                </tr>
              </thead>
              <tbody>
                {current.map(projectbidded =>

                  <tr>
                    <td> <a className = "cursor" onClick={() =>{this.navigateToProjectDetails(projectbidded)}} >{projectbidded.project.project_name} </a></td>
                    <td>$ {projectbidded.mybid.average_bid}</td>
                    <td>$ {projectbidded.mybid.bid_price}</td>
                    <td>{projectbidded.project.status}</td>
                  </tr>
                )}

              </tbody>
  </table>
  <ul className="pagination home-paginate">
   {renderPageNumbers}
 </ul>
                    </div> :

  <div className = "dashboard-heading"><strong>You havent bidded for any project now!</strong>
    <div className = "row">
      <button className="btn-lg post-project-btn" onClick={ this.goToProjectFeed}  >Bid Now! </button>
    </div>
  </div>

 }
        </div>
      );
    }
}

export default  withRouter(connect (mapStateToProps, mapDispatchToProps)(AsFreelancer));
