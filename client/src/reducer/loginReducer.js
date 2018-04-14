import * as actionType from '../actions/ActionType';

const defaultState = {
  loginStatus :false,
  loginMsg :""

}

export function loginReducer(state = defaultState, action){

  const newState = {...state};
  switch(action.type){

    case actionType.LOGIN_SUCCESS : newState.loginStatus = action.payload.success;
                                    newState.loginMsg = "";
                                    newState.username=action.payload.username;
                                    newState.userID = action.payload.userid;
                                    newState.bloburl = action.payload.bloburl;
                                    newState.user = action.payload.user;
                                    return newState;
    case "profileupdateeverywhere" :   newState.user = action.data; return newState;
   case "updateblob" : newState.bloburl = action.payload.user.bloburl; return newState;
    case actionType.LOGIN_FAIL : newState.loginStatus = action.payload.success;
                                 newState.loginMsg = action.payload.message;
                                 return newState;

    default :  return newState;


  }

}
