import React,{Component} from 'react';
import { connect } from 'react-redux';
import {getAllCategories, getAllSkillsByCategory,skillAdded, skillRemoved} from '../actions';
import CategoryItem from './CategoryItem';
import SkillItem from './SkillItem';
import SelectedFinalSkill from './SelectedFinalSkill';


const mapDispatchToProps = (dispatch) => {

    let actions = {getAllCategories,getAllSkillsByCategory,skillAdded,skillRemoved};
    return { ...actions, dispatch };
}

const mapStateToProps = (state) => {

  return {
      categories: state.skillReducer.categories,
      skillsByCategory : state.skillReducer.skillsByCategory
    };
}


class ProfileStep1 extends Component{

  static defaultProps = {
    categories: [],
    skillsByCategory : []
  }

  constructor(props){
    super(props);
    this.state ={
      activeId: 'web_design',
      skills: []
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleGetSkillByCategory = this.handleGetSkillByCategory.bind(this);
    this.isValidated= this.isValidated.bind(this);

  }

  componentWillMount(){
      this.props.dispatch(getAllCategories());
      this.props.dispatch(getAllSkillsByCategory());
  }
  handleSkillAdded(skill){
      let skills = this.state.skills;
      skills.push(skill);
      this.setState({skills : skills},function(){
        this.props.dispatch(skillAdded(this.state));
      });
  }
  handleSkillRemoved(skill){
    let skills = this.state.skills;
    let index = skills.findIndex(x => x === skill);
    skills.splice(index,1);
    this.setState({skills : skills},function(){
      this.props.dispatch(skillRemoved(this.state));
    });

  }

  handleGetSkillByCategory(){

  }
  handleClick(item){
    this.setState({
          activeId: item
      });
  }

  isValidated() {

      return true;


  }


  render(){
  
    let result = this.props.skillsByCategory.filter(category => category.category_id === this.state.activeId);
    return(
      <div  >
      <div className = " gap wizard ">
        <h1>Select your skills to help us recommend jobs</h1>
      </div>
        <div className="panel panel-default col-md-3 skill-category-panel">
          <div className="panel-body">
            <input className="form-control" placeholder="Search" name="srch-term" id="srch-term" type="text"/>
                {this.props.categories ? this.props.categories.map(item =><div onClick={this.handleClick.bind(this, item.category_id)}><CategoryItem item ={item} activeId = {this.state.activeId}/></div>):null}
          </div>
        </div>


        <div className="panel panel-default col-md-3 skill-category-panel">
          <div className = "panel-body">
            {result.map(skills => skills.skills.map(skill => <div>  <SkillItem id = {skill.id} allSelectedSkills={this.state.skills} skill ={skill.name} removeSkills = {this.handleSkillRemoved.bind(this)} addSkills= {this.handleSkillAdded.bind(this)}/>  </div>))}
          </div>
        </div>

        <div className="panel panel-default col-md-3 skill-category-panel">
          <div className = "panel-body">
            {this.state.skills ? this.state.skills.map(item => <SelectedFinalSkill finalSkill= {item}/>) :null}
          </div>
        </div>

      </div>

    );
  }
}
export default connect( mapStateToProps,mapDispatchToProps)(ProfileStep1)
