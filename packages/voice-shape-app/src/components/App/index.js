import React, {Component} from 'react';
import Recorder from '../Recorder';
import Visualizer from '../Visualizer';
import Header from '../Header';

import {FlexContainer, FlexItem} from '../Styled';

class App extends Component {

  render() {
    return (
      <FlexContainer>
        <FlexItem><Header /></FlexItem>
        <FlexItem><Recorder /></FlexItem>
        <FlexItem><Visualizer /></FlexItem>
      </FlexContainer>
    );
  }
}

export default App;
