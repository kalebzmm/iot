import React from 'react';
import {io} from 'socket.io-client';
import dynamic from 'next/dynamic';
const GaugeChart = dynamic(() => import('react-gauge-chart'), { ssr: false });

class ProductDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      humidade: 0,
      irrigando: false
    }

  }

  componentDidMount(){
    this.socket = io('http://localhost:3000');
    this.socket.on('humidade', valor => {
      valor = parseInt(valor) / 100;
      if(valor != this.state.humidade){
        this.setState({
          humidade: valor
        })
      }
    })

    this.socket.on('irrigacao', comando => {
      switch(comando){
        case '1':
          this.setState({irrigando: true})
          break;
        case '0':
          this.setState({irrigando: false})
          break;
      }
    })

  }

  irrigar(){
    this.socket.emit('irrigacao', '1');
  }

  render() {
    return (
      <div className="content">
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
        <button type="button" className={`bubbly-button ${this.state.irrigando == true ? 'animate disabled' : ''}`} disabled={this.state.irrigando} onClick={() => this.irrigar()}>{this.state.irrigando == true ? 'Irrigando...' : 'Irrigar'}</button>
      </div>
    )
  }
}

export default ProductDetail