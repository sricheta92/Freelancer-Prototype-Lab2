import * as actionType from '../actions/ActionType';


export function userReducer(state, action){

  const newState = {...state};
  switch(action.type){

      case actionType.GET_BIDDED_PROJECTS_SUCCESS : newState.projectsBiddedByMe = action.payload.projectsBiddedByMe;
                                                   return newState;

      case actionType.GET_BIDDED_PROJECTS_FAILURE : newState.projectsBiddedByMe = undefined;
                                                    return newState;

      case actionType.DASHBOARD_VIEW_TYPE : newState.dashboardViewisWorker = action.data;
                                            return newState;

      case actionType.GET_POSTED_PROJECTS_SUCCESS : newState.projectsPostedByMe = action.payload.projectsPostedByMe;
                                                    return newState;

      case actionType.GET_POSTED_PROJECTS_FAILURE : newState.projectsPostedByMe = undefined;
                                                    return newState;

      case actionType.GET_USER_DETAIL_SUCCESS : newState.user = action.payload.user;
                                                newState.skill = action.payload.skill;
                                                newState.profile = action.payload.user;
                                                return newState;

      case actionType.GET_USER_DETAIL_FAILURE : newState.user = undefined;
                                                newState.skill = action.payload.skill;
                                                return newState;
      case actionType.FILE_DOWNLAOD_SUCCESS : newState.profilePic = action.payload;
                                                return newState;
      case actionType.GET_USER_SUCCESS : newState.profile = action.data;
                                         return newState;
      case actionType.GET_USER_SKILL_SUCCESS : newState.userSkill =  action.payload.userSkill;
                                               return newState;
      case actionType.GET_USER_SKILL_FAILURE : newState.userSkill = action.payload.userSkill;
                                               return newState;

      case actionType.PROFILE_UPDATE_SUCCESS : newState.profile = action.payload.user
                                              return newState;

      case actionType.PROFILE_UPDATE_FAILURE  : newState.profile = {}
                                                return newState;

      case actionType.HIRE_USER_SUCCESS :  newState.hireStatus = action.payload.success;
                                           return newState;
      case actionType.HIRE_USER_FAILURE : newState.hireStatus = action.payload.success;
                                          return newState;
      case actionType.SUBMIT_PROJECT_SOLUTION_SUCCESS : newState.solutionSubmitStatus = action.payload.success;
                                                        newState.solutionSubmitMessage = action.payload.message;
                                                        return newState;
      case actionType.SUBMIT_PROJECT_SOLUTION_FAILURE : newState.solutionSubmitStatus = action.payload.success;
                                                        newState.solutionSubmitMessage = action.payload.message;
                                                        return newState;
     case actionType.TRANSACTION_SUCCESSFUL : newState.transactionuser = action.payload.user
                                              return newState;
     case actionType.TRANSACTION_FAILURE : newState.transactionuser = undefined;
                                              return newState;
    case  actionType.GET_TRANSACTION_USER_SUCCESS : newState.transactionuser = action.data
                                             return newState;

    case 'authSuccess':	newState.isAuthentic= true;return newState;
    case 'authFailed':newState.isAuthentic= false;return newState;
    case 'logoutSuccess':newState.isAuthentic= false;return newState;
    case 'logoutFailed':newState.isAuthentic= true;return newState;
      default : return newState;


  }
}
