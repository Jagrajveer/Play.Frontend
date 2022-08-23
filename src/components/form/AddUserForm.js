import React from 'react';
import { Button, Form, Alert } from 'react-bootstrap';

export default class AddUserForm extends React.Component
{
    state = {
        id: 0,
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        alertVisible: false,
        validated: false
    }

    componentDidMount()
    {
        if (this.props.user)
        {
            const { id, firstName, lastName, userName, email } = this.props.user;
            this.setState({ id, firstName, lastName, userName, email });
        }
    }
    onChange = e =>
    {
        this.setState({ [e.target.name]: e.target.value })
    }

    submitNew = (e) =>
    {
        e.preventDefault();

        const form = e.currentTarget;
        if (form.checkValidity() === false)
        {
            e.stopPropagation();
        }
        else
        {
            this.createUser();
        }

        this.setState({ validated: true });
    }

    async createUser()
    {
        fetch(`${window.User_Service_API_URL}`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                userName: this.state.userName,
                email: this.state.email
            })
        })
            .then(async response =>
            {
                if (!response.ok)
                {
                    const errorData = await response.json();
                    console.error(errorData);
                    throw new Error(`Could not add the user: ${errorData.title}`);
                }

                return response.json();
            })
            .then(user =>
            {
                this.props.addUserToState(user);
                this.props.toggle();
            })
            .catch(err =>
            {
                this.showAlert(err.message);
            });
    }

    submitEdit = e =>
    {
        e.preventDefault();

        const form = e.currentTarget;
        if (form.checkValidity() === false)
        {
            e.stopPropagation();
        }
        else
        {
            this.updateUser();
        }

        this.setState({ validated: true });
    }

    async updateUser()
    {
        fetch(`${window.User_Service_API_URL}/${this.state.id}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                userName: this.state.userName,
                email: this.state.email
            })
        })
            .then(async response =>
            {
                if (!response.ok)
                {
                    const errorData = await response.json();
                    console.error(errorData);
                    throw new Error(`Could not update the user: ${errorData.title}`);
                }

                this.props.toggle();
                this.props.updateUserIntoState(this.state.id);
            })
            .catch(err =>
            {
                this.showAlert(err.message);
            });
    }

    showAlert = (message) =>
    {
        this.setState({
            alertMessage: message,
            alertColor: "danger",
            alertVisible: true
        });
    }

    render()
    {
        return <Form noValidate validated={this.state.validated} onSubmit={this.props.user ? this.submitEdit : this.submitNew}>
            <Form.Group>
                <Form.Label htmlFor="firstName">First Name:</Form.Label>
                <Form.Control type="text" name="firstName" onChange={this.onChange} value={this.state.firstName} required />
                <Form.Control.Feedback type="invalid">The First Name field is required</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Label htmlFor="lastName">Last Name:</Form.Label>
                <Form.Control type="text" name="lastName" onChange={this.onChange} value={this.state.lastName} />
                <Form.Control.Feedback type="invalid">The Last Name field is required</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Label htmlFor="userName">UserName:</Form.Label>
                <Form.Control type="text" name="userName" onChange={this.onChange} value={this.state.userName} required />
                <Form.Control.Feedback type="invalid">The UserName field is required</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Label htmlFor="email">Email:</Form.Label>
                <Form.Control type="text" name="email" onChange={this.onChange} value={this.state.email} required />
                <Form.Control.Feedback type="invalid">The Email field is required</Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit">Save</Button>

            <Alert style={{ marginTop: "10px" }} variant={this.state.alertColor} show={this.state.alertVisible}>
                {this.state.alertMessage}
            </Alert>
        </Form>;
    }
}