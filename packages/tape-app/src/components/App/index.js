import React, {Component} from 'react';
import MainStage from '../MainStage';
import Audio from '../Audio';

class App extends Component {

  render() {
    return (
      <React.Fragment>
        <MainStage />
        <Audio />
      </React.Fragment>
    );
  }
}

export default App;
