import React,{Component} from 'react';
import {Typeahead} from 'react-bootstrap-typeahead';
import {getAllSkills, handleFileUpload,postProject,mapfilesToProject,mapSkillToProject,mapProjectToUser} from '../actions'
import { connect } from 'react-redux';

const mapDispatchToProps = (dispatch)=>{
  console.log("mapDispatchToProps");
  let actions = {getAllSkills, handleFileUpload, postProject,mapfilesToProject,mapSkillToProject,mapProjectToUser};
  return { ...actions, dispatch };
}
const mapStateToProps = (state) =>{
  console.log("mapStateToProps");
  return {
    allSkills : state.postProjectReducer.allSkills,
    uploadname :state.postProjectReducer.uploadname,
    originalname :state.postProjectReducer.originalname,
    username :state.signupReducer.username,
    projectid :state.postProjectReducer.projectid,
  //  userID : state.loginReducer.userID,
     userID :localStorage.getItem("userid") ? localStorage.getItem("userid") :  state.signupReducer.userID,
    projectfailMsg : state.postProjectReducer.projectfailMsg

  }
}


class PostProject extends Component{

  static defaultProps = {
    allSkills: []
  }


constructor(props){
    super(props);
    this.state= {
      projectname :'',
      projectdesc : '',
      budget : 'Micro Project ($10 - 30 USD)',
      selectedSkills :[],
      role : 'Employer',
      projectnamevalid : true,
      projectnameErrorMsg :'',
      projectdescvalid : true,
      projectdescErrorMsg :'',
      skillsvalid : true,
      skillsErrorMsg : ''
    }
    this.handlePostProject = this.handlePostProject.bind(this);
    this.handleProjectNameChange = this.handleProjectNameChange.bind(this);
    this.handleProjectDescChange = this.handleProjectDescChange.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.budgetChange = this.budgetChange.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleOptionSelected = this.handleOptionSelected.bind(this);
  }

  componentWillMount(){
    console.log("componentWillMount");
    this.props.dispatch(getAllSkills());
  }

  handleFileUpload(e) {
    if(this.props.uploadname=== undefined){
  	  this.props.dispatch(this.props.handleFileUpload(this.props, e.target.files[0]))
  	  //.then(() => this.props.dispatch(this.props.retriveFileList(this.props)));
    }else{
      alert("only one file can be uploaded");
    }
	}

  handleOptionSelected(option){
    let elementValue = option.length;
      if(elementValue == 0){
        this.setState({selectedSkills: option});
         this.setState({skillsvalid :false, skillsErrorMsg: "Please select atleast one skill"});
      }else{
           this.setState({skillsvalid :true, skillsErrorMsg: ""});
           this.setState({selectedSkills: option});
      }
  }

  handlePostProject(e){
    console.log("hello");
    if(this.state.projectname === '' || this.state.projectdesc === '' || this.state.selectedSkills.length ==0){
      if(this.state.projectname === ''){
         this.setState({projectnamevalid :false, projectnameErrorMsg: "Please enter an Project Name"});
         e.preventDefault();
      }
      if(this.state.projectdesc === ''){
         this.setState({projectdescvalid :false, projectdescErrorMsg: "Please enter an Project Description"});
         e.preventDefault();
      }
      if(this.state.selectedSkills.length ==0){
         this.setState({skillsvalid :false, skillsErrorMsg: "Please select atleast one skill"});
         e.preventDefault();
      }
    }else{

        this.props.dispatch(this.props.postProject(this.state))
        .then(() => {
          if(this.props.uploadname){
            this.props.dispatch(mapfilesToProject(this.props))
          }
        })
        .then(() =>  this.props.dispatch(mapSkillToProject(this.props, this.state)))
        .then(() => this.props.dispatch(mapProjectToUser(this.state, this.props)))
        .then(() =>  {
          if(localStorage.getItem("userid")){
              this.props.history.push("/home")
          }else{
              this.props.history.push("/completeProfile")
          }


        });
  }

  }
  handleProjectNameChange(e){
    let elementValue = e.target.value;
    if(elementValue === ''){
       this.setState({projectname: e.target.value});
       this.setState({projectnamevalid :false, projectnameErrorMsg: "Please enter an Project Name"});
    }else{
      this.setState({projectnamevalid :true, projectnameErrorMsg: ""});
       this.setState({projectname: e.target.value});
    }
  }

  handleProjectDescChange(e){
  let elementValue = e.target.value;
    if(elementValue == ''){
      this.setState({projectdesc: e.target.value});
       this.setState({projectdescvalid :false, projectdescErrorMsg: "Please enter an Project description"});
    }else{
         this.setState({projectdescvalid :true, projectdescErrorMsg: ""});
         this.setState({projectdesc: e.target.value});
    }

 }
 handleOptionChange(e){
   this.setState({
     selectedOption: e.target.value
  });
 }
 budgetChange(e){
    this.setState({budget: e.target.value});
 }

