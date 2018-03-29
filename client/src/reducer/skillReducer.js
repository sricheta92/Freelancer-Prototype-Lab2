import * as actionType from '../actions/ActionType';

export function skillReducer(state, action){
  const newState = {...state}
  switch(action.type){

    case actionType.GET_CATEGORY_SUCCESS : newState.categories = action.payload.allCategories;
                                         return newState;
    case actionType.GET_CATEGORY_FAILURE :  newState.categories = [];
                                        return newState;
    case actionType.GET_SKILLS_BY_CATEGORY_SUCCESS : newState.skillsByCategory = action.payload.skillbyCategory;
                                                     return newState;
   case actionType.GET_SKILLS_BY_CATEGORY_FAILURE : newState.skillsByCategory = action.payload.skillbyCategory;
                                                  return newState;
    case actionType.SKILL_ADDED : newState.skills = action.payload; return newState;
    case actionType.SKILL_REMOVED : newState.skills = action.payload; return newState;

     default : return newState;

  }

}
