import React, {Component} from 'react';
import styled from 'styled-components';

const H1 = styled.h1`
 font-family: 'Ceviche One', cursive;
 font-size: 5rem;
 margin: 0;
`;

class Header extends Component {

  render() {
    return (
      <div>
        <H1>Voice Shape</H1>
      </div>
    );
  }
}

export default Header;
