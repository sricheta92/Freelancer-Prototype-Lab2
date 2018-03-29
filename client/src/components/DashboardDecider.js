import React,{Component} from 'react';
import AsFreelancer from './AsFreelancer';
import AsEmployer from './AsEmployer';
import { connect } from 'react-redux';


  const mapStateToProps = (state) => {
    return {
      dashboardViewisWorker  : state.userReducer.dashboardViewisWorker
    };
  }

class DashboardDecider extends Component{

  constructor(props){
    super(props);

  }

    render(){

      return(
        <div>
          {this.props.dashboardViewisWorker === undefined  ?
           <div>{this.props.role === 'Worker' ?  <AsFreelancer /> : <AsEmployer />}</div>
            :<div>{this.props.dashboardViewisWorker ? <AsFreelancer /> :   <AsEmployer />}</div>

        }
        </div>
      );
    }
}

export default connect(mapStateToProps, null)( DashboardDecider);
