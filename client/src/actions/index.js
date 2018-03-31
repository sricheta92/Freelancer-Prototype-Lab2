import * as actionType from './ActionType';
import fileDownload from 'react-file-download';
import axios from 'axios';

export function checkEmail(state) {

  return function (dispatch) {
		let temp = {
			"email": state.email
		};
		return axios.post("http://localhost:5000/signup/checkEmail", temp).
    then((response) => {
			if( response.data){
				dispatch({type:actionType.EMAIL_VALID, payload: response.data})
			}
		}).catch((err) => {
			 dispatch({type:actionType.EMAIL_INVALID, payload: err.response.data})
		})
	}

};

export function signup(state) {

  return function (dispatch) {
    let temp = {
      "username": state.username,
      "email" :state.email,
      "password" :state.password,
      "role" :state.role

    };
    return axios.post("http://localhost:5000/signup", temp).then((response) => {
      if( response.data){
        dispatch({type:actionType.SIGNUP_SUCCESS, payload: response.data})
      }
    }).catch((err) => {
       dispatch({type:actionType.SIGNUP_FAIL, payload: err.response.data})
    })
  }

}


export function checkUser(state) {

  return function (dispatch) {
    let temp = {
      "username": state.username
    };
    return axios.post("http://localhost:5000/signup/checkUser", temp).then((response) => {
      if( response.data){
        dispatch({type:actionType.USERNAME_VALID, payload: response.data})
      }
    }).catch((err) => {
       dispatch({type:actionType.USERNAME_INVALID, payload: err.response.data})
    })
  }


}

export function login(state){
    return function (dispatch) {
      let temp = {
        "username" : state.useroremail,
        "password": state.password
      }

      return axios.post("http://localhost:5000/login", temp).then((response) => {
        if( response.data.token){
          localStorage.setItem('jwtToken', response.data.token);
  				localStorage.setItem('userid', response.data.userid);
          localStorage.setItem('username', response.data.username);
          localStorage.setItem('role', response.data.primary_role);
  			  dispatch({type:actionType.LOGIN_SUCCESS, payload: response.data})
			  }
      }).catch((err) => {
         dispatch({type:actionType.LOGIN_FAIL, payload: err.response.data})
      })
    }
}

export function getAllSkills(state){
  return function(dispatch){
   return axios.get("http://localhost:5000/skill/allSkills").then((response) => {
      if( response.data){
        dispatch({type:actionType.GET_SKILLS_SUCCESS, payload: response.data})
      }
    }).catch((err) => {
       dispatch({type:actionType.GET_SKILLS_FAILURE, payload: err.response.data})
    })
  /*  dispatch({
      type : actionType.GET_SKILLS_SUCCESS,
      payload : ['Java', 'PHP', 'XML', 'reactjs','Spring','Excel','Word','DB2','HTML5','CSS','Management']
    }) */

  }
}

export function getAllCategories(state){
    return function(dispatch){
      return axios.get("http://localhost:5000/skill/allCategories").then((response) => {
          if( response.data){
            dispatch({type:actionType.GET_CATEGORY_SUCCESS, payload: response.data})
          }
        }).catch((err) => {
           dispatch({type:actionType.GET_CATEGORY_FAILURE, payload: err.response.data})
        })

    }
}

export function getAllSkillsByCategory(state){
  return function(dispatch){

    return axios.get("http://localhost:5000/skill/skillsByCategory" ).then((response) => {
      if( response.data){
        dispatch({type:actionType.GET_SKILLS_BY_CATEGORY_SUCCESS, payload: response.data})
      }
    }).catch((err) => {
       dispatch({type:actionType.GET_SKILLS_BY_CATEGORY_FAILURE, payload: err.response.data})
    })
  }

}

