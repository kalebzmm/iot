import React from 'react';
import {io} from 'socket.io-client';
import GaugeChart from 'react-gauge-chart'
const moment = require('moment');

class ProductDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      humidade: 0,
    }


  }


  componentDidMount(){
    this.socket = io('http://localhost:3000');
    this.socket.on('humidade', valor => {
      valor = parseInt(valor) / 100
      if(valor != this.state.humidade){
        this.setState({
          humidade: valor
        })
      }
    })

  }

  render() {
    return (
      <div class="content">
        <div style={{textAlign: 'center', fontSize: '30pt', marginBottom: 20}}>🌱 Humidade do Solo</div>
        <GaugeChart
          style={{height: 300, width: '600px'}}
          id="gauge-chart3"
          textColor="black"
          nrOfLevels={30}
          colors={["white", "blue"]}
          arcWidth={0.3}
          percent={this.state.humidade}
        />
      </div>
    )
  }
}

export default ProductDetail