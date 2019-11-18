import React, { Component } from 'react';
import axios from 'axios';
import { Button, Label, Modal, Input, Form, Card, Embed } from 'semantic-ui-react'
import { Link, useHistory } from 'react-router-dom';
import DeleteButton from "components/DeleteButton/DeleteButton";
import FormatHelper from "FormatHelper"
import AddMediaDialog from "components/AddMediaDialog/AddMediaDialog"

import './Show.scss';

class Show extends Component {
    state = {
        loadedShow: {},
        loadedVideos: false,
        videos: []
    }

    componentDidMount() {
        this.loadShowData();
        this.loadVideos();
    }

    loadShowData () {
        if ( this.props.match.params.id ) {
            if ( !this.state.loadedShow || (this.state.loadedShow && this.state.loadedShow.id !== +this.props.match.params.id) ) {
                axios.get( '/shows/' + this.props.match.params.id )
                    .then( response => {
                        this.setState({loadedShow: response.data});
                    }).catch( () => {
                        this.setState({loadedShow: "notfound"});
                    })
            }
        }
    }

    loadVideos() {
        if ( this.props.match.params.id ) {
            axios.get("/get_videos/" + this.props.match.params.id)
                .then( (response) => {
                    this.setState({
                        videos: response.data,
                        loadedVideos: true
                    });
                });
        }
    }

    deleteShow = () => {
        axios.delete("/shows/" + this.props.match.params.id)
        let history = useHistory();
        history.push("/shows");
    }

    handleSubmit(videoData) {
        videoData.show_id = this.props.match.params.id;
        axios.post('/videos', videoData).then( (response) => 
            this.setState({
                videos: this.state.videos.concat(response.data)
            })
        );
    }

    render () {
        let show = <p style={{ textAlign: 'center' }}>Please select a Show!</p>;
        if ( this.props.match.params.id ) {
            show = <p style={{ textAlign: 'center' }}>Loading show #{this.props.match.params.id}...</p>;
        }
        if (this.state.loadedShow === "notfound") {
            show = (
                <div>
                    <h3>404 Not Found</h3>
                </div>
            )
        } else if (this.state.loadedShow && this.state.loadedVideos) {
            let date = new Date(this.state.loadedShow.date + " EST").toLocaleDateString();
            let firstSet = FormatHelper.formatSetlist(this.state.loadedShow.first_set);
            let secondSet = FormatHelper.formatSetlist(this.state.loadedShow.second_set);
            let encore = FormatHelper.formatSetlist(this.state.loadedShow.encore);

            const YOUTUBE_CONSTANT = "watch?v=";
            const videos = this.state.videos.map( (video) => {
                let sliceNumber = video.url.indexOf(YOUTUBE_CONSTANT) + YOUTUBE_CONSTANT.length
                let id = video.url.slice(sliceNumber);
                return {
                    id: id,
                    title: video.title
                }
            });

            show = (
                <div className="Show">
                    <h1>{date}</h1>
                    <h2>{this.state.loadedShow.venue}</h2>
                    <p><span>SET 1: </span>{firstSet}</p>
                    {secondSet ? (<p><span>SET 2: </span>{secondSet}</p>) : null}
                    {encore ? (<p><span>ENCORE: </span>{encore}</p>) : null}
                    <div className="button-group">
                        <Link to={'/upload/' + this.props.match.params.id}>        
                            <Button>Edit</Button>
                        </Link>
                        <AddMediaDialog handleSubmit={this.handleSubmit.bind(this)}/>
                        <DeleteButton history={this.props.history} id={this.props.match.params.id} />
                    </div>
                    <div className="videos">
                        {videos.map( (video, i) => 
                            <div key={i}>
                                <h3>{video.title}</h3>
                                <Embed 
                                    id={video.id}
                                    placeholder="https://f4.bcbits.com/img/a3887907904_16.jpg"
                                    source="youtube"
                                    iframe={{
                                        allowFullScreen: true,
                                        style: {
                                          padding: 10,
                                        },
                                      }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            );
        }
        return show;
    }
}

export default Show;