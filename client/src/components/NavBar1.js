import React , { Component} from 'react';
import jQuery from 'jquery';
import {Popover} from 'react-bootstrap';
import NavbarAfterLogin from './NavbarAfterLogin';
import NavBeforeLogin from './NavBeforeLogin';
import { withRouter } from 'react-router-dom';


class NavBar1 extends Component{



  render(){
    const isLoggedIn = localStorage.getItem('jwtToken');
    return(
      <div>
        {isLoggedIn ? ( <NavbarAfterLogin /> ) :(<NavBeforeLogin />)}
      </div>
    )
  }
  componentDidMount() {
//   var $j = jQuery.noConflict();
//    $j('[data-toggle="popover"]').popover();
  }
}

export default withRouter(NavBar1);
