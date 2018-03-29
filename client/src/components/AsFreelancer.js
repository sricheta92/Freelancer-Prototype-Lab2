import React, {Component} from 'react';
import DashBoardSwitch from './DashBoardSwitch';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {getAllBiddedProject,getProjectDetails,getUserDetails} from '../actions'

const mapDispatchToProps = (dispatch) => {

    let actions = {getAllBiddedProject,getProjectDetails,getUserDetails};
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
    this.navigateToProjectDetails = this.navigateToProjectDetails.bind(this);
    this.navigateToUserDetails = this.navigateToUserDetails.bind(this);
  }

  navigateToProjectDetails(projectbidded)  {
    this.props.dispatch(this.props.getProjectDetails(projectbidded))
    this.props.history.push("/projectDetails");
  }

  navigateToUserDetails(postedby){
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

    render(){
      return(
        <div>
            <DashBoardSwitch />
            <h3 className ="dashboard-heading">Project Bidded by me</h3>
            {this.props.projectsBiddedByMe.length>0 ?
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Employer</th>
                  <th>Avg Bid</th>
                  <th>Your Bid</th>
                  <th>Status of  Project</th>
                </tr>
              </thead>
              <tbody>
                {this.props.projectsBiddedByMe.map(projectbidded =>

                  <tr>
                    <td> <a className = "cursor" onClick={() =>{this.navigateToProjectDetails(projectbidded)}} >{projectbidded.project.project_name} </a></td>
                    <td><a  className = "cursor" onClick={() =>{this.navigateToUserDetails(projectbidded.postedBy)}}>{projectbidded.postedBy.username}</a></td>
                    <td>$ {projectbidded.mybid.average_bid}</td>
                    <td>$ {projectbidded.mybid.bid_price}</td>
                    <td>Open</td>
                  </tr>
                )}

              </tbody>
  </table> :null }
        </div>
      );
    }
}

export default  withRouter(connect (mapStateToProps, mapDispatchToProps)(AsFreelancer));
