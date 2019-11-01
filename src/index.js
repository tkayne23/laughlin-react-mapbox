import React from 'react'
import ReactDOM from 'react-dom'
import mapboxgl from 'mapbox-gl'
import data from './data.json'

mapboxgl.accessToken = 'pk.eyJ1IjoidGtheW5lMjMiLCJhIjoiY2syZHNmZXprMDIyMTNjcXBvZTM1aW5zNCJ9.6SEZoK2Ni6crk2LuEdvXjg';

const options = [{
  name: 'SqFtVariance',
  description: 'Sq Ft Variance',
  property: 'Sq_Ft_Vari',
  stops: [
    [-858, '#0c2c84'],
    [-654, '#fd8d3c'],
    [-431, '#c6dbef'],
    [-50, '#fcc5c0'],
    [50, '#41ab5d']
  ]
  
}, {
  name: 'BathVariance',
  description: 'Bathroom Variance',
  property: 'Bath_Varia',
  stops: [
    [-5, '#4575b4'],
    [0, '#54278f'],
    [.5, '#fcc5c0'],
    [1, '#f768a1'],
    [2, '#7a0177']
  ]
}, {
  name: 'BedVariance',
  description: 'Bedroom Variance',
  property: 'Bed_Varian',
  stops: [
    [-1, '#4575b4'],
    [0, '#54278f'],
    [1, '#fcc5c0'],
    [2, '#f768a1'],
    [3, '#7a0177']
  ]
}]

class Application extends React.Component {
  map;

  constructor(props: Props) {
    super(props);
    this.state = {
      active: options[0]
    };
  }

  componentDidUpdate() {
    this.setFill();
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [-100.792, 29.352],
      zoom: 15.06
    });

    this.map.on('load', () => {
      this.map.addSource('laughlin', {
        type: 'geojson',
        data
      });

      this.map.addLayer({
        id: 'laughlin',
        type: 'fill',
        source: 'laughlin'
      }, 'country-label-lg'); // ID metches `mapbox/streets-v9`

      this.setFill();
    });
  }

  setFill() {
    const { property, stops } = this.state.active;
    this.map.setPaintProperty('laughlin', 'fill-color', {
      property,
      stops
    });    
  }

  render() {
    const { name, description, stops, property } = this.state.active;
    const renderLegendKeys = (stop, i) => {
      return (
        <div key={i} className='txt-s'>
          <span className='mr6 round-full w12 h12 inline-block align-middle' style={{ backgroundColor: stop[1] }} />
          <span>{`${stop[0].toLocaleString()}`}</span>
        </div>
      );
    }

    const renderOptions = (option, i) => {
      return (
        <label key={i} className="toggle-container">
          <input onChange={() => this.setState({ active: options[i] })} checked={option.property === property} name="toggle" type="radio" />
          <div className="toggle txt-s py3 toggle--active-white">{option.name}</div>
        </label>
      );
    }

    return (
      <div>
        <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
        <div className="toggle-group absolute top left ml12 mt12 border border--2 border--white bg-white shadow-darken10 z1">
          {options.map(renderOptions)}
        </div>
        <div className="bg-white absolute bottom right mr12 mb24 py12 px12 shadow-darken10 round z1 wmax180">
          <div className='mb6'>
            <h2 className="txt-bold txt-s block">{name}</h2>
            <p className='txt-s color-gray'>{description}</p>
          </div>
          {stops.map(renderLegendKeys)}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Application />, document.getElementById('app'));
