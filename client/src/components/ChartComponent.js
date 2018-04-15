import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Pie } from 'react-chartjs';


class ChartComponent extends Component{

  constructor(props){
    super(props);
  }

  render(){
    var options={
        legend: {
            display: true,
        }
    }
    const pieData = [
          {
              value: this.props.gained,
              color: "#46BFBD",
              highlight: "#5AD3D1",
              label: "Incoming Funds"
          },
          {
              value: this.props.lost,
              color:"#F7464A",
              highlight: "#FF5A5E",
              label: "Outgoing Funds"
          }
      ];
      return <Pie data={pieData} options={options}/>;
  }
}

export default ChartComponent;
