import React, { Component } from 'react';
import axios from 'axios';
import { Button, Embed, Card, Label } from 'semantic-ui-react'
import { Link, useHistory } from 'react-router-dom';
import DeleteButton from "components/DeleteButton/DeleteButton";
import FormatHelper from "FormatHelper";
import AddMediaDialog from "components/AddMediaDialog/AddMediaDialog";
import Photo from "components/Photo/Photo";
import {Image, Video, Audio, Transformation, CloudinaryContext} from 'cloudinary-react';
import {Cloudinary} from 'cloudinary-core';
import _ from "lodash";
import $ from "jquery";

import './Show.scss';

class Show extends Component {
    state = {
        loadedShow: {},
        loadedVideos: false,
        videos: [],
        photos: [],
        audioRecs: [],
        songsList: []
    }

    componentDidMount() {
        this.showID = this.props.match.params.id;
        this.loadShowData();
        this.loadVideos();
        this.getAllSongs();
        this.loadPhotos();
        this.loadAudioRecs();
    }

    loadShowData () {
        if (this.showID && _.isEmpty(this.state.loadedShow)) {
                axios.get( '/shows/' + this.showID )
                    .then( response => {
                        this.setState({loadedShow: response.data});
                    }).catch( () => {
                        this.setState({loadedShow: "notfound"});
                    });
        }
    }

    loadVideos() {
        if ( this.showID ) {
            axios.get("/get_videos/" + this.showID)
                .then( (response) => {
                    this.setState({
                        videos: response.data,
                        loadedVideos: true
                    });
                });
        }
    }

    loadPhotos() {
        if ( this.showID ) {
            axios.get(`/photos_from_show/${this.showID}`)
                .then(res => {
                    this.setState({photos: res.data.resources});
                });
        }
    }

    loadAudioRecs() {
        if ( this.showID ) {
            axios.get(`/audio_recs_from_show/${this.showID}`)
                .then(res => {
                    this.setState({audioRecs: res.data.resources});
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

    handleSubmit(videoData) {
        videoData.show_id = this.showID;
        axios.post('/videos', videoData).then( (response) => 
            this.setState({
                videos: this.state.videos.concat(response.data)
            })
        );
    }

    generateSignature(callback, params_to_sign) {
        axios.post("/generate_signature", params_to_sign).then( response => {
            callback(response.data.signature);
        })
    }

    openUploadWidget() {
        window.cloudinary.openUploadWidget(
            { 
                cloud_name: "gmg-archive-project",
                sources: ["local", "url", "facebook", "instagram", "google_drive", "dropbox"], 
                upload_preset: "basic-photo",
                apiKey: "119581295779122",
                tags: [this.showID],
                uploadSignature: this.generateSignature
            },
            function(error, result) {
                if (result.event === "success") {
                    if (result.info.is_audio) {
                        this.setState({audioRecs: [result.info, ...this.state.audioRecs]})
                    } else {
                        this.setState({photos: [result.info, ...this.state.photos]});
                    }
                    const media_payload = {
                        public_id: result.info.public_id,
                        show_id: this.showID,
                        media_type: result.info.resource_type
                    };
                    axios.post("/media_items", media_payload);
                }
            }.bind(this));
    }

    deleteMediaItem(publicID) {
        const publicIDWithoutFolder = publicID.replace("gmg/", "");
        axios.delete(`media_items/${publicIDWithoutFolder}`).then(function(response) {
            if (response.data.result === "ok") {
                const photos = this.state.photos.filter(photo => photo.public_id !== response.data.public_id);
                this.setState({
                    photos: photos
                });
            }
        }.bind(this));
    }

    render() {
        let show = <p style={{ textAlign: 'center' }}>Please select a Show!</p>;
        if ( this.showID ) {
            show = <p style={{ textAlign: 'center' }}>Loading show #{this.showID}...</p>;
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
                        <Link to={'/upload/' + this.showID}>        
                            <Button>Edit</Button>
                        </Link>
                        <AddMediaDialog handleSubmit={this.handleSubmit.bind(this)}/>
                        {/* <DeleteButton history={this.props.history} id={this.showID} /> */}
                        <Button onClick={this.openUploadWidget.bind(this)}>Upload Media</Button>
                    </div>
                    <div className="gallery">
                        <CloudinaryContext cloudName="gmg-archive-project">
                            <div className="photos">
                                {
                                    this.state.photos.map((data, i) => {
                                        return (
                                            <Photo
                                                key={i}
                                                createdAt={data.created_at}
                                                publicID={data.public_id}
                                                deleteMediaItem={this.deleteMediaItem.bind(this, data.public_id)}
                                            />
                                        )
                                    })
                                }
                            </div>
                            {/* </Card.Group> */}
                            <div className="audio-recs">
                                {
                                    this.state.audioRecs.map(data => {
                                        return (
                                            <div key={data.public_id}>
                                                <Card className="audio-card" color="orange">
                                                    <Image 
                                                        publicId={data.public_id+".png"} 
                                                        resourceType="video" 
                                                        height="100" 
                                                        width="250" 
                                                        flags="waveform"/>
                                                    <Card.Content>
                                                        <Card.Header className="audio-card">Take Me Away</Card.Header>
                                                        {/* <Card.Description> */}
                                                            <Audio
                                                                sourceTypes={['wav', 'mp3']}
                                                                publicId={data.public_id}
                                                                controls
                                                                fallback="Cannot play audio"/>
                                                        {/* </Card.Description> */}
                                                    </Card.Content>
                                                </Card>

                                                {/* <div className="desc">Created at {data.created_at}</div> */}
                                            </div>
                                        )
                                    })
                                }
                            </div>
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