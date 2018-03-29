import React, {Component} from 'react';
import { connect } from 'react-redux';
import { login} from '../actions';
import Message from './Message';

const mapDispatchToProps = (dispatch) => {

    let actions = {login};
    return { ...actions, dispatch };

  }

  const mapStateToProps = (state) => {
    return {
      loginMsg: state.loginReducer.loginMsg,
      loginStatus : state.loginReducer.loginStatus
    };
  }


class Login extends Component {

  constructor(props){
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

handleSubmit(e){
  e.preventDefault();
  this.setState({
    useroremail : this.refs.useroremail.value,
    password : this.refs.password.value
  },function(){
      this.props.dispatch(login(this.state));
  })

}
componentWillReceiveProps(nextProps){
    console.log("componentWillReceiveProps");
  if(localStorage.getItem('jwtToken')){
    this.props.history.push('/home');
  }
}
componentWillReceiveProps(){
    console.log("componentWillReceiveProps");
  if(localStorage.getItem('jwtToken')){
    this.props.history.push('/home');
  }
}

componentDidMount(){
    console.log("componentDidMount");
  if(localStorage.getItem('jwtToken')){
      this.props.history.push('/home');
  }
}
componentDidUpdate(nextProps, nextState) {
    if(localStorage.getItem('jwtToken')){
        this.props.history.push('/home');
    }
}


render(){
  console.log("render");
  return(

    <div id="ModalExample" className="modal-signup modal ">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title text-xs-center"><img className = "logo modal-logo" src = "./images/icon-signup.PNG"></img></h4>
                    </div>

                    <div className="modal-body">

                      <Message  {...this.props}/>
                      <form role="form" method="POST" onSubmit = {this.handleSubmit} >
                            <input type="hidden" name="_token" value=""/>
                            <div className="form-group">
                                <input  className="form-control large-input" id="username" ref = "useroremail" name="useroremail" type="text" placeholder="Email or Username"/>
                            </div>
                            <div className="form-group">
                                <input  className="form-control large-input" id="password"  ref = "password" name="password" type="password" placeholder="Password"/>
                            </div>

                            <div className="form-group">
                                <div >
                                  <button id="signup_btn" type="submit" className="btn btn-info btn-large btn-submit large-input freelancer-font">
                                      Log In
                                   </button>
                                </div>
                            </div>
                        </form>
                        <span className="login-form-signup-link">
                            Dont have an account?
                            <a  onClick={() => { this.props.history.push("/signup");}} className="switch-to-login">Sign Up</a>
                        </span>
                      </div>

                            </div>
                        </div>
                      </div>


  )
}
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