export function completeProfile(state){

  return function (dispatch){

      let temp = {
        "fname": state.fname,
        "lname" :state.lname,
        "city" :state.city,
        "phone" :state.phone,
        "userID" :state.userID,
        "profilePic" : state.profilePic,
        "bio" :state.bio,
        "headline" :state.headline
      };

    return axios.post("http://localhost:5000/signup/withDetails",temp).then((response) => {
       if( response.data){
         dispatch({type:actionType.COMPLETE_PROFILE_SUCCESS, payload: response.data})
       }
     }).catch((err) => {
        dispatch({type:actionType.COMPLETE_PROFILE_FAILURE, payload: err.response.data})
     })

  }
}

export function mapSkillToUser(state){

  return function(dispatch) {
    let temp ={
        "userID" :state.userID,
        "skills" : state.skills
    };
    return axios.post("http://localhost:5000/skill/withDetails",temp).then((response) => {
       if( response.data){
         dispatch({type:actionType.COMPLETE_PROFILE_SKILL_SUCCESS, payload: response.data})
       }
     }).catch((err) => {
        dispatch({type:actionType.COMPLETE_PROFILE_SKILL_FAILURE, payload: err.response.data})
     })
  }
}

export function skillRemoved(state){
  return function(dispatch){  dispatch({
      type:actionType.SKILL_REMOVED,
      payload : state.skills
    });
  }
}

export function skillAdded(state){
  return function(dispatch){  dispatch({
      type:actionType.SKILL_ADDED,
      payload : state.skills
    });
  }
}

export function handleFileUpload(state,file){
  return function(dispatch){

    var data = new FormData();
  	data.append("file", file);
    return axios.post("http://localhost:5000/project/uploadFiles", data).then((response) => {
       if( response.data){
         dispatch({type:actionType.FILE_UPLOAD_SUCCESS, payload: response.data})
       }
     }).catch((err) => {
        dispatch({type:actionType.FILE_UPLOAD_FAILURE, payload: err.response.data})
     })

  }
}

export function postProject(state){
  return function(dispatch){

    let data = {
      project_name : state.projectname,
      description : state.projectdesc,
      budget_range :state.budget,
      project_pay_type :state.selectedOption
    }

    return axios.post("http://localhost:5000/project/postprojects", data).then((response) => {
       if( response.data){
         dispatch({type:actionType.POST_PROJECT_SUCCESS, payload: response.data})
       }
     }).catch((err) => {
        dispatch({type:actionType.POST_PROJECT_FAILURE, payload: err.response.data})
     })

  }
}

export function mapfilesToProject(props){
  return function(dispatch){
    let data = {
      projectid : props.projectid,
      filepath :props.uploadname
    }
    return axios.post("http://localhost:5000/project/mapFilesToProject", data).then((response) => {
       if( response.data){
         dispatch({type:actionType.MAP_FILES_TO_PROJECT_SUCCESS, payload: response.data})
       }
     }).catch((err) => {
        dispatch({type:actionType.MAP_FILES_TO_PROJECT_FAILURE, payload: err.response.data})
     })
 }
}

export function mapSkillToProject(props,state){
  return function(dispatch){
    let data = {
      projectid : props.projectid,
      skills : state.selectedSkills
    }
    return axios.post("http://localhost:5000/project/mapSkillToProject", data).then((response) => {
       if( response.data){
         dispatch({type:actionType.MAP_SKILLS_TO_PROJECT_SUCCESS, payload: response.data})
       }
     }).catch((err) => {
        dispatch({type:actionType.MAP_SKILLS_TO_PROJECT_FAILURE, payload: err.response.data})
     })
 }
}

export function mapProjectToUser(state,props){
    return function(dispatch){
      let data = {
        projectid : props.projectid,
        userid :props.userID,
        role : state.role
      }
      return axios.post("http://localhost:5000/project/mapProjectToUser", data).then((response) => {
         if( response.data){
           dispatch({type:actionType.MAP_PROJECT_TO_USER_SUCCESS, payload: response.data})
         }
       }).catch((err) => {
          dispatch({type:actionType.MAP_PROJECT_TO_USER_FAILURE, payload: err.response.data})
       })
    }
}

