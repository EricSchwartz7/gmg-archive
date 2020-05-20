import React, { Component } from 'react';
import axios from 'axios';

import './Song.scss';

class Song extends Component {
    state = {
        loadedSong: {}
    }

    componentDidMount() {
        this.loadSongData();
    }

    loadSongData() {
        if (this.props.match.params.id) {
            axios.get("/songs/" + this.props.match.params.id)
                .then(response => {
                    this.setState({loadedSong: response.data})
                }).catch( () => {
                    this.setState({loadedShow: "notfound"});
                });
        }
    }

    render() {
        let song;
        if ( this.props.match.params.id ) {
            song = <p style={{ textAlign: 'center' }}>Loading song #{this.props.match.params.id}...</p>;
        }
        if (this.state.loadedSong === "notfound") {
            song = (
                <div>
                    <h3>404 Not Found</h3>
                </div>
            )
        } else if (this.state.loadedSong) {
            song = (
                <div className="Song">
                    <h1>{this.state.loadedSong.title}</h1>
                    <p>{this.state.loadedSong.lyrics}</p>
                </div>
            )
        }

        return song;
    }
}

export default Song;