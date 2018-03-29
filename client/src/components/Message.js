import React , {Component} from 'react';
import { connect } from 'react-redux';

const mapStateToProps = (state) =>{
  return{
    loginStatus :state.loginStatus,
    loginMsg : state.loginMsg

  }
}

class Message extends Component{

  constructor(props){
    super(props);
  }

  render(){
    return(
      <div>
        {this.props.loginMsg ?<aside className="alert alert-login"><strong>{this.props.loginMsg}</strong></aside> :null}
      </div>
    );
  }

}

export default (Message);
