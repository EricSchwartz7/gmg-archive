import React, { Component } from 'react'
import { Button, Modal, Input, Form } from 'semantic-ui-react'

class AddMediaDialog extends Component {
    state = { 
        open: false,
        video: {
            title: "",
            url: ""
        }
    }

    handleSubmit = () => {
        this.props.handleSubmit(this.state.video);
        this.close();
        // var x = arguments;
    }

    show() {
        this.setState({open: true})
    }

    close() {
        this.setState({open: false})
    }

    handleChange(field, value) {
        let videoData = this.state.video;
        videoData[field] = value;
        this.setState({
            video: videoData
        });
    }

    render() {

        const { open, closeOnEscape, closeOnDimmerClick } = this.state
        return (
            <span>
                <Button 
                    onClick={this.show.bind(this)} 
                >Add a photo or video</Button>
                <Modal 
                    open={this.state.open} 
                >
                    <Modal.Header>Add a title and URL</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Field>
                                {/* <Label>Title</Label> */}
                                <Input placeholder="Title" onChange={(event) => this.handleChange("title", event.target.value)}/>
                            </Form.Field>
                            <Form.Field>
                                {/* <Label>URL</Label> */}
                                <Input placeholder="ex. youtube.com/video" onChange={(event) => this.handleChange("url", event.target.value)}/>
                            </Form.Field>
                            <Button color="green" onClick={this.handleSubmit.bind(this)}>Submit</Button>
                            <Button onClick={this.close.bind(this)}>Cancel</Button>
                        </Form>
                    </Modal.Content>
                </Modal>
            </span>
        )
    }
}

export default AddMediaDialog

