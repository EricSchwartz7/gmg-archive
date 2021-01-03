import React, { Component } from 'react';
import axios from '../../../axios';
import { Link } from 'react-router-dom';

import './SongsList.scss';

class SongsList extends Component {
    state = {
        songs: [],
    }
    
    componentDidMount() {
        this.sortFilterFetch(this.state.filterAndSort);
    }

    sortFilterFetch(params) {
        axios.get("songs")
            .then(response => {
                this.setState({
                    songs: response.data,
                });
                console.log(response.data)
            })
            .catch(error => {
                console.log( error );
            });
    }

    render() {
        let songList = this.state.songs.map((song, i) => {
            return (
                <div className="song" key={i}>
                    <Link to={"/song/" + song.id}>{song.title}</Link>
                </div>
            )
        })
        return (
            <section className="SongsList">
                <h1>All Go Man Go Songs</h1>
                <p>(Including covers)</p>
                <div className="songs">
                    {songList}
                </div>
            </section>
        );
    }
}

export default SongsList;