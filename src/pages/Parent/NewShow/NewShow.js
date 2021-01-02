import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Button, Form, Input, TextArea, Accordion, Dropdown } from 'semantic-ui-react'
import _ from 'lodash';

import './NewShow.scss';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import SongTitle from '../../../components/SongTitle/SongTitle';
import DeleteButton from "components/DeleteButton/DeleteButton";

class NewShow extends Component {
    state = {
        showData: {
            date: '',
            venue: '',
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
            axios.get( 'shows/' + this.props.match.params.id )
                .then( response => {
                    this.setState({
                        showData: response.data
                    });
                    this.updatePositions();
                })
                .finally( () => {
                    this.setState( { 
                        loading: false
                    });
                });
        }
    }


    postDataHandler = () => {
        axios.post('shows', this.state.showData)
            .then(response => {
                this.setState({
                    routeToShow: true,
                    showID: response.data.id
                });
            });
    }

    updateHandler = () => {
        axios.put('shows/' + this.props.match.params.id, this.state.showData)
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
        if (field != "setlist") {
            this.setState({
                showData: showData
            });
        }
    }

    getAllSongs() {
        axios.get("songs")
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

    updatePositions() {
        const showData = this.state.showData;
        const setlist = showData.setlist;
        const sortedSetlist = [];
        for (let i = 1; i <= 3; i++) {
            let currentSet = setlist.filter(song => song.set === i);
            if (currentSet.length > 0) {
                let sortedSet = currentSet.sort((a, b) => a.position - b.position);
                sortedSetlist.push(...sortedSet);
            }
        }
        sortedSetlist.forEach((song, i) => {
            song.tempPosition = i
        })
        showData.setlist = sortedSetlist;
        this.setState({
            showData: showData
        })
    }

    addSong(setNumber, e, dropdownSelection) {
        const showData = this.state.showData;
        const setlist = showData.setlist;
        const song = dropdownSelection.options.find( song => song.value === dropdownSelection.value );

        const formattedSong = {
            id: song.value,
            title: song.text,
            set: setNumber
        }
        setlist.push(formattedSong);
        this.updatePositions();
    }

    deleteSong(props) {
        const setlist = this.state.showData.setlist;
        setlist.splice(props.song.tempPosition, 1);
        this.updatePositions();
        this.setState({
            showData: this.state.showData
        });
    }

    render () {
        if (this.state.routeToShow === true) {
            return <Redirect to={'/show/' +  this.state.showID}/>
        }

        const selectSongDropdown = setNumber => {
            const songsList = this.state.songsList.sort((a, b) => (a.text > b.text) ? 1 : -1);
            return <Dropdown
                placeholder='Select Song'
                search
                selection
                options={songsList}
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
                        <div className="songs-listed">
                            {songsListed(1)}
                        </div>
                    </Form.Field>
                        <Form.Field>
                        <label>Second Set</label>
                        {selectSongDropdown(2)}
                        <div className="songs-listed">
                            {songsListed(2)}
                        </div>
                    </Form.Field>
                    <Form.Field>
                        <label>Encore</label>
                        {selectSongDropdown(3)}
                        <div className="songs-listed">
                            {songsListed(3)}
                        </div>
                    </Form.Field>
                    {this.props.match.params.id ? 
                        <div className="submit-button">
                            <Button className="save-button" type="Submit" onClick={this.updateHandler}>Save</Button>
                            <DeleteButton history={this.props.history} id={this.props.match.params.id} /> 
                        </div> :
                        <div className="submit-button">
                            <Button type="Submit" onClick={this.postDataHandler}>Add Show</Button>
                        </div>}
                </Form>
            </div>
        );
    }
}

export default NewShow;