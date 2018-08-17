import React, { Component } from 'react';

import './App.css';

import Login from './Login/Login';
import Note from './Note/Note';
import NoteForm from './NoteForm/NoteForm';

import {FIREBASE_CONFIG} from './Config/config';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase';


class App extends Component {
  constructor(props) {
    super(props);
    this.addNewTask = this.addNewTask.bind(this);
    this.removeTask = this.removeTask.bind(this);
    this.addTaskListener = this.addTaskListener.bind(this);
    this.authListener = this.authListener.bind(this);
    this.addTaskToState = this.addTaskToState.bind(this);
    this.signOut = this.signOut.bind(this);
    this.app = firebase.initializeApp(FIREBASE_CONFIG);
    this.database = this.app.database().ref().child('TodoList');
    this.state = {
      taskList: [],
      user: null
    }
  }
  componentWillMount() {
    this.authListener();
    this.addTaskListener();
  }

  authListener() {
    this.app.auth().onAuthStateChanged((user) => {
      if (user) {
        if (!localStorage.user) {
          localStorage.setItem('user', JSON.stringify(user));
          window.location.reload();
        }
        this.setState({user});
      } else {
        localStorage.removeItem('user');
        this.setState({user: null});
      }
      this.uid = this.app.auth().currentUser.uid;
    });
  }

  addTaskListener() {
    this.database.on('child_added', snap => {
      const entry = snap.val()[`${this.uid}`];
      if (entry) {
        const key = Object.keys(entry)[0];
        this.addTaskToState(key, entry[key].task);
        snap.ref.child(`${this.uid}`).on('child_added', addSnap => {
          this.addTaskToState(addSnap.key, addSnap.val().task, true);
        });
        snap.ref.child(`${this.uid}`).on('child_removed', removeSnap => {
          this.addTaskToState(removeSnap.key, removeSnap.val().task, false);
        });
      }
    });
  }

  addTaskToState(id, task, isAdded) {
    const {taskList} = this.state;
    if (isAdded) {
      taskList.push({id: id, task: task});
      this.setState({taskList});
    } else {
      taskList.forEach((taskEntry, index) => {
        if (taskEntry.id === id) {
          taskList.splice(index, 1);
        }
      });
      this.setState({taskList});
    }
  }

  addNewTask(content) {
    if (this.database.ref.child(`users/${this.uid}`)) {
      this.database.ref.child(`users/${this.uid}`).push({task: content});
    } else {
      this.database.ref.child(`users/${this.uid}`).set({task: content});
    }
  }

  signOut() {
    this.app.auth().signOut();
    localStorage.removeItem('user');
    window.location.reload();
  }

  removeTask(id) {
    this.database.ref.child(`users/${this.uid}/${id}`).remove();
  }

  render() {
    const {taskList, user} = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Todo List</h1>
          {user ? <div className="App-title signOut" onClick={this.signOut}>Sign out</div> : null}
        </header>
        {
          localStorage.user ?
          <div>
            <Note taskList={taskList} removeTask={this.removeTask}/>
            <NoteForm addNewTask={this.addNewTask}/>
          </div> : 
          <Login app={this.app}/>
        }
      </div>
    );
  }
}

export default App;
