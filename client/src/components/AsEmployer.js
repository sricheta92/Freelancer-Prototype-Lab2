import React, {Component} from 'react';
import DashBoardSwitch from './DashBoardSwitch';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {getAllPostedProjectsbyMe,getProjectDetails} from '../actions'


  const mapDispatchToProps = (dispatch) => {

      let actions = {getAllPostedProjectsbyMe,getProjectDetails};
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
    // this.state = {
    //   isFreelancer : true,
    //   freelancerText : 'Freelancer',
    //   employerText : 'Employer'
    // }
    this.navigateToProjectDetails = this.navigateToProjectDetails.bind(this);
  }

  static defaultProps = {
    projectsPostedByMe :[
        // "project" :{
        //   "project_name" :'',
        // },
        // "postedBy" :{
        //   "username" :'',
        //
        // },
        // "mybid" :{
        //   "average_bid" :'',
        //   "bid_price" :''
        // }
    ]

  }

  navigateToProjectDetails(projectbidded)  {
    this.props.dispatch(this.props.getProjectDetails(projectbidded))
    this.props.history.push("/projectDetails");
  }


  componentWillMount(){
    this.props.dispatch(this.props.getAllPostedProjectsbyMe(localStorage.getItem("userid")))
  }


  render(){
    return(
      <div>
        <DashBoardSwitch  />

          {this.props.projectsPostedByMe.length>0 ?
            <div>
          <h3 className ="dashboard-heading">Project Posted by me</h3>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Average Bid</th>
                <th>Freelancer name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {this.props.projectsPostedByMe.map(projectpost =>
                <tr>
                  <td> <a className = "cursor" onClick={() =>{this.navigateToProjectDetails(projectpost)}} >{projectpost.project.project_name} </a></td>
                  <td>{projectpost.mybid ? <div> {projectpost.mybid.average_bid }</div> : <div>$ Not bids yet </div>}</td>
                  <td> {projectpost.usersBidded.map(user => function(){
                      {user.firstname}   {user.lastname}
                    })}</td>
                  <td>Open</td>
                </tr>
              )}

            </tbody>
          </table> </div>:
            <div className = "dashboard-heading"><strong>You havent posted a project yet!</strong>
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
