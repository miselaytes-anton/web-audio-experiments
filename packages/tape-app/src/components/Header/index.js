import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {audioBufferLoaded, audioBufferLoading} from '../../actions';
import {getAudioBuffer} from '../../../../web-audio-utils';
import {randomTrack} from '../../util';

const Button = styled.button`
  min-width: 110px;
  display: inline-block;
  border-radius: 3px;
  padding: 0.5rem;
  background: black;
  color: white;
  cursor: pointer;
  margin-left: ${window.innerWidth / 12}px
  border: 2px solid black;
  border-radius: 3px;
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

const Link = styled.a`
  color: black
`;

const audioContext = new AudioContext();

const Header = ({loadAudioSource, audioBuffer, trackIsLoading}) =>
  <div style={{display: 'flex', fontFamily: 'Helvetica,Arial,sans-serif', padding: '10px 50px', fontSize: '13px'}}>
    <Button disabled={trackIsLoading} onClick={() => {
      audioContext.resume().then(() => {
        loadAudioSource(audioContext, randomTrack());
      });
    }} > {trackIsLoading ? 'LOADING TRACK..' : (audioBuffer ? 'CHANGE TRACK' : 'START')} </Button>
    <span style={{marginLeft: 'auto', marginRight: `${window.innerWidth / 12}px`, padding: '10px 0'}}>
      <Link target="_blank" href="https://github.com/miselaytes-anton/web-audio-experiments/tree/master/packages/tape-app">GitHub </Link>
      |
      Tracks from <Link target="_blank"href="http://research.culturalequity.org/rc-b2/home-audio.jsp"> Alan Lomax Archive </Link>
      |
      Inspired by <Link target="_blank"href="https://www.bastl-instruments.com/instruments/thyme/"> Thyme </Link>
    </span>
  </div>;

Header.propTypes = {
  loadAudioSource: PropTypes.func.isRequired,
  audioBuffer: PropTypes.object,
  trackIsLoading:  PropTypes.bool.isRequired,
};
export default connect(
  state => state,
  dispatch => ({
    loadAudioSource: (audioContext, url) => {
      dispatch(audioBufferLoading());
      return getAudioBuffer(audioContext, url).then(audioBuffer => dispatch(audioBufferLoaded(audioBuffer)));
    }
  })
)(Header);
