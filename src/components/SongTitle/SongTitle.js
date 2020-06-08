import React from 'react'
// import { Card, Label } from 'semantic-ui-react'

// import FormatHelper from "FormatHelper"
// import './ShowCard.scss'

const SongTitle = function(props) {

    return (
        <span>{props.title}
            {props.last ? "" : ", "}
        </span>
    )
}

export default SongTitle
