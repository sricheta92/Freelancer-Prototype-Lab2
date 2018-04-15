import React, {Component} from 'react';
import { connect } from 'react-redux';
import { signup , checkUser, checkEmail,mapProjectToUser} from '../actions';


const mapDispatchToProps = (dispatch) => {
    console.log('mapDispatchToProps called');
    let actions = {signup, checkEmail, checkUser,mapProjectToUser};
    return { ...actions, dispatch };

  }

const mapStateToProps = (state) => {
  console.log("mapStateToProps called");
  return {

    emailErrorMsg: state.signupReducer.emailErrorMsg,
    emailValid : state.signupReducer.emailValid,
    usernameErrorMsg : state.signupReducer.usernameErrorMsg,
    usernameValid : state.signupReducer.usernameValid,
    signupStatus :state.signupReducer.signupStatus,
    userID : state.signupReducer.userID,
    projectid : state.postProjectReducer.projectid

  };
}


class Signup extends Component {

  constructor(props){
    console.log("constructor called");
    super(props);
     this.state = {
        username:"",
        email:"",
        password:"",
        uiemailErrorMsg : "",
        usernameError :"",
        uiemailValid :true,
        validuser : true,
        passwordError :"",
        validPassword :false,
        role : ""

    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

componentWillReceiveProps(nextProps){
  if(nextProps.signupStatus)
    if(this.state.role === "Employer" ){
      this.props.history.push("/postproject");
    }
    // if(this.state.role === "Employer" ){
    //   this.props.dispatch(this.props.mapProjectToUser(this.state, this.props))
    //   .then(()=>this.props.history.push("/login"));
    // }
    if(this.state.role === "Worker"){
      this.props.history.push("/completeProfile");
    }
}


  handleSubmit(e){
    e.preventDefault();
    if(this.state.uiemailValid && this.state.validuser && this.state.validPassword ){
      var role1;

        if(this.refs.looking_for_hire.checked){
          role1 = this.refs.looking_for_hire.value;
        }else{
          role1 = this.refs.looking_for_work.value;
        }

      this.setState({
        role : role1
     },function(){
          this.props.dispatch(signup(this.state));
      })
    }
  }

  handleEmailChange(event){

    let elementValue = event.target.value;
    if(elementValue == ''){
       this.setState({uiemailValid :false, uiemailErrorMsg: "Please enter an email address"});
    }else{
        var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if(!emailPattern.test(elementValue)){
           this.setState({uiemailValid :false, uiemailErrorMsg: "Please enter a valid email address"});
        }else{
          this.setState({uiemailValid :true, uiemailErrorMsg:"",email: elementValue}, function () {
              this.props.dispatch(checkEmail(this.state));
          });
        }
      }
  }

  handleUsernameChange(event){
    let elementValue = event.target.value;
    if(elementValue == ''){
       this.setState({validuser :false, usernameError: "Please enter a username"});
    }else{

        var emailPattern = /^[a-zA-Z][a-zA-Z0-9]/;
        if(!emailPattern.test(elementValue)){
           this.setState({validuser :false, usernameError: "Username must be alphanumeric starting with a letter"});
        }else{
        this.setState({validuser :true, usernameError:"",username: elementValue}, function () {
              this.props.dispatch(checkUser(this.state));
          });
        }
      }

  }

  handlePasswordChange(event){
    event.preventDefault();
    let elementValue = event.target.value;
    if(elementValue == ''){
       this.setState({validPassword :false, passwordError: "Please enter a password"});
    }else if(elementValue.length < 6){
       this.setState({validPassword :false, passwordError: "Password must be 6 characters minimum"});
    }else{

        var emailPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
        if(!emailPattern.test(elementValue)){
           this.setState({validPassword :false, passwordError: "Please provide a stronger password which inludes uppercase,numbers and alphanumeric character"});
        }else{
        this.setState({validPassword :true, passwordError:"",password: elementValue}, function () {
              console.log("");
          });
        }
      }
  }



  render(){
  console.log('render called');
  return(
    <div id="ModalExample" className="modal-signup modal ">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title text-xs-center"><img className = "logo modal-logo" src = "./images/icon-signup.PNG"></img></h4>
                    </div>
                    <h3 className="modal-title text-xs-center">Sign up for <em>free</em> today!</h3>
                    <div className="modal-body">

                        <form role="form" method="POST"  onSubmit = {this.handleSubmit.bind(this)}>
                            <input type="hidden" name="_token" value=""/>
                            <div className="form-group">
                              <input  required className={"form-control large-input "+  ((this.props.emailValid || this.state.uiemailValid) ? 'good-input' : 'bad-input')} id="email" name="email" type="email" placeholder="Email Address" onBlur = {this.handleEmailChange} />
                               {this.state.uiemailValid ? <div className={this.props.emailValid   ? 'success' : 'text-input-error-wrapper'}>{this.props.emailErrorMsg}</div> :
                               <div className={this.state.uiemailValid ? 'success' : 'text-input-error-wrapper'}>{this.state.uiemailErrorMsg}</div>}
                            </div>
                            <div className="form-group">
                                <input  required className="form-control large-input" id="username" name="username" type="text" placeholder="Username" onBlur ={this.handleUsernameChange} />
                                  <div className={this.props.usernameValid ? 'success' : 'text-input-error-wrapper'}>{this.props.usernameErrorMsg}</div>
                                  <div className={this.state.validuser ? 'success' : 'text-input-error-wrapper'}>{this.state.usernameError}</div>
                            </div>
                            <div className="form-group">
                                <input  className="form-control large-input" maxLength="10" id="password" name="password" type="password" placeholder="Password"  onBlur ={this.handlePasswordChange}  required/>
                                <div className={this.state.validPassword ? 'success' : 'text-input-error-wrapper'}>{this.state.passwordError}</div>
                            </div>

                            <div className="btn-group form-group" role="group" aria-label="Basic example">
                              <label className="btn btn-secondary"><input type="radio" name="looking_for" ref = "looking_for_hire" id="looking_to_hire" value="Employer"/>Hire</label>
                              <label className="btn btn-secondary"><input type="radio" name="looking_for" ref = "looking_for_work" id="looking_for_work" value="Worker"/>Work</label>
                            </div>

                            <div className="form-group">
                                <div >
                                  <button id="signup_btn" type="submit" className="btn btn-info btn-large btn-submit large-input freelancer-font">
                                      Create Account
                                   </button>
                                </div>
                            </div>
                        </form>
                        <span className="login-form-signup-link">
                            Already have an account?
                            <a  onClick={() => { this.props.history.push("/login");}} className="switch-to-login">Log in</a>
                        </span>
                    </div>

                </div>
            </div>
          </div>
  )
}

}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
