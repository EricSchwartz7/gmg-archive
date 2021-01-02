import React from 'react';
import { Button, Divider } from 'semantic-ui-react';
import {Image, Transformation} from 'cloudinary-react';
import moment from 'moment';
import "./Photo.scss";

const Photo = (props) =>
    <div className="photo-container" key={props.publicID}>
        <a target="_blank" href={`https://res.cloudinary.com/gmg-archive-project/image/upload/${props.publicID}.jpg`}>
            <Image className="image" publicId={props.publicID}>
                <Transformation
                    crop="scale"
                    // width="300"
                    height="250"
                    dpr="auto"
                    responsive_placeholder="blank"
                />
            </Image>
        </a>
        {localStorage.getItem('auth_token') ? 
            <Button className="overlay button"
                icon="delete"
                onClick={props.deleteMediaItem}
            ></Button> : ""}
        <div className="overlay info">Uploaded {moment(props.createdAt).format('MM/DD/YY, h:mm a')}</div>
    </div>

export default Photo;
