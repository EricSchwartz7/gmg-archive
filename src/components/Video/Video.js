import React from 'react';
import { Button, Divider } from 'semantic-ui-react';
import {Video, Transformation} from 'cloudinary-react';
import moment from 'moment';
import "./Video.scss";

const VideoClip = (props) =>
    <div className="video-container" key={props.publicID}>
            <Video 
                className="video" 
                cloud_name="gmg-archive-project" 
                format="mp4"
                controls
                publicId={props.publicID}>
                <Transformation
                    background="black"
                    crop="pad"
                    width="300"
                    height="200"
                    // preload="none"
                    // dpr="auto"
                    // responsive_placeholder="blank"
                />
            </Video>
        <Button className="overlay button"
            icon="delete"
            onClick={props.deleteMediaItem}
        ></Button>
        <div className="overlay info">Uploaded {moment(props.createdAt).format('MM/DD/YY, h:mm a')}</div>
    </div>

export default VideoClip;
