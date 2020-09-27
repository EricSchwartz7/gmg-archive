import React, { Component } from 'react'
import {Audio} from 'cloudinary-react';

class MusicPlayer extends Component {

    state = {
        nowPlaying: "",
        loadingSong: false
    }

    componentDidMount() {
        const player = document.getElementById('player');
        player.addEventListener("canplaythrough", () => {
            this.setState({
                loadingSong: false
            });
        });
    }

    shouldComponentUpdate(prevProps) {
        // let shouldUpdate = false;
        if (this.props.nowPlaying !== prevProps.nowPlaying) {
            this.setState({
                nowPlaying: this.props.nowPlaying,
                loadingSong: true
            });
            this.load();
            // shouldUpdate = true;
        }
        return true;
    }

    // componentDidUpdate() {
    //     debugger;
    // }

    load() {
        const player = document.getElementById('player');
        if (player) {
            player.load();
        }
    }

    play() {
        const player = document.getElementById('player');
        player.play();
    }

    pause() {
        const player = document.getElementById('player');
        player.pause();
    }
    
    render() {
        let songTitle = <p>Select a song</p>;
        if (this.state.loadingSong) {
            songTitle = `Loading ${this.state.nowPlaying}`;
        } else if (this.state.nowPlaying) {
            songTitle = <p>Public ID: {this.state.nowPlaying}</p>;
        }
        let player =
            <Audio 
                id="player"
                sourceTypes={['wav', 'mp3']}
                controls={!this.state.loadingSong && !!this.state.nowPlaying}
                publicId={this.state.nowPlaying}
                fallback="Cannot play audio"/>

        return <div>
            {songTitle}
            {player}
        </div>
        
    }
}

export default MusicPlayer;

{/* <div>  */}
{/* <button onClick={this.play.bind(this)}>Play</button>  */}
{/* <button onClick={this.pause.bind(this)}>Pause</button>  */}
{/* <button onClick="document.getElementById('player').volume += 0.1">Vol +</button>  */}
{/* <button onClick="document.getElementById('player').volume -= 0.1">Vol -</button>  */}
{/* </div> */}