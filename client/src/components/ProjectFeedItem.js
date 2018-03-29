import React,{Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { getProjectDetails, getUserDetails} from '../actions';

const mapDispatchToProps = (dispatch) => {

    let actions = {getProjectDetails, getUserDetails};
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
    this.navigateToProjectDetails = this.navigateToProjectDetails.bind(this);
    this.navigateToUserDetails = this.navigateToUserDetails.bind(this);
  }

  navigateToProjectDetails()  {
    this.props.dispatch(this.props.getProjectDetails(this.props.projectfeeditem))
    this.props.history.push("/projectDetails");
  }

  navigateToUserDetails(postedby){
    this.props.dispatch(this.props.getUserDetails(postedby.userid))
    .then(() => this.props.history.push("/user/"+ postedby.username ));
  }

  render(){
    return(
      <div className ="news-list-wrapper">
        <a onClick={this.navigateToProjectDetails}><h4 className = "" >
          {this.props.projectfeeditem.project.project_name}
        </h4></a>
        <button className = "btn btn-success pull-right font-bold">Bid Now!</button>
        <span> {this.props.projectfeeditem.project.budget_range}</span>
        <div>  {this.props.projectfeeditem.project.description}</div>
        {this.props.projectskills ? this.props.projectskills.map( skill => <div>{skill.name}</div>) : null}
        <span><a className ="cursor" onClick={()=> {this.navigateToUserDetails(this.props.postedBy)}}>{this.props.postedBy.username}</a></span>
      </div>
    );
  }

}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(ProjectFeedItem));
