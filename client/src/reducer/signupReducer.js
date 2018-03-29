import * as actionType from '../actions/ActionType';

const defaultState = {
	  uesrname:"",
    email: "",
    userId: 0,
    emailError : "",
    usernameError: "",
signupStatus :false

  }

export function signupReducer(state  =defaultState, action){
  const newState = {...state};
    switch(action.type){
      case actionType.EMAIL_VALID:  newState.emailErrorMsg = "";
                                    newState.emailValid= action.payload.success;
                                    return newState;

      case actionType.EMAIL_INVALID:  newState.emailErrorMsg = action.payload.message;
                                      newState.emailValid= action.payload.success;
                                      return newState;

      case actionType.USERNAME_VALID : newState.usernameErrorMsg = "";
                                       newState.usernameValid= action.payload.success;
                                       return newState;

      case actionType.USERNAME_INVALID : newState.usernameErrorMsg = action.payload.message;
                                         newState.usernameValid= action.payload.success;
                                         return newState;
      case actionType.SIGNUP_FAIL : newState.signupStatus = action.payload.success;
                                    newState.signupMessage = action.payload.message;
																		newState.userID= undefined;
                                    return newState;
      case actionType.SIGNUP_SUCCESS : newState.signupStatus = action.payload.success;
                                    newState.signupMessage = action.payload.message;
																		newState.userID= action.payload.id;
																		newState.username=action.payload.username;
                                    return newState;
			case actionType.COMPLETE_PROFILE_SUCCESS :newState.userID = action.payload.id
																								return newState;
			case actionType.COMPLETE_PROFILE_FAILURE :newState.userID = undefined;
																								return newState;

			case actionType.HIDE_DASHBOARD : newState.showDashboard = action.data;return newState;
			case actionType.SHOW_DASHBOARD : newState.showDashboard = action.data;return newState;
       default: return newState;
    }


}
