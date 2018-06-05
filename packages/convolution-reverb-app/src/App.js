import React, { Component } from 'react';
import impulses from'./impulses.json';
import {init, applyImpulse} from './Audio';

import { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';

class App extends Component {
  state = {
    spaceType: Object.keys(impulses)[0],
    impulse: impulses[Object.keys(impulses)[0]][0]
  }
  handleTypeChange = (e) => {
    const spaceType = e.target.value;
    const impulse = impulses[spaceType][0]
    this.setState({spaceType, impulse})
    applyImpulse(impulse)
  }
  handleImpulseChange = (e) => {
    const impulse = e.target.value;
    this.setState({impulse})
    applyImpulse(impulse)
  }

  componentDidMount = () => {
    return init(this.state.impulse);
  }
  render() {
    return (
      <div className="App" style={{margin: 100}}>
      <div>
       <FormControl >
          <InputLabel>Space type</InputLabel>
          <Select
            value={this.state.spaceType}
            onChange={this.handleTypeChange}
          >
            {Object.keys(impulses).map(type => (<MenuItem key={type} value={type}>{type}</MenuItem>))}       
          </Select>
        </FormControl>
        </div>
        <div>
        <FormControl >
          <InputLabel>Impulse</InputLabel>
          <Select
            value={this.state.impulse}
            onChange={this.handleImpulseChange}
          >
            {
              impulses[this.state.spaceType]
              .map(impulse => (<MenuItem key={impulse} value={impulse}>{impulse}</MenuItem>))
              }       
          </Select>
        </FormControl>
        </div>
  
      </div>
    );
  }
}

export default App;
