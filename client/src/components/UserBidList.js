import React, {Component} from 'react';
import { connect } from 'react-redux';
import { getUserDetails} from '../actions';


const mapDispatchToProps = (dispatch) => {

    let actions = {getUserDetails};
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
    this.navigateToUserDetails = this.navigateToUserDetails.bind(this);
  }

  navigateToUserDetails(postedby){
    this.props.dispatch(this.props.getUserDetails(postedby.userid))
    .then(()=>this.props.history.push("/user/"+ postedby.username ));
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
                <a href="#" class="text-white bold">
                    Bid (USD)
                    <i class="disable-temp icon-white"></i>
                </a>
            </div>
            {localStorage.getItem("role") === 'Employer' ?
            <div class="bid-sum-header padding-t5 align-c">
                <a href="#" class="text-white bold">
                    Action
                    <i class="disable-temp icon-white"></i>
                </a>
            </div> : null }
          </div>
            {this.props.users ?
          <div id="bid-list" class="Grid-col Grid-col--12 bid-list-freelancerWrapper  wider">
          {this.props.users.map(user =>
            <div class="bid " >
              <img src = {user.bloburl} height="42"></img><a onClick = {()=> {this.navigateToUserDetails(user)}}>{user.username}</a>
              <div className="bid-sum-header1">${user.bid_price} in {user.bid_days} days</div>
              {localStorage.getItem("role") === 'Employer' ?<span className = "btn btn-info hire12">Hire Now!</span> :null}
            </div>
          )}
          </div> : <div>No freelancer bidded yet for this project!</div> }
        </div>
      </div>
    )

  }

}

export default connect(mapStateToProps,mapDispatchToProps)(UserBidList);
