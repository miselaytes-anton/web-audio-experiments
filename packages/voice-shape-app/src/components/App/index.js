import React, {Component} from 'react';
import Recorder from '../Recorder';
import Visualizer from '../Visualizer';
import Header from '../Header';

import {FlexContainer, FlexItem} from '../Layout';

class App extends Component {

  render() {
    return (
      <FlexContainer>
        <FlexItem style={{height: '20%'}}><Header /></FlexItem>
        <FlexItem style={{height: '10%'}}><Recorder /></FlexItem>
        <FlexItem style={{height: '70%'}}><Visualizer /></FlexItem>
      </FlexContainer>
    );
  }
}

export default App;
