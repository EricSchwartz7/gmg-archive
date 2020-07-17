import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import './Song.scss';

class Song extends Component {
    state = {
        loadedSong: {},
        showAppearances: []
    }

    componentDidMount() {
        this.loadSongData();
        this.fetchShowAppearances();
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

    fetchShowAppearances() {
        if (this.props.match.params.id) {
            axios.get("/show_appearances/" + this.props.match.params.id)
                .then(response => {
                    this.setState({showAppearances: response.data});
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
                    <h3>{this.state.loadedSong.title} was played at the following shows:</h3>
                    <div className="show-list">
                        {this.state.showAppearances.map((show, i) => {
                            return <div key={i}>
                                <Link className="show" to={"/show/" + show.id}>{show.date} - {show.venue}</Link>
                            </div>
                        })}
                    </div>
                    <p className="lyrics">{this.state.loadedSong.lyrics}</p>
                </div>
            )
        }

        return song;
    }
}

export default Song;