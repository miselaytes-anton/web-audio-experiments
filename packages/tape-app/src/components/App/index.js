import React, {Component} from 'react';
import MainStage from '../MainStage';
import Audio from '../Audio';
import Footer from '../Footer';

class App extends Component {

  render() {
    return (
      <React.Fragment>
        <MainStage />
        <Audio />
        <Footer />

      </React.Fragment>
    );
  }
}

export default App;
