import React,{Component} from 'react';




class CategoryItem extends Component {


  render(){
      return(
        <div className = "panel-body-item " style={{color:this.props.activeId===this.props.item.category_id ? 'blue' : 'black'}} >
          {this.props.item.skill_category_name}
        </div>
      );

    }
}

export default CategoryItem;
