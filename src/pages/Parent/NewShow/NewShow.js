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
            first_set: []
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
                })
            });
    }

    updateHandler = () => {
        axios.put('/shows/' + this.props.match.params.id, {
            show: this.state.showData
        }).then(response => {
            this.setState({
                routeToShow: true,
                showID: response.data.id
            })
        })
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
        if (field != "first_set") {
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

    addSong(e, songData) {
        // Add the selected song to the setlist
        const showData = this.state.showData;
        const firstSet = showData.first_set;
        firstSet.push(songData.value);
        this.setState({
            showData: showData
        });
    }

    // convertFirstSet() {
    //     const firstSetIDs = this.state.showData.first_set;
    //     let convertedFirstSet = ""

    //     if (firstSetIDs.length > 0) {
    //     //     firstSetSongs.forEach((song, i) => {
    //     //         convertedFirstSet += song.title;
    //     //         if (i !== firstSetSongs.length - 1) {
    //     //             convertedFirstSet += ", ";
    //     //         }
    //     //     });

    //         firstSetIDs.forEach((songID, i) => {
    //             let song = this.state.songsList.find(songData => {
    //                 return songData.value === songID
    //             });
    //             convertedFirstSet += song.text;
    //             if (i !== firstSetIDs.length - 1) {
    //                 convertedFirstSet += ", ";
    //             }
    //         })

    //     }
    //     return convertedFirstSet;
    // }

    render () {
        if (this.state.routeToShow === true) {
            return <Redirect to={'/show/' +  this.state.showID}/>
        }

        const panels = [
            {
                key: "secondSet",
                title: "Second Set",
                content: {
                    as: Form.TextArea,
                    value: this.state.showData.second_set,
                    onChange: (event) => this.handleChange("second_set", event.target.value)
                }
            },
            {
                key: "encore",
                title: "Encore",
                content: {
                    as: Form.TextArea,
                    rows: 1,
                    value: this.state.showData.encore,
                    onChange: (event) => this.handleChange("encore", event.target.value)
                }
            }
        ]

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
                        <Dropdown
                            placeholder='Select Song'
                            // onClick={this.getAllSongs.bind(this)}
                            fluid
                            selection
                            options={this.state.songsList}
                            onChange={this.addSong.bind(this)}
                        />
                        {/* <TextArea
                            value={firstSetTitles} 
                            onChange={(event) => this.handleChange("first_set", event.target.value)} 
                        /> */}
                        <div>
                            {this.state.showData.first_set.map((song, i) => {
                                let last = false
                                if (i === this.state.showData.first_set.length - 1) {
                                    last = true;
                                }
                                return <SongTitle title={song.title} last={last} />
                            })}
                        </div>
                    </Form.Field>
                    {this.props.match.params.id && this.state.loading ? 
                        null :
                        <Accordion 
                            as={Form.Field} 
                            panels={panels} 
                            defaultActiveIndex={[
                                this.state.showData.second_set ? 0 : -1,
                                this.state.showData.encore ? 1 : -1
                            ]}
                            exclusive={false}/>
                    }
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