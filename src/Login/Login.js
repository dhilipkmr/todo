import React, {Component} from 'react';
import './Login.css';
import PropTypes from 'prop-types';

const EMAIL = 'email';
const PASSWORD = 'password';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.handleOnchange = this.handleOnchange.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signUp = this.signUp.bind(this);
    this.state = {
      email: '',
      password: ''
    }
  }

  handleOnchange(field, val) {
    if (field === EMAIL) {
      this.setState({email: val});
    } else if (field === PASSWORD) {
      this.setState({password: val});
    }
  }

  signUp() {
    const {email, password} = this.state;
    this.props.app.auth().createUserWithEmailAndPassword(email, password).then(()=> {

    })
    .catch((err) => {
      alert('Error Signing Up');
    })
  }

  signIn() {
    const {email, password} = this.state;
    this.props.app.auth().signInWithEmailAndPassword(email, password).then(()=>{

    })
    .catch((err) => {
      alert('Oops! User Does Not Exist!');
    });
  }

  render() {
    const {email, password} = this.state;
    return (
      <div className="loginContainer">
        <div className="email">
          <input placeholder="EMAIL ID" type="text" value={email} onChange={(e) => {this.handleOnchange(EMAIL, e.target.value)}}/>
        </div>
        <div className="password">
        <input placeholder="PASSWORD" type="password" value={password} onChange={(e) => {this.handleOnchange(PASSWORD, e.target.value)}}/>
        </div>
        <div className="buttonFooter">
          {/* <button className="signUp" onClick={this.signUp}>Sign Up</button> */}
          <button className="login" onClick={this.signIn}>Login</button>
        </div>
      </div>
    );
  }
}