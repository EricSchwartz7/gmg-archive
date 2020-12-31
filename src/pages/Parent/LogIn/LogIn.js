import React, { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react'
import { Link } from 'react-router-dom';

import './LogIn.scss';

class LogIn extends Component {
    state = {
        success: false,
        email: "",
        password: ""
    }

    handleChange (event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleLogIn() {
        debugger;
    }

    render() {    
        return (
            <section className="LogIn">
                <Form success={this.state.success}>
                    <Form.Field>
                        <Input
                            name='email'
                            label='Email'
                            type='email'
                            placeholder='joe@schmoe.com' 
                            onChange={this.handleChange.bind(this)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Input
                            name='password'
                            label='Password'
                            type='password'
                            onChange={this.handleChange.bind(this)}
                        />
                    </Form.Field>
                    <Message
                        success
                        header='Form Completed'
                        content="You're all signed up for the newsletter"
                    />
                    <Button onClick={this.handleLogIn.bind(this)}>Log In</Button>
                    <br/>
                    <Link to={"/signup"}>Sign Up</Link>
                </Form>

            </section>
        );
    }
}

export default LogIn;