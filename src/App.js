import React, { Component } from 'react';
import './App.css';
import Note from './Note/Note';
import NoteForm from './NoteForm/NoteForm';
import {FIREBASE_CONFIG} from './Config/config';
import firebase from 'firebase/app';
import 'firebase/database';

class App extends Component {
  constructor(props) {
    super(props);
    this.addNewTask = this.addNewTask.bind(this);
    this.removeTask = this.removeTask.bind(this);
    this.app = firebase.initializeApp(FIREBASE_CONFIG);
    this.database = this.app.database().ref().child('TodoList');
    this.state = {
      taskList: []
    }
  }
  componentWillMount() {
    const {taskList} = this.state;
    this.database.on('child_added', snap => {
      taskList.push({
        id : snap.key,
        task : snap.val().task
      });
      this.setState({taskList});
    });

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
    const {taskList} = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Todo List</h1>
        </header>
        <Note taskList={taskList} removeTask={this.removeTask}/>
        <NoteForm addNewTask={this.addNewTask}/>
      </div>
    );
  }
}

export default App;
