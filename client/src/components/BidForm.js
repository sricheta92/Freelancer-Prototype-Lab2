import React, {Component} from 'react';
import { connect } from 'react-redux';
import {saveBidOfUser} from '../actions';

const mapDispatchToProps = (dispatch) => {

    let actions = {saveBidOfUser};
    return { ...actions, dispatch };

  }

const mapStateToProps = (state) => {
    return {
      projectBidStatus: state.postProjectReducer.projectBidStatus
    }
}


class BidForm extends Component{
  static defaultProps = {
    projectBidStatus :false
  }


  constructor(props){
    super(props);
    this.state = {
       bid_price: "",
       bid_days: "",
       hourlyRateError : false,
       hourlyRateErrorMsg :"",
       bidPeriodError : false,
       bidPeriodErrorMsg : "",
       user_id : localStorage.getItem("userid"),
       project_id : this.props.projectID,
       projectBidStatus : false

     }
    this.handleSubmitBid = this.handleSubmitBid.bind(this);
    this.handleHourlyRateChange = this.handleHourlyRateChange.bind(this);
    this.handleBidPeriodChange = this.handleBidPeriodChange.bind(this);
  }

  handleSubmitBid(){
    if(this.state.bid_price ==='' || this.state.bid_days === ''){
      if(this.state.bid_days === ''){
           this.setState({bidPeriodError :true, bidPeriodErrorMsg: "Please enter a Bid period"});
      }
      if(this.state.bid_price === ''){
         this.setState({hourlyRateError :true, hourlyRateErrorMsg: "Please enter Hourly rate"});
      }
    }else{
        this.props.dispatch(this.props.saveBidOfUser(this.state))
        .then(()=>{
          this.setState({
            projectBidStatus : true
          })
        })
    }


  }


  handleBidPeriodChange(event){
    let elementValue = event.target.value;
    if(elementValue == ''){
       this.setState({bidPeriodError :true, bidPeriodErrorMsg: "Please enter a Bid period"});
    }else{
        var emailPattern = /^[0-9]/;
        if(!emailPattern.test(elementValue)){
           this.setState({bidPeriodError :true, bidPeriodErrorMsg: "Bid period must be in numbers"});
        }
        else{
          this.setState({bidPeriodError :false, bidPeriodErrorMsg:"",bid_days: elementValue}, function () {
            console.log("Bid period checked");
          });
        }
      }
    }

  handleHourlyRateChange(event){
    let elementValue = event.target.value;
    if(elementValue == ''){
       this.setState({hourlyRateError :true, hourlyRateErrorMsg: "Please enter a hourly rate"});
    }else{
        var emailPattern = /^[0-9]/;
        if(!emailPattern.test(elementValue)){
           this.setState({hourlyRateError :true, hourlyRateErrorMsg: "Hourly rate must be in numbers"});
        }
        else{
          this.setState({hourlyRateError :false, hourlyRateErrorMsg:"",bid_price: elementValue}, function () {
            console.log("hourly rate checked");
          });
        }
      }
    }

  render(){
    return(
        <div className = "bidform">
        <div id="frm_place_bid" className="fl-form" >
                <legend className="BidProposal-title">Bid Proposal</legend>
                <input type="hidden" name="id" value="16491277"/>
                <div id="error-messages" className="error hide message alert alert-error"></div>
                <div id="membership-low-bids-alert"></div>
                <div id="bid-stats" className="BidProposal-stats">
                    <fieldset className="BidProposal-row BidProposal-fieldset">
                        <div className="form-group col-md-2">

                                <label for="hourlyrate">Hourly Rate $(USD)</label>
                                <div className="control-group">
                                    <span className="input-group">

                                        <input className="form-control BidProposal-form-input earnedSum" name="sum" type="text" onBlur ={this.handleHourlyRateChange}/>
                                        <div className={this.state.hourlyRateError ? 'text-input-error-wrapper':  'success' }>{this.state.hourlyRateErrorMsg }</div>
                                        <input className="form-control sum actualBidAmount" type="hidden" name="sum" value="22.22"/>
                                    </span>
                                    <span className="small help-inline"></span>
                                </div>
                                </div>
                                <div className="form-group col-md-2">
                                <label for="weeklylimit">Bid Period (in Days)</label>
                                <div className="control-group">
                                    <span className="input-group">
                                        <input className="form-control BidProposal-form-input period" name="period" type="text"  onBlur ={this.handleBidPeriodChange}/>
                                        <div className={this.state.bidPeriodError ? 'text-input-error-wrapper':  'success' }>{this.state.bidPeriodErrorMsg }</div>
                                  </span>
                                    <span className="small help-inline"></span>
                                </div>
                                </div>
                                <br />
                                <div className="col-md-2" ><button  className="btn btn-primary " onClick={this.handleSubmitBid}>Submit</button></div>

                    </fieldset>
                </div>

                {this.state.projectBidStatus ?
                <div id="proposal-panel">
                  <div className="BidProposal-alert alert alert-success">
                          <strong>Your bid was placed successfully!</strong>
                    </div>
                </div> : null }
            </div>
        </div>
      );
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(BidForm);
