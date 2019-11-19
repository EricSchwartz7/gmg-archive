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
        return (
            <span>
                <Button onClick={this.show.bind(this)}>Add a video from YouTube</Button>
                <Modal open={this.state.open}>
                    <Modal.Header>Add a title and URL</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Field>
                                <Input 
                                    placeholder="Title" 
                                    onChange={(event) => this.handleChange("title", event.target.value)}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Input 
                                    placeholder="ex. https://www.youtube.com/watch?v=xW30CHsezKU" 
                                    onChange={(event) => this.handleChange("url", event.target.value)}
                                />
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

