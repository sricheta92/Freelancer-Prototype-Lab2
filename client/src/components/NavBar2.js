import React , { Component} from 'react';


class NavBar2 extends Component{

  render(){
    const isLoggedin = this.props.isLoggedIn;
    return(
      <div>
      {isLoggedin ? (
        <nav className="navbar navbar-inverse navbar2 ">
          <div className="container-fluid">

            <ul className="nav navbar-nav">
              <li className="active"><a href="#">My Projects</a></li>
              <li><a href="#">Dashboard</a></li>
              <li><a href="#">Inbox</a></li>
            </ul>
              <button className="btn navbar-btn btn-pull-right">Post a Project</button>
          </div>

        </nav>

      ) : <div></div>}

</div>

    )
  }


}

export default NavBar2;
