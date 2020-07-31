import React from 'react';
import { Button } from 'semantic-ui-react';
import "./SongTitle.scss";

const SongTitle = function(props) {

    const addComma = props.vertical ? "" : ", ";

    return (
        <span className="SongTitle">
            {props.vertical ? 
                <Button 
                    icon="delete"
                    // circular
                    onClick={props.deleteSong.bind(this, props)}
                ></Button> : ""}
            &nbsp;
            {props.song.title}
            {props.last ? "" : addComma}

        </span>
    )
}

export default SongTitle
