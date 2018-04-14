import React,{Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { getProjectDetails, getUserDetails,getUserSkills,getProfileDetails} from '../actions';

const mapDispatchToProps = (dispatch) => {

    let actions = {getProjectDetails, getUserDetails,getUserSkills,getProfileDetails};
    return { ...actions, dispatch };

  }

const mapStateToProps = (state) => {
    return {
      //  project : state.postProjectReducer.project
    }
}


class ProjectFeedItem extends Component{


  constructor(props){
    super(props);
    this.state={
      "display" : ""
    }
    this.navigateToProjectDetails = this.navigateToProjectDetails.bind(this);
    this.navigateToUserDetails = this.navigateToUserDetails.bind(this);
  }

  navigateToProjectDetails(event)  {
    event.preventDefault();
    this.props.dispatch(this.props.getProjectDetails(this.props.projectfeeditem))
    this.props.history.push("/projectDetails");
  }

  navigateToUserDetails(postedby){
    this.props.dispatch(this.props.getUserSkills(postedby._id))
    this.props.dispatch(this.props.getProfileDetails(postedby));
    this.props.history.push("/profile");
  }

  componentWillReceiveProps(){
    if (this.props.projectfeeditem.project.project_name.toUpperCase().indexOf(this.props.display) > -1 ||
    this.props.projectskills.find(skill => skill.name.toUpperCase().indexOf(this.props.display) > -1 ) )
    {
      this.setState({"display" : ""});
    }else{
      this.setState({"display" : "none"});
    }

  }

  componentWillMount(){
    if(this.props.display!== ""){

        if (this.props.projectfeeditem.project.project_name.toUpperCase().indexOf(this.props.display) > -1 ||
        this.props.projectskills.find(skill => skill.name.toUpperCase().indexOf(this.props.display) > -1 ) )
        {
           this.setState({"display" : ""});
        }else{
             this.setState({"display" : "none"});
        }
      }

  }

  render(){
  //      let display = this.props.display ? "" : "none";
  // let display = "";
  //          if (this.props.projectfeeditem.project.project_name.toUpperCase().indexOf(this.props.display) > -1) {
  //             display = ""
  //          }else{
  //           display ="none"
  //       }
  //
  //

    return(
      <div style = {{display :this.state.display}} className ="news-list-wrapper">
        <a onClick={this.navigateToProjectDetails}><h4 className = "" >
          {this.props.projectfeeditem.project.project_name}
        </h4></a>

        <span> {this.props.projectfeeditem.project.budget_range}</span>
        <div>  {this.props.projectfeeditem.project.description}</div>
        {this.props.projectskills ? this.props.projectskills.map( skill => <div>{skill.name}</div>) : null}
        <span><a className ="cursor" onClick={()=> {this.navigateToUserDetails(this.props.postedBy)}}>{this.props.postedBy.username}</a></span>
      </div>
    );
  }

}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(ProjectFeedItem));
