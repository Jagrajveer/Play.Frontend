import React, { Component } from 'react';
import { Col, Container, Row, Table, Button } from 'react-bootstrap';
import AddUserModel from './form/AddUserModel';

export class User extends Component
{
    static displayName = User.name;

    constructor(props)
    {
        super(props);
        this.state = { users: [], loading: true, loadedSuccess: false };
    }

    componentDidMount()
    {
        this.populateUsers();
    }

    async populateUsers()
    {
        fetch(`${window.User_Service_API_URL}`)
            .then(response => {
                return response.json();
            })
            .then(returnedUsers => this.setState({ users: returnedUsers, loading: false, loadedSuccess: true }))
            .catch(err =>
            {
                console.log(err);
                this.setState({ users: [], loading: false, loadedSuccess: false })
            });
    }

    addUserToState = user =>
    {
        this.setState(previous => ({
            users: [...previous.users, user]
        }));
    }
    updateState = (id) =>
    {
        this.populateUsers();
    }
    deleteUserFromState = id =>
    {
        const updated = this.state.users.filter(user => user.id !== id);
        this.setState({users: updated })
    }
    async deleteUser(id)
    {
        let confirmDeletion = window.confirm('Do you really wish to delete it?');
        if (confirmDeletion)
        {
            fetch(`${window.User_Service_API_URL}/${id}`, {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res =>
                {
                    this.deleteUserFromState(id);
                })
                .catch(err =>
                {
                    console.log(err);
                    window.alert("Could not delete the user.");
                });
        }
    }

    renderUsersTable(users)
    {
        return <Container style={{ paddingTop: "10px", paddingLeft: "0px" }}>
            <Row>
                <Col>
                    <Table striped bordered hover >
                        <thead className="thead-dark">
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>UserName</th>
                            <th>Email</th>
                            <th style={{ textAlign: "center" }}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {!users || users.length <= 0 ?
                            <tr>
                                <td colSpan="6" align="center"><b>No Users yet</b></td>
                            </tr>
                            : users.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        {user.firstName}
                                    </td>
                                    <td>
                                        {user.lastName}
                                    </td>
                                    <td>
                                        {user.userName}
                                    </td>
                                    <td>
                                        {user.email}
                                    </td>
                                    <td align="center">
                                        <div>
                                            <AddUserModel
                                                isNew={false}
                                                user={user}
                                                updateUserIntoState={this.updateState} />
                                            &nbsp;&nbsp;&nbsp;
                                            <Button variant="danger" onClick={() => this.deleteUser(user.id)}>Delete</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col>
                    <AddUserModel isNew={true} addUserToState={this.addUserToState} />
                </Col>
            </Row>
        </Container>;
    }

    render()
    {
        let users = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.state.loadedSuccess
                ? this.renderUsersTable(this.state.users)
                : <p>Could not load users</p>;

        return (
            <div>
                <h1 id="tabelLabel" >Users</h1>
                {users}
            </div>
        );
    }
}
