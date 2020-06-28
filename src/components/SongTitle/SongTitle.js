import React from 'react'
import { Button } from 'semantic-ui-react'

const SongTitle = function(props) {

    const addComma = props.vertical ? "" : ", ";

    return (
        <span>{props.song.title}
            {props.last ? "" : addComma}
            {props.vertical ? <Button onClick={props.deleteSong.bind(this, props)}>X</Button> : ""}
        </span>
    )
}

export default SongTitle
