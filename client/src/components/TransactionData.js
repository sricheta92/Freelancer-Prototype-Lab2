import React, {Component} from 'react';
import { connect } from 'react-redux';
import FixedNav from './FixedNav';
import ChartComponent from './ChartComponent';


const mapDispatchToProps = (dispatch) => {

    let actions = {};
    return { ...actions, dispatch };

  }

const mapStateToProps = (state) => {
    return {
        transactionuser : state.userReducer.transactionuser
    }
}

class TransactionData extends Component{

    constructor(props){
      super(props);
      this.state = {
        gainedMoney : 0,
        lostMoney : 0
      }
    }

    componentWillMount(){
      var gainedMoney=0;
      var lostMoney =0;
      this.props.transactionuser.transactionhistory.map((history) =>{

          if(Math.sign(history.money)<0){
            lostMoney = lostMoney + Math.abs(history.money);
          }else{
            gainedMoney = gainedMoney+ history.money;
          }
        }
        );
      this.setState({
        gainedMoney:gainedMoney,
        lostMoney :lostMoney
      });
    }

    componentWillReceiveProps(nextProps){
      var gainedMoney=0;
      var lostMoney =0;
      nextProps.transactionuser.transactionhistory.map((history) =>{

          if(Math.sign(history.money)<0){
            lostMoney = lostMoney + Math.abs(history.money);
          }else{
            gainedMoney = gainedMoney+ history.money;
          }
        }
        );
      this.setState({
        gainedMoney:gainedMoney,
        lostMoney :lostMoney
      });
    }

    render(){
      return(
        <div>
        <FixedNav />
        <div class="container">
          <div className = "center-block">
            <ChartComponent gained = {this.state.gainedMoney} lost = {this.state.lostMoney}/>
          </div>
           <div class="row">

            <div class="card">
             <div class="card-body">
               <h4 class="card-title"><strong>Total Funds</strong></h4>
               <p class="card-text"><strong>Total money sent to freelancer : <span className ="btn-danger text-white">$ {this.state.lostMoney}</span></strong> </p>
              <p class="card-text"><strong>Total money gained from Employer : <span className ="btn-success text-white"> $ {this.state.gainedMoney}</span></strong></p>
             </div>
           </div>
           <div class="table-responsive">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Project Name</th>
                  <th>To Freelancer/From Freelancer</th>
                  <th>Email</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>

              {this.props.transactionuser!== undefined ?
              <tbody>

                {this.props.transactionuser.transactionhistory.map((history,index) =>
                  <tr>
                    <td>{index}</td>
                    <td>{history.project.project_name}</td>
                    <td>{history.project.hiredFreelancer.username}</td>
                    <td>{history.project.hiredFreelancer.email}</td>
                    <td>${history.money}</td>
                    <td>Payment Successful</td>
                  </tr>
                )}
            </tbody>  :   null}

            </table>


            </div>
            </div>
  </div>
    </div>
      )
    }

}

export default connect(mapStateToProps,mapDispatchToProps)(TransactionData);
