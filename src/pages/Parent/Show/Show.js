import React, { Component } from 'react';
import axios from 'axios';
import { Button, Embed} from 'semantic-ui-react'
import { Link, useHistory } from 'react-router-dom';
import AddMediaDialog from "components/AddMediaDialog/AddMediaDialog";
import Photo from "components/Photo/Photo";
import Video from "components/Video/Video";
import MusicPlayer from "components/MusicPlayer/MusicPlayer";
import AudioRec from "components/AudioRec/AudioRec";
import {CloudinaryContext} from 'cloudinary-react';
import _ from "lodash";

import './Show.scss';

class Show extends Component {
    state = {
        loadedShow: {},
        loadedYouTubeVideos: false,
        youTubeVideos: [],
        photos: [],
        audioRecs: [],
        videos: [],
        songsList: [],
        musicPlayer: {
            publicID: "",
            title: ""
        }
    }

    componentDidMount() {
        this.showID = this.props.match.params.id;
        this.loadShowData();
        this.loadYouTubeVideos();
        this.getAllSongs();
        this.loadPhotos();
        this.loadVideos();
        this.loadAudioRecs();
    }

    loadShowData () {
        if (this.showID && _.isEmpty(this.state.loadedShow)) {
                axios.get(`shows/${this.showID}`)
                    .then(response => {
                        this.setState({loadedShow: response.data});
                    }).catch(() => {
                        this.setState({loadedShow: "notfound"});
                    });
        }
    }

    loadYouTubeVideos() {
        if ( this.showID ) {
            axios.get("get_videos/" + this.showID)
                .then( (response) => {
                    this.setState({
                        youTubeVideos: response.data,
                        loadedYouTubeVideos: true
                    });
                });
        }
    }

    loadPhotos() {
        if ( this.showID ) {
            axios.get(`photos_from_show/${this.showID}`)
                .then(res => {
                    this.setState({photos: res.data.resources});
                });
        }
    }

    loadVideos() {
        if ( this.showID ) {
            axios.get(`videos_from_show/${this.showID}`)
                .then(res => {
                    this.setState({videos: res.data});
                });
        }
    }

    loadAudioRecs() {
        if ( this.showID ) {
            axios.get(`audio_recs_from_show/${this.showID}`)
                .then(res => {
                    this.setState({audioRecs: res.data});
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
        axios.post('videos', videoData).then( (response) => 
            this.setState({
                youTubeVideos: this.state.youTubeVideos.concat(response.data)
            })
        );
    }

    generateSignature(callback, params_to_sign) {
        axios.post("generate_signature", params_to_sign).then( response => {
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
                    const mediaType = result.info.is_audio ? "audio" : result.info.resource_type;
                    const media_payload = {
                        public_id: result.info.public_id,
                        show_id: this.showID,
                        media_type: mediaType
                    };
                    axios.post("media_items", media_payload);
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

    playSong(publicID, title) {
        this.setState({
            musicPlayer: {
                publicID: publicID,
                title: title
            }
        });
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
        } else if (this.state.loadedShow.venue && this.state.loadedYouTubeVideos && this.state.songsList.length > 0) {
            let date = new Date(this.state.loadedShow.date + " EST").toLocaleDateString();

            let firstSetSongs = this.createSongLinks(1);
            let secondSet = this.createSongLinks(2);
            let encore = this.createSongLinks(3);

            const YOUTUBE_CONSTANT = "watch?v=";
            const youTubeVideos = this.state.youTubeVideos.map( (video) => {
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
                    {localStorage.getItem('auth_token') ? 
                        <div className="button-group">
                            <Link to={'/upload/' + this.showID}>        
                                <Button>Edit</Button>
                            </Link>
                            <Button onClick={this.openUploadWidget.bind(this)}>Upload Media</Button>
                            <AddMediaDialog handleSubmit={this.handleSubmit.bind(this)}/>
                        </div> : ""}
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
                            <div className="videos">
                                {
                                    this.state.videos.map((data, i) => {
                                        return (
                                            <Video
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
                            {/* <MusicPlayer 
                                publicID={this.state.musicPlayer.publicID}
                                title={this.state.musicPlayer.title}
                            />
                            <div className="audio-recs">
                                {this.state.audioRecs.map(data => {
                                    return (
                                        <AudioRec
                                            key={data.id}
                                            id={data.id}
                                            publicID={data.public_id}
                                            title={data.title}
                                            playSong={this.playSong.bind(this, data.public_id, data.title)} />

                                    )
                                })}
                            </div> */}
                        </CloudinaryContext>
                        <div className="clearfix"></div>
                    </div>
                    <div className="youtube-section">
                        {youTubeVideos.map( (video, i) => 
                            <div className="youtube-video" key={i}>
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
                                      }}>
                                </Embed>
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


{/* <Card className="audio-card" color="orange" onClick={this.playSong.bind(this, data.public_id)}> */}
    {/* <Image 
        publicId={data.public_id+".png"} 
        resourceType="video" 
        height="100" 
        width="250" 
        flags="waveform"
        color="white"
        background="black"/> */}
    {/* <Card.Content> */}
        {/* <Card.Header className="audio-card">Song Title</Card.Header> */}
        {/* <Card.Description> */}

        {/* </Card.Description> */}
    {/* </Card.Content> */}
{/* </Card> */}

{/* <div className="desc">Created at {data.created_at}</div> */}