import React,{Component} from 'react';
import StepZilla from 'react-stepzilla';
import ProfileStep1 from './ProfileStep1';
import ProfileStep2 from './ProfileStep2';
import { connect } from 'react-redux';
import Step2 from './Step2';

const mapStateToProps = (state) => {
  return{
    username :state.signupReducer.username
  }
}


const steps =
    [
      {name: 'Step 1', component: <ProfileStep1 />},
      {name: 'Step 2', component: <ProfileStep2 />}

    ]

class CompleteProfile extends Component{
  render(){
    return(
      <div class ="container-fluid justify-content-CompleteProfile ">
        <div class = "row gap wizard ">
          <a className="navbar-brand a-logo" href="#"><img className = "logo" src = "./images/icon.PNG"></img></a>
        </div>
        Welcome {this.props.username}
        <div className='step-progress'>
        <StepZilla steps={steps}
          prevBtnOnLastStep={true}
          showSteps={true}
          stepsNavigation={true}
          dontValidate={false}
          hocValidationAppliedTo={[0]}
          backButtonCls ={ "btn btn-prev btn-primary btn-lg pull-left btn-back"}
          nextButtonCls={ "btn btn-prev btn-primary btn-lg pull-right btn-next"}
          backButtonText={"Add More Skills"}/>
        </div>
      </div>

    )
  }

}

export default connect(mapStateToProps)(CompleteProfile);
