import React, {Component} from 'react';
import MainStage from '../MainStage';
import Audio from '../Audio';
import Header from '../Header';

class App extends Component {

  render() {
    return (
      <React.Fragment>
        <Header />
        <MainStage />
        <Audio />
      </React.Fragment>
    );
  }
}

export default App;
