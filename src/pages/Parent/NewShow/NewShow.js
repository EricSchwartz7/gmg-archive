import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Button, Form, Input, TextArea, Accordion, Dropdown } from 'semantic-ui-react'
import _ from 'lodash';

import './NewShow.scss';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import SongTitle from '../../../components/SongTitle/SongTitle';

class NewShow extends Component {
    state = {
        showData: {
            date: '',
            venue: '',
            first_set: [],
            setlist: []
        },
        routeToShow: false,
        showID: 0,
        songsList: [],
        loading: true,
    }

    componentDidMount () {
        this.loadData();
        this.getAllSongs();
    }

    loadData () {
        if ( this.props.match.params.id ) {
            axios.get( '/shows/' + this.props.match.params.id )
                .then( response => {
                    console.log(response);
                    this.setState({
                        showData: response.data
                    });
                })
                .finally( () => {
                    this.setState( { 
                        loading: false
                    });
                });
        }
    }


    postDataHandler = () => {
        axios.post('/shows', this.state.showData)
            .then(response => {
                this.setState({
                    routeToShow: true,
                    showID: response.data.id
                });
            });
    }

    updateHandler = () => {
        axios.put('/shows/' + this.props.match.params.id, this.state.showData)
            .then(response => {
                this.setState({
                    routeToShow: true,
                    showID: response.data.id
                });
            });
    }

    handleSelectDate = date => {
        this.setState({
            date: date
        });
    };

    handleChange (field, value) {
        let showData = this.state.showData;
        showData[field] = value;
        // debugger;
        if (field != "setlist") {
            this.setState({
                showData: showData
            });
        }
    }

    getAllSongs() {
        axios.get("/songs")
            .then(response => {
                const songsList = response.data.map((song, i) => ({
                    key: i,
                    text: song.title,
                    value: song.id
                }));
                this.setState({
                    songsList: songsList
                });
            });
    }

    addSong(setNumber, e, dropdownSelection) {
        // Add the selected song to the setlist
        const showData = this.state.showData;
        const setlist = showData.setlist;
        const song = dropdownSelection.options.find( song => song.value === dropdownSelection.value );
        const formattedSong = {
                id: song.value,
                title: song.text,
                set: setNumber
            }
        setlist.push(formattedSong);
        this.setState({
            showData: showData
        });
    }

    deleteSong(props) {
        this.state.showData.setlist.splice(props.song.position, 1);
        this.setState({
            showData: this.state.showData
        });
    }

    render () {
        if (this.state.routeToShow === true) {
            return <Redirect to={'/show/' +  this.state.showID}/>
        }

        const selectSongDropdown = setNumber => {
            return <Dropdown
                placeholder='Select Song'
                fluid
                selection
                options={this.state.songsList}
                onChange={this.addSong.bind(this, setNumber)}
            />
        }

        const songsListed = setNumber => {
            return this.state.showData.setlist
                .filter(song => song.set === setNumber)
                .map((song, i) => {
                    let last = false
                    if (i === this.state.showData.setlist.length - 1) {
                        last = true;
                    }
                    return (
                        <div key={i}>
                            <SongTitle 
                                song={song} 
                                last={last} 
                                vertical 
                                button 
                                deleteSong={this.deleteSong.bind(this)}/>
                        </div>
                    )
                })
        };

        const firstSetSongs = songsListed(1);

        return (
            <div className="NewShow">
                <Form>
                    {this.props.match.params.id ? <h1>Edit Show Details</h1> : <h1>Add a Show</h1>}
                    <Form.Field>
                        <label>Date</label>
                        <input 
                            type="date" 
                            className="ui calendar" 
                            value={this.state.showData.date} 
                            onChange={(event) => this.handleChange("date", event.target.value)}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Venue</label>
                        <Input value={this.state.showData.venue} onChange={(event) => this.handleChange("venue", event.target.value)} />
                    </Form.Field>
                    <Form.Field>
                        <label>First Set</label>
                        {selectSongDropdown(1)}
                        {songsListed(1)}
                    </Form.Field>
                        <Form.Field>
                        <label>Second Set</label>
                        {selectSongDropdown(2)}
                        {songsListed(2)}
                    </Form.Field>
                    <Form.Field>
                        <label>Encore</label>
                        {selectSongDropdown(3)}
                        {songsListed(3)}
                    </Form.Field>
                    <div className="submit-button">
                        {this.props.match.params.id ? 
                            <Button type="Submit" onClick={this.updateHandler}>Save</Button> :
                            <Button type="Submit" onClick={this.postDataHandler}>Add Show</Button>}
                    </div>
                </Form>
            </div>
        );
    }
}

export default NewShow;