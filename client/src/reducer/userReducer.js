import * as actionType from '../actions/ActionType';

export function userReducer(state={}, action){

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
                                                return newState;

      case actionType.GET_USER_DETAIL_FAILURE : newState.user = undefined;
                                                newState.skill = action.payload.skill;
                                                return newState;
      case actionType.FILE_DOWNLAOD_SUCCESS : newState.profilePic = action.payload;
                                                return newState;
      default : return newState;
  }
}
