import { combineReducers } from "redux"
import {signupReducer}  from "./signupReducer"
import {loginReducer}  from "./loginReducer"
import {postProjectReducer} from "./postProjectReducer"
import {skillReducer} from "./skillReducer"
import {userReducer} from "./userReducer"

export default combineReducers({
	signupReducer, loginReducer, postProjectReducer,skillReducer,userReducer
});
