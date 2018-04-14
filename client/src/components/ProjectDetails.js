import React, {Component} from 'react';
import { connect } from 'react-redux';
import FixedNav from './FixedNav';
import BidForm from './BidForm';
import UserBidList from './UserBidList';
import SubmissionFreelancer from './SubmissionFreelancer';
import SubmissionEmployer from './SubmissionEmployer';
import AddMoneyComponent from './AddMoneyComponent';
import { manageTransaction,getProjectDetails} from '../actions';
import {Modal,Button} from 'react-bootstrap';

const mapDispatchToProps = (dispatch) => {

    let actions = {manageTransaction,getProjectDetails};
    return { ...actions, dispatch };

  }

const mapStateToProps = (state) => {
    return {
      project: state.postProjectReducer.project,
      hireStatus : state.userReducer.hireStatus,
      solutionSubmitStatus : state.userReducer.solutionSubmitStatus,
      solutionSubmitMessage :state.userReducer.solutionSubmitMessage
    }
}


class ProjectDetails extends Component{

  constructor(props){
    super(props);
    this.state={
      showComponent : false,
      averageBid : 0,
      addMoneyComponenet :false
    };
    this.toggleBidForm = this.toggleBidForm.bind(this);
    this.makePayment = this.makePayment.bind(this);
    this.close = this.close.bind(this);
    this.addMoney = this.addMoney.bind(this);
  }

  static defaultProps = {
     project: {
       project :{
                projectname :'',
                 },
       skills :[{
         name :''
       }],
       usersBidded : [],
       file :'',
       solutionSubmitStatus :false,
       solutionSubmitMessage :''

     }
  }

  addMoney(){

   let data = {
          project : this.props.project.project,
          postedby : localStorage.getItem("userid")
   }
    this.props.dispatch(this.props.manageTransaction(data));
    this.props.dispatch(this.props.getProjectDetails(this.props.project.project))
    this.props.history.push("/transaction");
  }

makePayment(){


     let data = {
      project : this.props.project.project,
      postedby : localStorage.getItem("userid")
    }
    if(this.props.project.project.hiredFreelancer.wallet === undefined){
        this.setState({
          addMoneyComponenet : true
        })
    }else{
        this.props.dispatch(this.props.manageTransaction(data));
        this.props.dispatch(this.props.getProjectDetails(this.props.project.project))
        this.props.history.push("/transaction");
      }

}
toggleBidForm(){
   this.setState(function(prevState) {
     return {showComponent: !prevState.showComponent};
   });
}

componentWillMount(){
   let data = this.props.project.usersBidded;
   var sum = 0;
   let bidAverage;
   data.forEach(function(user){
     sum = sum + user.bid_price;
   });
   bidAverage = sum/data.length;
   this.setState({averageBid : bidAverage});
}

close() {
   this.setState({ addMoneyComponenet: false });
 }

render(){
  return(
    <div>
      <FixedNav />
      {this.state.addMoneyComponenet ?

        <Modal show={this.state.addMoneyComponenet} onHide={this.close}>
                <Modal.Header closeButton>
                  <Modal.Title>Add Money</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <AddMoneyComponent triggerAddMoney = {this.addMoney}  amount = {this.props.project.project.hiredFreelancer.bid_price} />
                  <hr />

                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={this.close}>Close</Button>
                </Modal.Footer>
              </Modal>

        : null}
      {this.props.solutionSubmitStatus ?
      <div id="proposal-panel" class="center-block"><div class="alert alert-success alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">×</a><strong>{this.props.solutionSubmitMessage}</strong></div></div> :null}
      <div className = "gaf-container" >
      <div id="projectHeader">
                <div className="project-header-controls span8">
                    <h1 className="project_name largest bold margin-b5 span12">{this.props.project.project.project_name}</h1>
                    <div className="span12 margin-0"></div>
                </div>
              <div className="clear"></div>
        </div>
        <div className="row col-md-12 well well2 white silver span padding-5 align-c margin-t10 margin-l10 margin-b10 PageFreelancerPvp-infoBar-details">
          <div  className="align-c padding-r10 padding-l5 project-view-status col-md-10">
              <div>
                  <span className = "col-md-3">
                    <span>Bids</span>
                    <span id="num-bids" className="text-blue larger bold">{this.props.project.usersBidded.length}</span>
                  </span>
                  <span  className="col-md-3 align-c padding-l10 padding-r10 border-r border-l project-view-status">
                      <span>Avg Bid (USD)</span>
                      <div className="text-blue larger bold">
                          $<span id="avg-bid">{this.state.averageBid}</span>
                      </div >
                  </span>
                  <span  className="col-md-3 align-c padding-l10 padding-r5 project-view-status">
                      <div>Project Budget Range</div>
                      <div className="text-blue bold project-budget">{this.props.project.project.budget_range}</div>
                  </span>
              </div>
              <div>
                {this.props.project.postedBy._id !== localStorage.getItem("userid") && this.props.project.project.status === 'OPEN'?
                <button className = "btn btn-success pull-right font-bold" onClick = {this.toggleBidForm}>Bid Now!</button> : null}

              </div>
            </div>
          </div>
        </div>
        <div className = "project-details-div">
          <h5 className = "project-subheader">Project Description : </h5> <br/>
          <textarea className = "form-control project-desc-text" readOnly >{this.props.project.project.description}</textarea>
        </div>
        <div className = "project-details-div">
          <h5  className = "project-subheader">Skills Required : </h5 >
          {this.props.project.skills.map(skill => <span>{skill.name}, </span>)}
        </div>
        {this.props.project.file ?
        <div className = "project-details-div">
          <h5 className = "project-subheader">Project related files : </h5>
          <span>{this.props.project.file}</span>
        </div> :null }
        {this.state.showComponent ?
           <BidForm projectID = {this.props.project.project.project_id}/> :
           null
        }
        {this.props.project.project.status === 'OPEN' ?
        <UserBidList project = {this.props.project} postedby = {this.props.project.postedBy._id} users = {this.props.project.usersBidded} />
        :
        <div>
          {localStorage.getItem("userid") === this.props.project.project.hiredFreelancer.userid  ? <SubmissionFreelancer  project = {this.props.project.project}/>
        : <div>{localStorage.getItem("userid") === this.props.project.postedBy._id ? <SubmissionEmployer triggerAddFormComponent={this.makePayment} project = {this.props.project.project}/> :
        <div class="alert alert-danger center-block">
          <strong>Hiring Closed!!!</strong> 
        </div>
      }</div>}
        </div>
        }

    </div>
  )
}

}

export default connect(mapStateToProps,mapDispatchToProps)(ProjectDetails);
