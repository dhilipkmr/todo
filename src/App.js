import React, { Component } from 'react';

import './App.css';

import Login from './Login/Login';
import Note from './Note/Note';
import NoteForm from './NoteForm/NoteForm';

import {FIREBASE_CONFIG} from './Config/config';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';


class App extends Component {
  constructor(props) {
    super(props);
    this.addNewTask = this.addNewTask.bind(this);
    this.removeTask = this.removeTask.bind(this);
    this.addTaskListener = this.addTaskListener.bind(this);
    this.removeTaskListener = this.removeTaskListener.bind(this);
    this.authListener = this.authListener.bind(this);
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
    this.removeTaskListener();
  }

  authListener() {
    this.app.auth().onAuthStateChanged((user)=>{
      if (user) {
        console.log(user);
        this.setState({user});
      } else {
        this.setState({user: null});
      }
    });
  }

  addTaskListener() {
    const {taskList} = this.state;
    this.database.on('child_added', snap => {
      taskList.push({
        id : snap.key,
        task : snap.val().task
      });
      this.setState({taskList});
    });
  }

  removeTaskListener() {
    const {taskList} = this.state;
    this.database.on('child_removed', snap => {
      taskList.forEach((taskEntry, index) => {
        if (taskEntry.id === snap.key) {
          taskList.splice(index, 1);
        }
      });
      this.setState({taskList});
    });
  }

  addNewTask(content) {
    this.database.push().set({task: content});
  }

  removeTask(id) {
    this.database.child(id).remove();
  }

  render() {
    const {taskList, user} = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Todo List</h1>
          {user ? <div className="App-title" onClick={() => {this.app.auth().signOut()}}>Sign out</div> : null}
        </header>
        {
          user ?
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
