import styled from 'styled-components';

export const Button = styled.button`
  min-width: 110px;
  display: inline-block;
  padding: 0.5rem;
  background: black;
  color: white;
  cursor: pointer;
  border: 2px solid black;
  :hover {
    color: black;
    background: white;
  }
  :disabled {
    color: white;
    background: #ccc;
    border: none;
    cursor: no-drop;
  }
`;

export const FlexContainer = styled.div`
  height: 100%;
  padding: 0;
  margin: 0;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  align-items: center;
  // justify-content: center;
  flex-direction: column;
`;
export const FlexItem = styled.div`
  margin: 10px;
  text-align: center;
`;

export const H1 = styled.h1`
 font-family: 'Ceviche One', cursive;
 font-size: 5rem;
 margin: 0;
`;
