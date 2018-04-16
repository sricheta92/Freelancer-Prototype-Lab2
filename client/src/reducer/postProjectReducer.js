import * as actionType from '../actions/ActionType';

const defaultState={
  projectBidStatus : false
}
export function postProjectReducer(state = defaultState, action){
  const newState = {...state}
  switch(action.type){

    case actionType.GET_SKILLS_SUCCESS : newState.allSkills = action.payload.skills;
                                         return newState;
    case actionType.GET_SKILLS_FAILURE :  newState.skills = [];
                                        return newState;

    case actionType.FILE_UPLOAD_SUCCESS : newState.uploadname = action.payload.uploadname;
                                          newState.originalname = action.payload.originalname;
                                          return newState;

    case actionType.FILE_UPLOAD_FAILURE :newState.uploadname= undefined;
                                        newState.originalname = undefined;
                                          return newState;

    case actionType.POST_PROJECT_SUCCESS :newState.projectid = action.payload.projectid;
                                          return newState;

    case actionType.POST_PROJECT_FAILURE :newState.projectid = undefined;
                                          newState.projectfailMsg = action.payload.message;
                                            return newState;

    case actionType.MAP_FILES_TO_PROJECT_SUCCESS :newState.mappedfilesToProjectFlag = action.payload.success;
                                                  return newState;

    case actionType.MAP_FILES_TO_PROJECT_FAILURE :newState.mappedfilesToProjectFlag = action.payload.success;
                                                  return newState;

    case actionType.MAP_SKILLS_TO_PROJECT_SUCCESS : newState.mappedSkillsToProjectFlag = action.payload.success;
                                                  return newState;

    case actionType.MAP_SKILLS_TO_PROJECT_FAILURE :  newState.mappedSkillsToProjectFlag = action.payload.success;
                                                  return newState;

    case actionType.MAP_PROJECT_TO_USER_SUCCESS : newState.mappedUserToProjectFlag = action.payload.success;
                                                  return newState;

    case actionType.MAP_PROJECT_TO_USER_FAILURE :  newState.mappedUserToProjectFlag = action.payload.success;
                                                  return newState;

    case actionType.GET_RECOMMENDED_PROJECTS_SUCCESS : newState.projectsWithSkills = action.payload.projectsWithSkills;
                                                      return newState;
    case actionType.GET_ALL_PROJECTS_SUCCESS : newState.allprojects = action.payload.allProjects;
                                               return newState;
    case actionType.GET_ALL_PROJECTS_FAILURE : newState.allprojects = undefined;
                                                  return newState;

    case actionType.GET_RECOMMENDED_PROJECTS_FAILURE : newState.projectsWithSkills = undefined;
                                                      return newState;

    case actionType.GET_PROJECT_POSTEDBY_ID_SUCCESS : newState.postedBy = action.payload.postedBy;
                                                      return newState;

  case actionType.GET_PROJECT_POSTEDBY_ID_FAILURE : newState.postedBy = undefined;
                                                    return newState;

  case actionType.GET_SKILLS_OF_PROJECT_SUCCESS : newState.skillsRequiredByProject = action.payload.skillsRequiredByProject;
                                                  return newState;

  case actionType.GET_SKILLS_OF_PROJECT_FAILURE : newState.skillsRequiredByProject = [];
                                                    return newState;

  case actionType.GET_PROJECT_DETAILS_SUCCESS : newState.project = action.data;
                                                return newState;

  case actionType.PROJECT_BID_SUCCESS : newState.projectBidStatus = action.payload.success;
                                        return newState;

  case actionType.PROJECT_BID_FAILURE : newState.projectBidStatus = action.payload.success;
                                        return newState;

     default : return newState;

  }

}
