import React, {Component} from 'react';
import impulses from './impulses.json';
import {init, applyImpulse} from './Audio';

import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import {InputLabel} from 'material-ui/Input';
import {MenuItem} from 'material-ui/Menu';
import {FormControl} from 'material-ui/Form';
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

  render() {
    return (
      <div className="App" style={{margin: 100}}>
        <Typography variant="headline" color="primary" style={{marginBottom: 20}}>
          Convolution Reverb Demo
        </Typography>
        <Typography style={{marginBottom: 10}}>
          Please use <strong>headphones</strong>. Snap your fingers near a mic or connect an instrument to line-in.
        </Typography>
        <Button
          onClick={()=>init(this.state.impulse)}
          variant="raised"
          size="small"
          style={{marginBottom: 50}}>
          Unmute
        </Button>
        <div>
          <FormControl>
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
          <FormControl>
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
        <Typography style={{marginTop: 40}}>
          <a href="https://github.com/miselaytes-anton/web-audio-experiments/tree/master/packages/convolution-reverb-app">
            GitHub
          </a>
        </Typography>
        <Typography style={{marginTop: 10}}>
          <a href="http://www.echothief.com">
              Impulse responses
          </a>
        </Typography>

      </div>
    );
  }
}

export default App;
