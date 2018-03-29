import React,{Component} from 'react';
import Switch from "react-switch";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {getDashboardSwitchStatus} from '../actions'

const mapDispatchToProps = (dispatch) => {

    let actions = {getDashboardSwitchStatus};
    return { ...actions, dispatch };

  }

  const mapStateToProps = (state) => {
    return {
      dashboardSwitchStatus  : state.userReducer.dashboardViewisWorker
    };
  }


class DashBoardSwitch extends Component{

  constructor(props) {
    super(props);
    let isWorker;
    if(localStorage.getItem("role") ==='Worker'){
      isWorker = true;
    }else{
      isWorker= false;
    }
    this.state = { checked: isWorker };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(checked) {
    this.setState({ checked },function(){
      this.props.dispatch(getDashboardSwitchStatus(this.state.checked))
    });
  }

  render() {
    var checked, unchecked;
    if(localStorage.getItem("role") ==='Worker'){
      checked = true;
      unchecked = false;
    }else{
      checked = false;
      unchecked = true;
    }
   return (
           <label htmlFor="normal-switch" className = "dashboard-switch">
             <Switch
               onChange={this.handleChange}
               checked={this.state.checked}
               id="normal-switch"
               checkedIcon = {checked}
               uncheckedIcon = {unchecked}

             />
           </label>
         );
       }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DashBoardSwitch));
