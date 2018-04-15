import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from "react-router-dom";
import FixedNav from './FixedNav';
import {Typeahead} from 'react-bootstrap-typeahead';
import DashboardDecider from './DashboardDecider';
import { getAllSkills ,downloadFile,handleFileUpload,updateProfile,getProfileDetails,getProfileDetailsonLogin,getUserDetails} from '../actions';


const mapDispatchToProps = (dispatch)=>{
    let actions = {getAllSkills,downloadFile,handleFileUpload,updateProfile,getProfileDetails,getProfileDetailsonLogin,getUserDetails};
    return { ...actions, dispatch };
}

const mapStateToProps = (state) => {


    return {
        user : state.userReducer.profile,
        showDashboard : state.signupReducer.showDashboard,
        userSkill : state.userReducer.userSkill,
        profilePic : state.userReducer.profilePic,
        allSkills :  state.postProjectReducer.allSkills,
        uploadname :state.postProjectReducer.uploadname,
        originalname :state.postProjectReducer.originalname
    }
}


class UserProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
          message : '',
          file : '',
          imagePreviewUrl : '',
            disabletags: {
              disableTags :true,
              updatebutton : false
            },
           selectedSkills :[],
           userdetails: {
                _id :  this.props.user._id,
                bio: this.props.user.bio,
                phone:  this.props.user.phone,
                prof_headline : this.props.user.prof_headline,
                bloburl : this.props.user.bloburl,
                username : this.props.user.username,
                city : this.props.user.city,
                profilePic : this.props.user.profilePicPath

            },

        };

        this.handleOptionSelected = this.handleOptionSelected.bind(this);
        this.handleEditProfile = this.handleEditProfile.bind(this);
        this.updateuserProfile = this.updateuserProfile.bind(this);
        this.handleFile = this.handleFile.bind(this);

    };

    static defaultProps ={
      user : {},
      userSkill :[

      ],
      showDashboard: false,
      allSkills: [],
      profilePic :''
    }

    handleFile(e){
      e.preventDefault();
      let reader = new FileReader();
      let file = e.target.files[0];

      reader.onloadend = () => {
        this.setState({
          file: file,
          imagePreviewUrl: reader.result
        });
      }

      reader.readAsDataURL(file)
      this.props.dispatch(this.props.handleFileUpload(this.props, e.target.files[0]))
    }


    handleOptionSelected(option){
      this.setState({selectedSkills : option});
      console.log(option);
    }

    handleEditProfile(){
      this.setState({
          disabletags: {
              disableTags : false,
              updatebutton: true
          }
      });
    }


    updateuserProfile(option){
      // this.setState({
      //   userdetails: {
      //       ...this.state.userdetails//,
      //     profilePic: this.props.uploadname
      //   }
      // },function(){
          this.props.dispatch(this.props.updateProfile(this.state, this.props.user._id))
          .then(()=> {
            this.setState({
                userdetails: {
                    ...this.state.userdetails,
                    bloburl: this.props.user.bloburl
                }
            });
          });
          this.setState({
              message : "Updated successfully",
              disabletags: {
                  disableTags : true,
                  updatebutton: false
              }
          });
         this.props.dispatch(this.props.getProfileDetails(this.state.userdetails));
         this.props.dispatch(this.props.getProfileDetailsonLogin(this.state.userdetails));
        this.props.dispatch(this.props.getUserDetails(localStorage.getItem("userid")));
      // });
    }

    componentWillReceiveProps(nextProps){

        if(this.props.user !== nextProps.user){
          this.setState({
            userdetails : nextProps.user
          })
        }

        if(this.props.user.profilePicPath !== nextProps.uploadname){
            this.setState({
                userdetails: {
                    ...this.state.userdetails,
                    profilePic: nextProps.uploadname
                }
            });
        }

        if(this.props.user.bloburl !== nextProps.user.bloburl){
          this.setState({
              userdetails: {
                  ...this.state.userdetails,
                  bloburl: nextProps.user.bloburl
              }
          });
        }

    }

    componentWillMount(){
      console.log("componentWillMount");
      if(localStorage.getItem("userid") === this.props.user._id  || localStorage.getItem("userid") === this.props.user.userid){
      this.props.dispatch(this.props.getUserDetails(localStorage.getItem("userid")));
    }

    }

    render() {
      let {imagePreviewUrl} = this.state;
      let $imagePreview = null;
      if (imagePreviewUrl) {
        $imagePreview = imagePreviewUrl;
      } else {
        $imagePreview = null;
      }
        return (
            <div>
              <FixedNav />
              {this.props.showDashboard ? <DashboardDecider role={localStorage.getItem("role")} /> :
              <div>
              {this.state.message !== '' ? <div id="proposal-panel" class="center-block"><div class="alert alert-success alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">×</a><strong>{this.state.message}</strong></div></div> : null}
              {localStorage.getItem("userid") === this.props.user._id  || localStorage.getItem("userid") === this.props.user.userid ?
                <a onClick = {this.handleEditProfile} className="btn btn-primary a-btn-slide-text">
                      <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
                      <span><strong>Edit</strong></span>
                  </a> : null }
              <center>
                       <img src={($imagePreview===null) ? this.state.userdetails.bloburl : imagePreviewUrl } name="aboutme" width="140" height="140" border="0" class="img-circle"/>
                       <h3 className="media-heading">{this.state.userdetails.username}<small>{this.state.userdetails.city}</small></h3>
                       {this.state.disabletags.disableTags ?
                         <div>
                        <span><strong>Skills: </strong></span>
                       {this.props.userSkill.map(skill =>
                            <span className="label label-info">{skill.skill_name}</span>
                       )}</div> : null}

                       </center>
                       <hr/>
                       <center>
                         <div class=" center-block form-group row">
                             <label for="bio" class="col-md-offset-3 col-sm-2 col-form-label">Bio</label>
                             <div class="col-sm-2">
                               <input className ="form-control" type="text" value = {this.state.userdetails.bio}  disabled = {this.state.disabletags.disableTags}
                                                         onChange={(event) => {
                                                             this.setState({
                                                                 userdetails: {
                                                                     ...this.state.userdetails,
                                                                     bio: event.target.value
                                                                 }
                                                             });}}
                                                          />
                             </div>
                           </div>

                           <div class=" center-block form-group row">
                               <label for="phone" class="col-md-offset-3 col-sm-2 col-form-label">Phone</label>
                               <div class="col-sm-2">
                                 <input  className ="form-control" type="text" value = {this.state.userdetails.phone}  disabled = {this.state.disabletags.disableTags}
                                                                   onChange={(event) => {
                                                                       this.setState({
                                                                           userdetails: {
                                                                               ...this.state.userdetails,
                                                                               phone: event.target.value
                                                                           }
                                                                       });}}
                                                                  />
                               </div>
                             </div>

                             <div class=" center-block form-group row">
                                 <label for="phone" class="col-md-offset-3 col-sm-2 col-form-label">Prof Headline</label>
                                 <div class="col-sm-2">
                                   <input  className ="form-control" type="text" value ={this.state.userdetails.prof_headline} disabled = {this.state.disabletags.disableTags}
                                                                                     onChange={(event) => {
                                                                                         this.setState({
                                                                                             userdetails: {
                                                                                                 ...this.state.userdetails,
                                                                                                 prof_headline: event.target.value
                                                                                             }
                                                                                         });}}
                                                                                     />
                                 </div>
                               </div>

                          {!this.state.disabletags.disableTags ?   <div className = "center-block form-group row" ><label for="phone" class="col-md-offset-3 col-sm-2 col-form-label">Change Profile Pic</label><div class="col-sm-2"> <input  className ="form-control" type="file" onChange={this.handleFile} accept=".jpg,.jpeg,.PNG"/></div></div> : null }
                          { this.state.disabletags.updatebutton ? <button className="btn btn-primary" onClick={this.updateuserProfile}>Update</button> : null }

                     </center>


               </div>}
            </div>

        );
    }
}

export default withRouter(connect(mapStateToProps ,mapDispatchToProps)(UserProfile));
