import React,{Component} from 'react';
import { connect } from 'react-redux';
import {completeProfile,mapSkillToUser,handleFileUpload} from '../actions';
import { withRouter } from 'react-router-dom'

const mapDispatchToProps = (dispatch) => {

    let actions = {completeProfile,mapSkillToUser,handleFileUpload};
    return { ...actions, dispatch };
}

const mapStateToProps = (state) => {

  return {
      skills: state.skillReducer.skills,
      userID : localStorage.getItem("userid") ? localStorage.getItem("userid") :  state.signupReducer.userID,
      uploadname :state.postProjectReducer.uploadname,
      originalname :state.postProjectReducer.originalname

    };
}


class ProfileStep2 extends Component{

  constructor(props){
    super(props);
    this.state = {
      file : '',
      imagePreviewUrl : ''
    }
    this.handleComplete = this.handleComplete.bind(this);
    this.handleFile = this.handleFile.bind(this);
  }

  handleComplete(event) {
    event.preventDefault();
    this.setState({
      fname : this.refs.fname.value,
      lname : this.refs.lname.value,
      city :this.refs.city.value,
      phone :this.refs.phone.value,
      skills : this.props.skills,
      userID : this.props.userID,
      bio : this.refs.bio.value,
      headline : this.refs.headline.value,
      profilePic: this.props.uploadname

    },function(){
        this.props.dispatch(completeProfile(this.state))
        .then(() => this.props.dispatch(mapSkillToUser(this.state)))
        .then(  this.props.history.push("/login"));
    });
  }

  handleFile(e){
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file)

    this.props.dispatch(this.props.handleFileUpload(this.props, e.target.files[0]))
  }

  render(){
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} />);
    } else {
      $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
    }

    return(
      <div className = "profile-step2">
        <div className= "CompleteProfile col-md-4 col-lg-4 col-sm-4">
            <div className="CompleteProfile-header">
                <div className="CompleteProfile-header-title" >Complete Your Profile</div>
                <div className="CompleteProfile-header-subtitle">
                    Fill in your profile for employers to better understand your services when they visit your profile page.
                </div>
                <div className="CompleteProfile-header-subtitle" >
                    It is important to leave accurate information here to maximize your chances of getting jobs.
                </div>

                </div>

          </div>
          <div className= "col-md-8 col-lg-8 col-sm-8">
            <div className="imgPreview">
              {$imagePreview}
            </div>
            <form ole="form" method="POST" onSubmit = {this.handleComplete}>
              <div className="CompleteProfile-form">
                  <div className="form-group CompleteProfile-form-row">
                      <span className="CompleteProfile-form-header">Full Name</span>
                      <span className="CompleteProfile-form-input">
                          <input className="CompleteProfile-form-input-left large-input "  ref= "fname" type="text" placeholder="First Name" required/>
                          <input className="CompleteProfile-form-input-right large-input "   ref= "lname" type="text" placeholder="Last Name" required/>
                      </span>

                  </div>
                  <div className="form-group CompleteProfile-form-row">
                      <span className="CompleteProfile-form-header">Bio and Professional Headline </span>
                      <span className="CompleteProfile-form-input">
                          <textarea className="CompleteProfile-form-input-left large-input " ref= "bio" type="text" placeholder="Bio" required/>
                          <input className="CompleteProfile-form-input-right large-input " ref= "headline" type="text" placeholder="designation" required/>
                      </span>

                  </div>
                  <div className="form-group CompleteProfile-form-row gap">
                      <span className="CompleteProfile-form-header">Contact Information</span>
                      <span className="CompleteProfile-form-input">
                          <input className="CompleteProfile-form-input-left large-input " type="text" ref= "phone" pattern="^\d{3}-\d{3}-\d{4}$"  placeholder="Phone Number (format: xxx-xxx-xxxx)" required />
                          <input className="CompleteProfile-form-input-right large-input " type="text"ref="city" placeholder="City" required/>
                      </span>

                  </div>
                  <input type="file" onChange={this.handleFile} accept=".jpg,.jpeg,.PNG" required/>
                  <div className="form-group wizard-finish-btn pull-right">
                      <div >
                        <button id="complete-profile" type="submit" className="btn btn-info btn-large btn-submit large-input freelancer-font">
                          Create my profile and go to login page
                         </button>
                      </div>
                  </div>

              </div>
            </form>
          </div>

      </div>
    );
  }

}
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(ProfileStep2));
