import React, {Component} from 'react';
import { Icon, Input } from 'semantic-ui-react';
import axios from 'axios';
import "./AudioRec.scss";

class AudioRec extends Component {
    state = {
        editMode: false,
        newTitle: ""
    };

    editTitle() {
        this.setState({
            editMode: true
        });
    }

    handleChange(value) {
        this.setState({
            newTitle: value
        });
    }

    handleBlur() {
        axios.put('/media_items/' + this.props.id, {title: this.state.newTitle})
        this.setState({
            editMode: false
        })
    }

    render() {
        let audioRec;
        let title = this.state.newTitle || this.props.title;

        if (this.state.editMode) {
            audioRec = 
                <Input 
                    value={title}
                    onChange={(event) => this.handleChange(event.target.value)} 
                    onBlur={this.handleBlur.bind(this)}/>
        } else {
            audioRec = 
                <div className="AudioRec">
                    <a onClick={this.props.playSong}>{title} </a>
                    <Icon name="pencil" onClick={this.editTitle.bind(this)}/>
                </div>;
        }
        return audioRec;
    }
}

export default AudioRec;
