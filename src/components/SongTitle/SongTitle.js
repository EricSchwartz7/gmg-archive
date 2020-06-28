import React from 'react'
import { Button } from 'semantic-ui-react'

const SongTitle = function(props) {

    const breakOrComma = props.vertical ? <br/> : ", ";

    return (
        <span>{props.song.title}
            {props.last ? "" : breakOrComma}{props.button ? <Button onClick={props.deleteSong.bind(this, props)}>X</Button> : ""}
        </span>
    )
}

export default SongTitle
