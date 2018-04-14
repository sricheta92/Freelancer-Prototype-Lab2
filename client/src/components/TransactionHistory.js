import React, {Component} from 'react';
import { connect } from 'react-redux';
import FixedNav from './FixedNav';
import { manageTransaction} from '../actions'
import TransactionData from './TransactionData';

const mapDispatchToProps = (dispatch) => {

    let actions = {manageTransaction};
    return { ...actions, dispatch };

  }

const mapStateToProps = (state) => {
    return {

        project: state.postProjectReducer.project,
        transactionuser : state.userReducer.transactionuser
    }
}



class TransactionHistory extends Component{

  //
  // constructor(props){
  //   super(props);
  //   this.state = {
  //     gainedMoney : 0,
  //     lostMoney : 0
  //   }
  //
  // }
// componentWillReceiveProps(nextProps){
//   var gainedMoney=0;
//   var lostMoney =0;
//   nextProps.transactionuser.transactionhistory.map((history) =>{
//
//       if(Math.sign(history.money)<0){
//         lostMoney = lostMoney + Math.abs(history.money);
//       }else{
//         gainedMoney = gainedMoney+ history.money;
//       }
//     }
//     );
//   this.setState({
//     gainedMoney:gainedMoney,
//     lostMoney :lostMoney
//   });
// }

componentWillMount(){
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
  }
}

  render(){
    return(
      <div>

        <TransactionData />

      </div>
    )
  }

}

export default connect(mapStateToProps,mapDispatchToProps)(TransactionHistory);
