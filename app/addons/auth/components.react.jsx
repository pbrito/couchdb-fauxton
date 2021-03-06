// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy of
// the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations under
// the License.

import app from "../../app";
import FauxtonAPI from "../../core/api";
import React from "react";
import ReactDOM from "react-dom";
import AuthStores from "./stores";
import AuthActions from "./actions";
import { Modal } from 'react-bootstrap';
import Components from '../components/react-components.react';

var changePasswordStore = AuthStores.changePasswordStore;
var createAdminStore = AuthStores.createAdminStore;
var createAdminSidebarStore = AuthStores.createAdminSidebarStore;
const {ConfirmButton} = Components;


var LoginForm = React.createClass({
  propTypes: {
    urlBack: React.PropTypes.string.isRequired
  },

  getInitialState: function () {
    return {
      username: '',
      password: ''
    };
  },

  getDefaultProps: function () {
    return {
      urlBack: '',

      // for testing purposes only
      testBlankUsername: null,
      testBlankPassword: null
    };
  },

  onInputChange: function (e) {
    var change = (e.target.name === 'name') ? { username: e.target.value } : { password: e.target.value };
    this.setState(change);
  },

  submit: function (e) {
    e.preventDefault();

    if (!this.checkUnrecognizedAutoFill()) {
      this.login(this.state.username, this.state.password);
    }
  },

  // Safari has a bug where autofill doesn't trigger a change event. This checks for the condition where the state
  // and form fields have a mismatch. See: https://issues.apache.org/jira/browse/COUCHDB-2829
  checkUnrecognizedAutoFill: function () {
    if (this.state.username !== '' || this.state.password !== '') {
      return false;
    }
    var username = (this.props.testBlankUsername) ? this.props.testBlankUsername : ReactDOM.findDOMNode(this.refs.username).value;
    var password = (this.props.testBlankPassword) ? this.props.testBlankPassword : ReactDOM.findDOMNode(this.refs.password).value;
    this.setState({ username: username, password: password }); // doesn't set immediately, hence separate login() call
    this.login(username, password);

    return true;
  },

  login: function (username, password) {
    AuthActions.login(username, password, this.props.urlBack);
  },

  componentDidMount: function () {
    ReactDOM.findDOMNode(this.refs.username).focus();
  },

  render: function () {
    return (
      <div className="couch-login-wrapper">
        <div className="row-fluid">
          <div className="span12">
            <form id="login" onSubmit={this.submit}>
              <p className="help-block">
                Enter your username and password.
              </p>
              <input id="username" type="text" name="name" ref="username" placeholder="Username" size="24"
                onChange={this.onInputChange} value={this.state.username} />
              <br/>
              <input id="password" type="password" name="password" ref="password" placeholder="Password" size="24"
                onChange={this.onInputChange} value={this.state.password} />
              <br/>
              <button id="submit" className="btn btn-primary" type="submit">Log In</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
});


var ChangePasswordForm = React.createClass({
  getInitialState: function () {
    return this.getStoreState();
  },

  getStoreState: function () {
    return {
      password: changePasswordStore.getChangePassword(),
      passwordConfirm: changePasswordStore.getChangePasswordConfirm()
    };
  },

  onChange: function () {
    this.setState(this.getStoreState());
  },

  onChangePassword: function (e) {
    AuthActions.updateChangePasswordField(e.target.value);
  },

  onChangePasswordConfirm: function (e) {
    AuthActions.updateChangePasswordConfirmField(e.target.value);
  },

  componentDidMount: function () {
    ReactDOM.findDOMNode(this.refs.password).focus();
    changePasswordStore.on('change', this.onChange, this);
  },

  componentWillUnmount: function () {
    changePasswordStore.off('change', this.onChange);
  },

  changePassword: function (e) {
    e.preventDefault();
    AuthActions.changePassword(this.state.password, this.state.passwordConfirm);
  },

  render: function () {
    return (
      <div className="auth-page">
        <form id="change-password" onSubmit={this.changePassword}>
          <p>
            Enter and confirm a new password.
          </p>

          <input id="password" type="password" ref="password" name="password" placeholder="Password"
            size="24" onChange={this.onChangePassword} value={this.state.password} />
          <br />
          <input id="password-confirm" type="password" name="password_confirm" placeholder= "Password Confirmation"
            size="24" onChange={this.onChangePasswordConfirm} value={this.state.passwordConfirm} />

          <br />
          <p>
            <button type="submit" className="btn btn-primary"><i className="icon icon-ok-circle" /> Change Password</button>
          </p>
        </form>
      </div>
    );
  }
});


var CreateAdminForm = React.createClass({
  propTypes: {
    loginAfter: React.PropTypes.bool.isRequired
  },

  getInitialState: function () {
    return this.getStoreState();
  },

  getStoreState: function () {
    return {
      username: createAdminStore.getUsername(),
      password: createAdminStore.getPassword()
    };
  },

  onChange: function () {
    this.setState(this.getStoreState());
  },

  getDefaultProps: function () {
    return {
      loginAfter: ''
    };
  },

  onChangeUsername: function (e) {
    AuthActions.updateCreateAdminUsername(e.target.value);
  },

  onChangePassword: function (e) {
    AuthActions.updateCreateAdminPassword(e.target.value);
  },

  componentDidMount: function () {
    ReactDOM.findDOMNode(this.refs.username).focus();
    createAdminStore.on('change', this.onChange, this);
  },

  componentWillUnmount: function () {
    createAdminStore.off('change', this.onChange);
  },

  createAdmin: function (e) {
    e.preventDefault();
    AuthActions.createAdmin(this.state.username, this.state.password, this.props.loginAfter);
  },

  render: function () {
    return (
      <div className="auth-page">
        <p>
          Before a server admin is configured, all client connections have admin privileges. <strong>If HTTP access is open to non-trusted users, create an admin account to prevent data
          loss.</strong>
        </p>
        <p>
          Connections with Admin privileges can create and destroy databases, install and update _design documents, run
          the test suite, and modify the CouchDB configuration.
        </p>
        <p>
          Connections without Admin privileges have read and write access to all databases controlled by validation functions. CouchDB can be configured to block anonymous connections.
        </p>
        <form id="create-admin-form" onSubmit={this.createAdmin}>
          <input id="username" type="text" ref="username" name="name" placeholder="Username" size="24"
            onChange={this.onChangeUsername} />
          <br/>
          <input id="password" type="password" name="password" placeholder= "Password" size="24"
            onChange={this.onChangePassword} />
          <p>
          <button type="submit" id="create-admin" className="btn btn-primary"><i className="icon icon-ok-circle" /> Grant Admin Privileges</button>
          </p>
        </form>
      </div>
    );
  }
});


var CreateAdminSidebar = React.createClass({
  getInitialState: function () {
    return this.getStoreState();
  },

  getStoreState: function () {
    return {
      selectedPage: createAdminSidebarStore.getSelectedPage()
    };
  },

  onChange: function () {
    this.setState(this.getStoreState());
  },

  componentDidMount: function () {
    createAdminSidebarStore.on('change', this.onChange, this);
  },

  componentWillUnmount: function () {
    createAdminSidebarStore.off('change', this.onChange);
  },

  selectPage: function (e) {
    var newPage = e.target.href.split('#')[1];
    AuthActions.selectPage(newPage);
  },

  render: function () {
    var user = FauxtonAPI.session.user();
    var userName = _.isNull(user) ? '' : FauxtonAPI.session.user().name;

    return (
      <div className="sidenav">
        <header className="row-fluid">
          <h3>{userName}</h3>
        </header>
        <ul className="nav nav-list" onClick={this.selectPage}>
          <li className={this.state.selectedPage === 'changePassword' ? 'active' : ''} data-page="changePassword">
            <a href="#changePassword">Change Password</a>
          </li>
          <li className={this.state.selectedPage === 'addAdmin' ? 'active' : ''} data-page="addAdmin">
            <a href="#addAdmin">Create Admins</a>
          </li>
        </ul>
      </div>
    );
  }
});


class PasswordModal extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      password: ''
    };
    this.authenticate = this.authenticate.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  // clicking <Enter> should submit the form
  onKeyPress (e) {
    if (e.key === 'Enter') {
      this.authenticate();
    }
  }

  // default authentication function. This can be overridden via props if you want to do something different
  authenticate () {
    const username = app.session.get('userCtx').name; // yuck. But simplest for now until logging in publishes the user data
    this.props.onSubmit(username, this.state.password, this.props.onSuccess);
  }

  render () {
    const {visible, onClose, submitBtnLabel, headerTitle, modalMessage} = this.props;
    if (!this.props.visible) {
      return null;
    }

    return (
      <Modal dialogClassName="enter-password-modal" show={visible} onHide={() => onClose()}>
        <Modal.Header closeButton={true}>
          <Modal.Title>{headerTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalMessage}
          <input
            style={{width: "385px"}}
            type="password"
            className="password-modal-input"
            placeholder="Enter your password"
            autoFocus={true}
            value={this.state.password}
            onChange={(e) => this.setState({ password: e.target.value })}
            onKeyPress={this.onKeyPress}
            />
        </Modal.Body>
        <Modal.Footer>
          <a className="cancel-link" onClick={() => onClose()}>Cancel</a>
          <ConfirmButton
            text={submitBtnLabel}
            onClick={this.authenticate}
          />
        </Modal.Footer>
      </Modal>
    );
  }
}
PasswordModal.propTypes = {
  visible: React.PropTypes.bool.isRequired,
  modalMessage: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
  onSubmit: React.PropTypes.func.isRequired,
  onClose: React.PropTypes.func.isRequired,
  submitBtnLabel: React.PropTypes.string
};
PasswordModal.defaultProps = {
  headerTitle: "Enter Password",
  visible: false,
  modalMessage: '',
  onClose: AuthActions.hidePasswordModal,
  onSubmit: AuthActions.authenticate,
  onSuccess: () => {},
  submitBtnLabel: 'Continue'
};


export default {
  LoginForm,
  ChangePasswordForm,
  CreateAdminForm,
  CreateAdminSidebar,
  PasswordModal
};
