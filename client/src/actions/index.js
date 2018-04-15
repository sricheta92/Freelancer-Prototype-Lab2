import * as actionType from './ActionType';
import fileDownload from 'react-file-download';
import axios from 'axios';
axios.defaults.withCredentials = true;
//var serverURL = "http://ec2-13-57-249-255.us-west-1.compute.amazonaws.com:5000"
var serverURL = "http://localhost:5000";

export function checkEmail(state) {

  return function (dispatch) {
		let temp = {
			"email": state.email
		};
		return axios.post(serverURL+"/signup/checkEmail", temp).
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
    return axios.post(serverURL+"/signup", temp).then((response) => {
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
    return axios.post(serverURL+"/signup/checkUser", temp).then((response) => {
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

      return axios.post(serverURL+"/login", temp).then((response) => {
        if( response.data.token){
          localStorage.setItem('jwtToken', response.data.token);
  				localStorage.setItem('userid', response.data.userid);
          localStorage.setItem('username', response.data.username);
          localStorage.setItem('role', response.data.primary_role);

          var arrayBufferView = new Uint8Array(response.data.encodeImage.data );
          var blob = new Blob( [ arrayBufferView ], { type: "image/jpg" } );
          var urlCreator = window.URL || window.webkitURL;
          var imageUrl = urlCreator.createObjectURL( blob );
          response.data.bloburl = imageUrl;
          response.data.user.bloburl= imageUrl;
          localStorage.setItem('bloburl',  response.data.bloburl);
          console.log("URL "+   response.data.bloburl);
  			  dispatch({type:actionType.LOGIN_SUCCESS, payload: response.data})
			  }
      }).catch((err) => {
         dispatch({type:actionType.LOGIN_FAIL, payload: err.response.data})
      })
    }
}

export function getAllSkills(state){
  return function(dispatch){
   return axios.get(serverURL+"/skill/allSkills").then((response) => {
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
      return axios.get(serverURL+"/skill/allCategories").then((response) => {
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

    return axios.get(serverURL+"/skill/skillsByCategory" ).then((response) => {
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

    return axios.post(serverURL+"/signup/withDetails",temp).then((response) => {
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
    return axios.post(serverURL+"/skill/withDetails",temp).then((response) => {
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
    return axios.post(serverURL+"/project/uploadFiles", data).then((response) => {
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

    return axios.post(serverURL+"/project/postprojects", data).then((response) => {
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
    return axios.post(serverURL+"/project/mapFilesToProject", data).then((response) => {
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
    return axios.post(serverURL+"/project/mapSkillToProject", data).then((response) => {
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
      return axios.post(serverURL+"/project/mapProjectToUser", data).then((response) => {
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
    return axios.get(serverURL+"/project/mapRecommendedProjects/"+ props.userID,{withCredentials: true} ).then((response) => {
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
              if( project.postedBy!= undefined)
                {
                    var arrayBufferView = new Uint8Array( project.postedBy.encodeImage.data );
                    var blob = new Blob( [ arrayBufferView ], { type: "image/jpg" } );
                    var urlCreator = window.URL || window.webkitURL;
                    var imageUrl = urlCreator.createObjectURL( blob );
                    project.postedBy.bloburl = imageUrl;
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
    return axios.post(serverURL+"/project/bidproject",temp).then((response) => {
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
    return axios.get(serverURL+"/user/biddedprojects/"+data).then((response) => {
       if( response.data){


                           response.data.projectsBiddedByMe.map(project  =>{
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
    return axios.get(serverURL+"/user/postedprojects/"+data).then((response) => {
       if( response.data){


                  response.data.projectsPostedByMe.map(project  =>{
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

              //     dispatch({type:actionType.GET_RECOMMENDED_PROJECTS_SUCCESS, payload: response.data})


         dispatch({type:actionType.GET_POSTED_PROJECTS_SUCCESS, payload: response.data})
       }
     }).catch((err) => {
        dispatch({type:actionType.GET_POSTED_PROJECTS_FAILURE, payload: err.response})
     })
  }
}

export function getUserDetails(data){
  return function(dispatch){
    return axios.get(serverURL+"/user/detail/"+data).then((response) => {
       if( response.data){
         var arrayBufferView = new Uint8Array(response.data.user.encodeImage.data );
         var blob = new Blob( [ arrayBufferView ], { type: "image/jpg" } );
         var urlCreator = window.URL || window.webkitURL;
         var imageUrl = urlCreator.createObjectURL( blob );
         response.data.user.bloburl = imageUrl;
         localStorage.setItem("bloburl", response.data.user.bloburl);
         dispatch({type:actionType.GET_USER_DETAIL_SUCCESS, payload: response.data})
       }
     }).catch((err) => {
        dispatch({type:actionType.GET_USER_DETAIL_FAILURE, payload: err.response})
     })
  }
}
export function handleDownload(original,file){
  return function(dispatch){
		return axios.get(serverURL+"/user/downloadFile?filepath="+file).then((response) => {
    //  response = response.text();
			 fileDownload(response.data, original);

  const file = new File([response.blob], original);
			 dispatch({type:actionType.FILE_DOWNLAOD_SUCCESS, payload: file})
		}).catch((err) => {
			 dispatch({type:actionType.FILE_DOWNLAOD_FAIL, payload: err.response})
		})
	}
}
export function downloadFile(fileName){
	return function(dispatch){
		return axios.get(serverURL+"/user/downloadFile?profilePicPath="+fileName, { responseType: 'arraybuffer' }).then((response) => {
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

export function getProfileDetails(data){
  return {
    type: actionType.GET_USER_SUCCESS,
    data
  }
}

export function getProfileDetailsonLogin(data){
  return {
    type: "profileupdateeverywhere",
    data
  }
}

export function getUserSkills(data){

  return function(dispatch){
    let temp = data;
    return axios.get(serverURL+"/user/skills/"+temp).then((response) => {
       if( response.data){
         dispatch({type:actionType.GET_USER_SKILL_SUCCESS, payload: response.data})
       }
     }).catch((err) => {
        dispatch({type:actionType.GET_USER_SKILL_FAILURE, payload: err.response.data})
     })
  }
}

export function updateProfile(state, id){
  return function(dispatch){
    let data = {
			"id": id,
      "bio" :state.userdetails.bio,
      "phone" :state.userdetails.phone,
      "headline" :state.userdetails.prof_headline,
      "profilePic" : state.userdetails.profilePic
		};
    return axios.post(serverURL+"/user/update",data).then((response) => {
       if( response.data){
         var arrayBufferView = new Uint8Array(response.data.user.encodeImage.data );
         var blob = new Blob( [ arrayBufferView ], { type: "image/jpg" } );
         var urlCreator = window.URL || window.webkitURL;
         var imageUrl = urlCreator.createObjectURL( blob );
         response.data.user.bloburl = imageUrl;
         response.data.user.bloburl= imageUrl;
         localStorage.setItem('bloburl',  response.data.user.bloburl);
         console.log("URL "+   response.data.user.bloburl);
         dispatch({type:actionType.PROFILE_UPDATE_SUCCESS, payload: response.data})
       }
     }).catch((err) => {
        dispatch({type:actionType.PROFILE_UPDATE_FAILURE, payload: err.response.data})
     })
  }
}

export function hireUser(user){
  return function(dispatch){
    let data = {
			"hiredFreelancer": user,
      "status" : "HIRING",
      "submission" :{
        comment : "",
        file : ""
      }
		};
    return axios.post(serverURL+"/user/hire",data).then((response) => {
       if( response.data){
         dispatch({type:actionType.HIRE_USER_SUCCESS, payload: response.data})
       }
     }).catch((err) => {
        dispatch({type:actionType.HIRE_USER_FAILURE, payload: err.response.data})
     })
  }
}

export function submitProjectSolution(data){
  return function(dispatch){
    return axios.post(serverURL+"/project/submitsolution",data).then((response) => {
       if( response.data){
         dispatch({type:actionType.SUBMIT_PROJECT_SOLUTION_SUCCESS, payload: response.data})
       }
     }).catch((err) => {
        dispatch({type:actionType.SUBMIT_PROJECT_SOLUTION_FAILURE, payload: err.response.data})
     })
  }
}

export function manageTransaction(data){
  return function(dispatch){
    return axios.post(serverURL+"/user/manageTransaction",data).then((response) => {
       if( response.data){
         dispatch({type:actionType.TRANSACTION_SUCCESSFUL, payload: response.data})
       }
     }).catch((err) => {
        dispatch({type:actionType.TRANSACTION_FAILURE, payload: err.response.data})
     })
  }
}

export function getTransactionUserDetails(data){
  return {
    type: actionType.GET_TRANSACTION_USER_SUCCESS,
    data
  }
}

export function requestAuth(state){
	return function (dispatch) {
		let temp = {
		};
		return axios.post(serverURL+"/user/auth", temp).then((response) => {
			dispatch({type:"authSuccess", payload: response.data})
		}).catch((err) => {
			 dispatch({type:"authFailed", payload: err.response.data})
		})
	}
}


export function requestLogout(state){
	return function (dispatch) {
		return axios.get(serverURL+"/user/logout").then((response) => {
			dispatch({type:"logoutSuccess", payload: response.data})
		}).catch((err) => {
			 dispatch({type:"logoutFailed", payload: err.response.data})
		})
	}
}


export function getAllProjects(props){
  return function(dispatch){
    return axios.get(serverURL+"/project/getAllprojects/"+ props.userID,{withCredentials: true} ).then((response) => {
       if( response.data){


         response.data.allProjects.map(project  =>{
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
              if( project.postedBy!= undefined)
                {
                    var arrayBufferView = new Uint8Array( project.postedBy.encodeImage.data );
                    var blob = new Blob( [ arrayBufferView ], { type: "image/jpg" } );
                    var urlCreator = window.URL || window.webkitURL;
                    var imageUrl = urlCreator.createObjectURL( blob );
                    project.postedBy.bloburl = imageUrl;
                }
         }

         });

          dispatch({type:actionType.GET_ALL_PROJECTS_SUCCESS, payload: response.data})
       }


     }).catch((err) => {
       throw err;
        dispatch({type:actionType.GET_ALL_PROJECTS_FAILURE, payload: err.response.data})
     })
  }
}
