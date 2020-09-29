import React from 'react';
import { Icon, Form } from 'semantic-ui-react';

const AudioRec = (props) =>
    <div>
        <a onClick={props.playSong}>{props.publicID}</a>
        <Icon name="pencil" onClick={props.editTitle}/>
    </div>

export default AudioRec;
