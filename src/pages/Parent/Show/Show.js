import React, { Component } from 'react';
import axios from 'axios';
import { Button, Embed, Card } from 'semantic-ui-react'
import { Link, useHistory } from 'react-router-dom';
import DeleteButton from "components/DeleteButton/DeleteButton";
import FormatHelper from "FormatHelper"
import AddMediaDialog from "components/AddMediaDialog/AddMediaDialog"
import {Image, Video, Transformation, CloudinaryContext} from 'cloudinary-react';
import {Cloudinary} from 'cloudinary-core';
import _ from "lodash"

import './Show.scss';

class Show extends Component {
    state = {
        loadedShow: {},
        loadedVideos: false,
        videos: [],
        photos: [],
        uploadWidget: {},
        songsList: []
    }

    componentDidMount() {
        this.loadShowData();
        this.loadVideos();
        this.getAllSongs();
        this.loadPhotos();
        // this.createUploadWidget();
    }

    loadShowData () {
        if (this.props.match.params.id && _.isEmpty(this.state.loadedShow)) {
                axios.get( '/shows/' + this.props.match.params.id )
                    .then( response => {
                        this.setState({loadedShow: response.data});
                    }).catch( () => {
                        this.setState({loadedShow: "notfound"});
                    });
            // }
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

    loadPhotos() {
        if ( this.props.match.params.id ) {
            // axios.get("/photos/")
            axios.get(`/photos_from_show/${this.props.match.params.id}`)
                .then(res => {
                    console.log(res)
                    this.setState({photos: res.data.resources});
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

    createSongLinks(setNumber) {
        let songs = this.state.loadedShow.setlist.filter(song => song.set === setNumber);
        if (songs.length > 0) {
            return songs.map((song, i) => {
                let addComma = (i < songs.length - 1);
                return (
                    <span key={i}>
                        <Link to={`/song/${song.id}`}>
                            {song.title}
                        </Link>
                        {addComma ? ", " : ""}
                    </span>
                    )
            })
        }
    }

    // deleteShow = () => {
    //     axios.delete("/shows/" + this.props.match.params.id)
    //     let history = useHistory();
    //     history.push("/shows");
    // }

    handleSubmit(videoData) {
        videoData.show_id = this.props.match.params.id;
        axios.post('/videos', videoData).then( (response) => 
            this.setState({
                videos: this.state.videos.concat(response.data)
            })
        );
    }

    openUploadWidget() {
        window.cloudinary.openUploadWidget(
            { 
                cloud_name: 'gmg-archive-project', 
                upload_preset: 'basic-photo', 
                tags: [this.state.loadedShow.id] 
            }, 
            function(error, result) {
                if (result.event === "success") {
                    this.setState({photos: [result.info, ...this.state.photos]});
                }
            }.bind(this));
    }

    render() {
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
        } else if (this.state.loadedShow.venue && this.state.loadedVideos && this.state.songsList.length > 0) {
            let date = new Date(this.state.loadedShow.date + " EST").toLocaleDateString();

            let firstSetSongs = this.createSongLinks(1);
            let secondSet = this.createSongLinks(2);
            let encore = this.createSongLinks(3);

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
                    <p><span className="set-title">SET 1: </span>{firstSetSongs}</p>
                    {secondSet ? (<p><span className="set-title">SET 2: </span>{secondSet}</p>) : null}
                    {encore ? (<p><span className="set-title">ENCORE: </span>{encore}</p>) : null}
                    <div className="button-group">
                        <Link to={'/upload/' + this.props.match.params.id}>        
                            <Button>Edit</Button>
                        </Link>
                        <AddMediaDialog handleSubmit={this.handleSubmit.bind(this)}/>
                        {/* <DeleteButton history={this.props.history} id={this.props.match.params.id} /> */}
                        <Button onClick={this.openUploadWidget.bind(this)}>Upload Photo</Button>
                    </div>
                    <div className="gallery">
                        <CloudinaryContext cloudName="gmg-archive-project">
                            {
                                this.state.photos.map(data => {
                                    return (
                                        <div className="responsive" key={data.public_id}>
                                            <a target="_blank" href={`https://res.cloudinary.com/gmg-archive-project/image/upload/${data.public_id}.jpg`}>
                                                <Image publicId={data.public_id}>
                                                    <Transformation
                                                        crop="scale"
                                                        // width="300"
                                                        height="200"
                                                        dpr="auto"
                                                        responsive_placeholder="blank"
                                                    />
                                                </Image>
                                            </a>
                                            {/* <div className="desc">Created at {data.created_at}</div> */}
                                        </div>
                                    )
                                })
                            }
                        </CloudinaryContext>
                        <div className="clearfix"></div>
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
                                      }}/>
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