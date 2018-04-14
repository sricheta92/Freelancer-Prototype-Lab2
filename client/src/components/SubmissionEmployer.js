import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { handleDownload,manageTransaction} from '../actions'

const mapDispatchToProps = (dispatch) => {

    let actions = {handleDownload,manageTransaction};
    return { ...actions, dispatch };

  }

const mapStateToProps = (state) => {
    return {

    }
}


class SubmissionEmployer extends Component{
  constructor(props){
    super(props);
    let filename = this.props.project.submission.file;
    var res1 = filename.split(".");
    var res = filename.split(".",2);
    let originalname = res[1]+"."+res1[2] ;
    this.state ={
      originalname : originalname,
      addMoneyComponenet :false
    }
    this.makePayment = this.makePayment.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
  }

  makePayment(){

   let data = {
    project : this.props.project,
    postedby : localStorage.getItem("userid")
  }
  if(this.props.project.hiredFreelancer.wallet === undefined){
      this.setState({
        addMoneyComponenet : true
      })
  }else{
      this.props.dispatch(this.props.manageTransaction(data));
      this.props.dispatch(this.props.getProjectDetails(this.props.project))
      this.props.history.push("/transaction");
    }
  }

  handleDownload(){
    this.props.dispatch(this.props.handleDownload(this.state.originalname,this.props.project.submission.file));
  }

  render(){
    return(
      <div class = "project-submission-text project-details-div"> <h4 className = "project_name largest bold margin-b5 span12">Submission Panel</h4>
        <div >
          <div class="form-group">
            <label for="submission">Solution Comments</label>
            <textarea class="form-control"   id="submission" rows="3"  readOnly>{this.props.project.submission.comment}</textarea>
          </div>

         <div className ="form-group">
           {this.props.project.submission.file ? <aside className="alert alert-info alert-file" role="alert"><strong><a className = "cursor" onClick = {this.handleDownload} >{this.state.originalname}</a></strong></aside> : null}
         </div>
          <button class="btn btn-danger"  onClick={this.props.triggerAddFormComponent}>Make Payement</button>

        </div>
      </div>
    );
  }

}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SubmissionEmployer));
