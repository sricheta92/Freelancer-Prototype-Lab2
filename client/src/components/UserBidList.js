import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { getProfileDetails,hireUser,getProjectDetails,getUserSkills} from '../actions';


const mapDispatchToProps = (dispatch) => {

    let actions = {getProfileDetails,hireUser,getProjectDetails,getUserSkills};
    return { ...actions, dispatch };

  }

const mapStateToProps = (state) => {
    return {
      //projectBidStatus: state.postProjectReducer.projectBidStatus
    }
}


class UserBidList extends Component{

  constructor(props){
    super(props);
    this.state ={
      sortedUsers : this.props.users,
      sortedAsc :true,
      sortup :"glyphicon glyphicon-collapse-down",
      sortdown :"glyphicon glyphicon-collapse-up",
      project : this.props.project.project,
      skills : this.props.project.skills,
      postedBy : this.props.project.postedBy,
      usersBidded : this.props.project.usersBidded,
      file : this.props.project.file
    }
    this.navigateToUserDetails = this.navigateToUserDetails.bind(this);
    this.handleSort = this.handleSort.bind(this);
    //this.handleHire = this.handleHire.bind(this,props);
  }

  navigateToUserDetails(postedby){
    this.props.dispatch(this.props.getUserSkills( localStorage.getItem("userid")));
    this.props.dispatch(this.props.getProfileDetails(postedby))
    this.props.history.push("/profile");
  }

  handleHire(user){
    console.log(user);
    delete user.encodeImage;
    this.props.dispatch(this.props.hireUser(user));
    this.setState({
      project: {
        project : {
          ...this.state.project,
          status : 'HIRING',
          hiredFreelancer : user,
          submission :{
            comment : "",
            file : ""
          }
        },
        skills : [
            ...this.state.skills,
        ],
        postedBy :{
            ...this.state.postedBy,
        },
        usersBidded :[
            ...this.state.usersBidded,
        ],
        file :  this.state.file

      }
    },function(){
       alert("Email Sent!")
       this.props.dispatch(this.props.getProjectDetails(this.state.project));
    });

  }

  handleSort(){
    if(this.state.sortedAsc){
    this.state.sortedUsers = [].concat(this.props.users)
      .sort((a, b) => a.bid_price > b.bid_price)
    }else{
      this.state.sortedUsers = [].concat(this.props.users)
        .sort((a, b) => a.bid_price < b.bid_price)
    }
    this.setState({
      sortedAsc:!this.state.sortedAsc
    })
  }

  render(){
    return(
      <div id="bid-list-container" class="bid-list-containerWrapper Card Container">
        <div>
          <div id="bid-list-header" class="wider bid-list-freelancer">
            <div class="bid-user-info-header padding-t5 padding-b5 margin-l0">
              <a href="#"  class="text-white bold padding-l10">
                  Freelancers Bidding
                  <span id="bid-count">
                      (<span>{this.props.users.length}</span>)
                  </span>
                  <i class="disable-temp icon-white"></i>
              </a>
            </div>
            <div className="bid-sum-header padding-t5 align-c">
                <a  onClick = {this.handleSort} class="text-white bold cursor">
                    Bid (USD)  &nbsp;
                    <i class="disable-temp icon-white"></i>
                    <span class = {this.state.sortedAsc ? this.state.sortup : this.state.sortdown}/>
                </a>
                <a  class="text-white bold">
                     &nbsp; &nbsp; &nbsp;BID DAYS
                    <i class="disable-temp icon-white"></i>
                </a>
            </div>

            {localStorage.getItem("role") === 'Employer' && this.props.postedby === localStorage.getItem("userid") ?
            <div class="bid-sum-header padding-t5 align-c">
                <a href="#" class="text-white bold">
                    Action
                    <i class="disable-temp icon-white"></i>
                </a>
            </div> : null }
          </div>
            {this.props.users ?
          <div id="bid-list" class="Grid-col Grid-col--12 bid-list-freelancerWrapper  wider">

            { this.state.sortedUsers.map(user =>
              <div class="bid " >
                <img src = {user.bloburl} height="42"></img><a onClick = {()=> {this.navigateToUserDetails(user)}}>{user.username}</a>
                  {localStorage.getItem("role") === 'Employer'  && this.props.postedby === localStorage.getItem("userid")   ? <div className = "btn btn-info hire12" onClick = {this.handleHire.bind(this,user)}>Hire Now!</div> :null}
                <div className="bid-sum-header1">${user.bid_price} in {user.bid_days} days</div>

              </div>
            )}
          </div> : <div>No freelancer bidded yet for this project!</div> }
        </div>
      </div>
    )

  }

}

export default  withRouter(connect(mapStateToProps,mapDispatchToProps)(UserBidList));
