import React, { Component } from 'react';
import axios from '../../../axios';
import { Link } from 'react-router-dom';

import './SongsList.scss';

class SongsList extends Component {
    state = {
        songs: [],
        filterAndSort: {
            year_filter: "",
            venue_filter: "",
            sort_order: "most_recent"
        }
    }
    
    componentDidMount() {
        this.sortFilterFetch(this.state.filterAndSort);
    }

    sortFilterFetch(params) {
        axios.post("/filtered_songs", params)
            .then(response => {
                this.setState({
                    songs: response.data,
                    filterAndSort: {...params}
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
                <div>
                    <Link className="song" to={"/song/" + song.id} key={i}><h3>{song.title}</h3></Link>
                </div>
            )
        })
        return (
            <section className="SongsList">
                <h1>All Go Man Go Songs</h1>
                <div className="songs">
                    {songList}
                </div>
            </section>
        );
    }
}

export default SongsList;