import React, { Component } from 'react'
import {Audio} from 'cloudinary-react';
import {Icon} from 'semantic-ui-react';
import _ from 'lodash';
import "./MusicPlayer.scss"

class MusicPlayer extends Component {

    state = {
        publicID: "",
        loadingSong: false,
        title: ""
    }

    componentDidMount() {
        const player = document.getElementById('player');
        player.addEventListener("canplaythrough", () => {
            this.setState({
                loadingSong: false
            });
        });
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.publicID !== nextProps.publicID) {
            this.setState({
                publicID: nextProps.publicID,
                title: nextProps.title,
                loadingSong: true
            });
            this.load();
        }
        return true;
    }

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
        let songTitle;
        if (this.state.loadingSong) {
            songTitle = <Icon className="music-loader" loading name="spinner" size="big" />
            this.load();
        } else if (this.state.publicID) {
            songTitle = <div className="now-playing">Now Playing: {this.state.title}</div>;
        }
        let player =
            <Audio 
                id="player"
                sourceTypes={['wav', 'mp3']}
                controls={!this.state.loadingSong && !_.isEmpty(this.state.publicID)}
                publicId={this.state.publicID}
                fallback="Cannot play audio"/>

        return <div className="music-player">
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