import React, {Component} from 'react';
import './App.css';
import ThreeScene from "./ThreeScene";
import GLShaderSample from "./glShaderSample";

import WarpingScene from "./ThreeSceneGridWarping";

import spotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new spotifyWebApi();

class App extends Component {
  constructor(props) {
    super(props);
    const params = this.getHashParams();
    console.log(params);
    this.state = {
      loggedIn: params.access_token ? true : false,
      nowPlaying: {
        name:"Not Checked",
        image: "",
        artist: ""
      },
      currentStats: {
        currentLoudness: null
      },
      width: 0, 
      height: 0,
      currentVisualization: 0
    }
    if (params.access_token) {
      spotifyApi.setAccessToken(params.access_token);
    }
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  componentDidMount() {
    if (this.state.loggedIn == true) {
      this.intervalId = setInterval(() => this.getNowPlaying(), 250);
      this.getNowPlaying(); 
    }
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
    window.removeEventListener('resize', this.updateWindowDimensions);

  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  getNowPlaying() {
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        const timeStampSeconds = response.progress_ms / 1000;
        spotifyApi.getAudioAnalysisForTrack(response.item.id)
        .then((analysis) => {
          const result = analysis.segments.filter(trackDataPoint => trackDataPoint.start + trackDataPoint.duration > timeStampSeconds);
          this.setState({
            currentStats: {
              currentLoudness: result[0].loudness_max,
            }
          })        
        })
        this.setState({
          nowPlaying: {
            name:response.item.name,
            image: response.item.album.images[0].url,
            artist: response.item.artists[0].name
          }
        })
      })
    }
  render() {
    return (
      <div className="App">
        {(() => {
          switch (this.state.currentVisualization) {
            case 0:
              return <GLShaderSample currentLoudness = {this.state.currentStats.currentLoudness} screenWidth={this.state.width} screenHeight={this.state.height} albumArtwork={this.state.nowPlaying.image}></GLShaderSample>
            }
        })()}
        <div id="musicPlayerContainer">
          <div id="musicInfo">
            <div>
              {this.state.nowPlaying.name}
              <br></br>
              <span id="artistName">
              {this.state.nowPlaying.artist}
              </span>
            </div>
            </div>
            <img src={this.state.nowPlaying.image} style={{width: 100}}/>
          {this.state.loggedIn == false && 
          <a href="http://localhost:8888">
            <button>Login With Spotify</button>
          </a>
          }
        </div>

        {/* <WarpingScene></WarpingScene> */}
        {/* <ThreeScene cubesNumber = {6} sizeSphere = {this.state.currentStats.currentLoudness}></ThreeScene> */}
      </div>
    );
  }
}

export default App;
