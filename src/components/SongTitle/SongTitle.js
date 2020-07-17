import React from 'react';
import { Button } from 'semantic-ui-react';
import "./SongTitle.scss";

const SongTitle = function(props) {

    const addComma = props.vertical ? "" : ", ";

    return (
        <span className="SongTitle">{props.song.title}
            {props.last ? "" : addComma}
            &nbsp;
            {props.vertical ? 
                <Button 
                    icon
                    onClick={props.deleteSong.bind(this, props)}
                >X</Button> : ""}
        </span>
    )
}

export default SongTitle
