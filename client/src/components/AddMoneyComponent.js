import React, {Component} from 'react';
import { connect } from 'react-redux';



class AddMoneyComponent extends Component{

  constructor(props){
    super(props);
  }

  render(){
    return(
      <div >
      <div class="form-group">
       <label class="col-sm-3 control-label" for="card-holder-name">Name on Card</label>
       <div class="col-sm-9">
         <input type="text" class="form-control" name="card-holder-name" id="card-holder-name" placeholder="Card Holder's Name"/>
       </div>
      </div>

      <div class="form-group">
       <label class="col-sm-3 control-label" for="card-holder-name">Amount payable</label>
       <div class="col-sm-9">
         <input readOnly type="text" class="form-control" value = {this.props.amount}name="card-holder-name" id="card-holder-name" placeholder="Card Holder's Name"/>
       </div>
      </div>

     <div class="form-group">
       <label class="col-sm-3 control-label" for="card-number">Card Number</label>
       <div class="col-sm-9">
         <input type="text" class="form-control" name="card-number" id="card-number" placeholder="Debit/Credit Card Number"/>
       </div>
     </div>

     <div class="form-group">
       <label class="col-sm-3 control-label" for="expiry-month">Expiration Date</label>
       <div class="col-sm-9">
         <div class="row">
           <div class="col-xs-3">
             <select class="form-control col-sm-2" name="expiry-month" id="expiry-month">
               <option value="01">Jan (01)</option>
               <option value="02">Feb (02)</option>
             </select>
           </div>
           <div class="col-xs-3">
             <select class="form-control" name="expiry-year">
               <option value="22">2022</option>
               <option value="23">2023</option>
             </select>
           </div>
         </div>
       </div>
     </div>

     <div class="form-group">
       <label class="col-sm-3 control-label" for="cvv">Card CVV</label>
       <div class="col-sm-3">
         <input type="text" class="form-control" name="cvv" id="cvv" placeholder="Security Code"/>
       </div>
     </div>

     <div class="form-group">
       <div class="col-sm-offset-3 col-sm-9">
         <button type="button" class="btn btn-success" onClick = {this.props.triggerAddMoney}>Pay Now</button>
       </div>
     </div>
   </div>
    );
  }

}
export default AddMoneyComponent;
