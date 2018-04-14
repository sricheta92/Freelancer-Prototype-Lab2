import React, {Component} from 'react';
import { connect } from 'react-redux';
import { handleFileUpload,submitProjectSolution,handleDownload} from '../actions'

const mapDispatchToProps = (dispatch) => {

    let actions = {handleFileUpload,submitProjectSolution,handleDownload};
    return { ...actions, dispatch };

  }

const mapStateToProps = (state) => {
    return {
      uploadname :state.postProjectReducer.uploadname,
      originalname :state.postProjectReducer.originalname
    }
}


class SubmissionFreelancer extends Component{

  constructor(props){
    super(props);
    this.state ={
      comment : ''
    }
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.doSubmission = this.doSubmission.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
  }

  static defaultProps ={
    solutionSubmitStatus :false,
    solutionSubmitMessage : ''
  }

  doSubmission(){
    let data = {
      project_id : this.props.project.project_id,
      submission :{
        comment : this.state.comment,
        file : this.props.uploadname
      }
    }
    this.props.dispatch(this.props.submitProjectSolution(data));
  }

  handleCommentChange(event){
    let elementValue = event.target.value;
    if(elementValue !== ''){
       this.setState({comment : elementValue});
    }else{
      //TODO validation
    }
  }

  handleFileUpload(e) {
      this.props.dispatch(this.props.handleFileUpload(this.props, e.target.files[0]));
  }

  handleDownload(){
      this.props.dispatch(this.props.handleDownload(this.props.originalname,this.props.uploadname));
  }

  render(){
    return(
      <div class = "project-submission-text project-details-div"> <h4 className = "project_name largest bold margin-b5 span12">Submission Panel</h4>
        <div >
          <div class="form-group">
            <label for="submission">Solution Comments</label>
            <textarea class="form-control" id="submission" rows="3"  onBlur = {this.handleCommentChange} required>{this.props.project.submission.comment}</textarea>
          </div>
          <div class="form-group">
           <label for="submissionFile">Upload your solution</label>
           <input type="file" class="form-control-file" id="submissionFile" onChange={this.handleFileUpload}/>
         </div>
         <div className ="form-group">
           {this.props.originalname ?<aside className="alert alert-info alert-file" role="alert"><strong><a className = "cursor" onClick = {this.handleDownload} >{this.props.originalname}</a></strong></aside> :
           <div>{this.props.project.submission.file ? <aside className="alert alert-info alert-file" role="alert"><strong><a className = "cursor" onClick = {this.handleDownload} >{this.props.project.submission.file}</a></strong></aside> : null} </div>
         }
         </div>
          <button type="submit" class="btn btn-info" onClick={this.doSubmission}>Submit</button>

        </div>
      </div>
    );
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(SubmissionFreelancer);