export function getRecommendedProjects(props){
  return function(dispatch){
    return axios.get("http://localhost:5000/project/mapRecommendedProjects/"+ props.userID ).then((response) => {
       if( response.data){


         response.data.projectsWithSkills.map(project  =>{
           if(project!= undefined){
              if( project.usersBidded!= undefined){
                    project.usersBidded.map(user =>{

                        var arrayBufferView = new Uint8Array(user.encodeImage.data );
                        var blob = new Blob( [ arrayBufferView ], { type: "image/jpg" } );
                        var urlCreator = window.URL || window.webkitURL;
                        var imageUrl = urlCreator.createObjectURL( blob );
                        user.bloburl = imageUrl;

                 });
              }
         }

         });

          dispatch({type:actionType.GET_RECOMMENDED_PROJECTS_SUCCESS, payload: response.data})
       }


     }).catch((err) => {
       throw err;
        dispatch({type:actionType.GET_RECOMMENDED_PROJECTS_FAILURE, payload: err.response.data})
     })
  }
}

export function getProjectDetails(data) {
    return {
      type: actionType.GET_PROJECT_DETAILS_SUCCESS,
      data
    }
  }

export function saveBidOfUser(state){
  return function(dispatch){
    let temp = {
			"user_id": state.user_id,
      "project_id" :state.project_id,
      "bid_days" :state.bid_days,
      "bid_price" :state.bid_price
		};
    return axios.post("http://localhost:5000/project/bidproject",temp).then((response) => {
       if( response.data){
         dispatch({type:actionType.PROJECT_BID_SUCCESS, payload: response.data})
       }
     }).catch((err) => {
        dispatch({type:actionType.PROJECT_BID_FAILURE, payload: err.response.data})
     })
  }
}

export function showDashboard(data){
  return {
    type: actionType.SHOW_DASHBOARD,
    data
  }
}


export function hideDashboard(data){
  return {
    type: actionType.HIDE_DASHBOARD,
    data
  }
}

export function getAllBiddedProject(data){
  return function(dispatch){
    return axios.get("http://localhost:5000/user/biddedprojects/"+data).then((response) => {
       if( response.data){
         dispatch({type:actionType.GET_BIDDED_PROJECTS_SUCCESS, payload: response.data})
       }
     }).catch((err) => {
        dispatch({type:actionType.GET_BIDDED_PROJECTS_FAILURE, payload: err.response.data})
     })
  }
}

export function getDashboardSwitchStatus(data){
  return {
    type: actionType.DASHBOARD_VIEW_TYPE,
    data
  }
}

export function getAllPostedProjectsbyMe(data){
  return function(dispatch){
    return axios.get("http://localhost:5000/user/postedprojects/"+data).then((response) => {
       if( response.data){
         dispatch({type:actionType.GET_POSTED_PROJECTS_SUCCESS, payload: response.data})
       }
     }).catch((err) => {
        dispatch({type:actionType.GET_POSTED_PROJECTS_FAILURE, payload: err.response})
     })
  }
}

export function getUserDetails(data){
  return function(dispatch){
    return axios.get("http://localhost:5000/user/detail/"+data).then((response) => {
       if( response.data){
         dispatch({type:actionType.GET_USER_DETAIL_SUCCESS, payload: response.data})
       }
     }).catch((err) => {
        dispatch({type:actionType.GET_USER_DETAIL_FAILURE, payload: err.response})
     })
  }
}

export function downloadFile(fileName){
	return function(dispatch){
		return axios.get("http://localhost:5000/user/downloadFile?profilePicPath="+fileName, { responseType: 'arraybuffer' }).then((response) => {
			// fileDownload(response.data, "profilepic.jpg");

       var arrayBufferView = new Uint8Array( response.data );
       var blob = new Blob( [ arrayBufferView ], { type: "image/jpg" } );
       var urlCreator = window.URL || window.webkitURL;
       var imageUrl = urlCreator.createObjectURL( blob );

			 dispatch({type:actionType.FILE_DOWNLAOD_SUCCESS, payload: imageUrl})
		}).catch((err) => {
			 dispatch({type:actionType.FILE_DOWNLAOD_FAIL, payload: err.response})
		})
	}
}