  render(){
    console.log("render");
    return(
      <div className="container  justify-content-md-center">

          <div className = "row">
            <a className="navbar-brand a-logo" href="#"><img className = "logo" src = "./images/icon.PNG"></img></a>
          </div>
          <br/>
          {this.props.projectfailMsg ? <div className="alert alert-login"><strong>{this.props.projectfailMsg}</strong></div> : null}
         <div className = "row">
            <h1><strong>Tell us what you need done</strong></h1>
            <div className="project-header-desc">
            Get free quotes from skilled freelancers within minutes, view profiles, ratings and portfolios and chat with them. Pay the freelancer only when you are 100% satisfied with their work.
            </div>
          </div>


          <div className = "row gap">
            <h4><strong>Choose a name for your project</strong></h4>
            <div className="project-header-desc">
              <input type = "text" className= "large-input project-input" placeholder= "e.g. Build me a website"  value={this.state.projectname} onChange={this.handleProjectNameChange} required/>
              <div className={this.state.projectnamevalid ? 'success' : 'text-input-error-wrapper'}>{this.state.projectnameErrorMsg}</div>
          </div>
          </div>

          <div className = "row gap">
            <h4><strong>Tell us more about your project</strong></h4>
            <div className="project-header-desc">
            Great project descriptions include a little bit about yourself, details of what you are trying to achieve, and any decisions that you have already made about your project. If there are things you are unsure of, don&apos;t worry, a freelancer will be able to help you fill in the blanks.
            </div>
            <textarea className = "project-more-desc"  value={this.state.projectdesc} onChange={this.handleProjectDescChange}  required></textarea>
            <div className={this.state.projectdescvalid ? 'success' : 'text-input-error-wrapper'}>{this.state.projectdescErrorMsg}</div>
         </div>
          <div  className = "row gap file-uploader-area">
              <span className="btn btn-plain btn-file-uploader">
                <span className="glyphicon glyphicon-plus gyp-project"></span>
                <span>
                <label htmlFor="files" className="btn btn-upload">Upload Files
                <input id="files" className  ="file-project" type="file" onChange={this.handleFileUpload}/> </label>
                </span>
              </span>
              <p className="file-upload-text" i18n-id="8ba4aac63453fd3fdafe224bf3602870" i18n-msg="Drag &amp; drop any images or documents that might be helpful in explaining your project brief here.">Drag &amp; drop any images or documents that might be helpful in explaining your project brief here.</p>

          </div>
          <div className ="row">
            {this.props.originalname ? <aside className="alert alert-info alert-file" role="alert"><strong>{this.props.originalname}</strong></aside> :null}
          </div>
          <div className = "row gap">
            <h4><strong>What skills are required?</strong></h4>
            <div className="project-header-desc">
              Enter up to 5 skills that best describe your project. Freelancers will use these skills to find projects they are most interested and experienced in.
            </div>

              <Typeahead
                clearButton
                labelKey={(option) => `${option.skill_name}`}
                multiple
                options={this.props.allSkills}
                placeholder="What Skills are required? "
                onChange={this.handleOptionSelected}
              />
            <div className={this.state.skillsvalid ? 'success' : 'text-input-error-wrapper'}>{this.state.skillsErrorMsg}</div>
          </div>

          <div className = "row gap">
            <h4><strong>How do you want to pay?</strong></h4>
            <input type="radio" value ='F' name="common-radio-name" id="radio-1" className="radio-button" checked={this.state.selectedOption === 'F'}
                      onChange={this.handleOptionChange} />
              <label htmlFor="radio-1" className="radio-button-click-target" required>
                <span className="radio-button-circle"></span>Fixed price project
              </label>
              <div className = "gap1"/>
            <input type="radio"  value ='H'  name="common-radio-name" id="radio-2" className="radio-button"  checked={this.state.selectedOption === 'H'}
                      onChange={this.handleOptionChange} />
              <label htmlFor="radio-2"  className="radio-button-click-target">
                <span className="radio-button-circle"></span>Hourly project
              </label>
          </div>

          <div className = "row gap">
            <h4><strong>What is your estimated budget?</strong></h4>
            <div>

              <select className="project-budget" id="exampleFormControlSelect1"  onChange={this.budgetChange} value={this.state.budget} required>
                <option>Micro Project ($10 - 30 USD)</option>
                <option>Simple project ($30 - 250 USD)</option>
                <option>Very small project ($250 - 750 USD)</option>
                <option>Small project ($750 - 1500 USD)</option>
                <option>Medium project ($1500 - 3000 USD)</option>
              </select>
            </div>

          </div>

            <div className = "row gap">
              <button className="btn-lg post-project-btn"  onClick={this.handlePostProject} >Post a Project</button>
            </div>

      </div>
    );
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(PostProject);
