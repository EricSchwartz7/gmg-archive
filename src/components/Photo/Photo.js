import React from 'react';
import { Button, Divider } from 'semantic-ui-react';
import {Image, Transformation} from 'cloudinary-react';
import "./Photo.scss";

const Photo = (props) =>
    <div className="photo-container" key={props.publicID}>
        <a target="_blank" href={`https://res.cloudinary.com/gmg-archive-project/image/upload/${props.publicID}.jpg`}>
            <Image className="image" publicId={props.publicID}>
                <Transformation
                    crop="scale"
                    // width="300"
                    height="200"
                    dpr="auto"
                    responsive_placeholder="blank"
                />
            </Image>
        </a>
        <Button className="button-overlay"
            icon="delete"
            onClick={props.deleteMediaItem}
        ></Button>
        <div className="desc">Created at {props.createdAt}</div>
    </div>

export default Photo;
