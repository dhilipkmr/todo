import React, {Component} from 'react';
import './NoteForm.css';
import PropTypes from 'prop-types';

export default class Note extends Component {
  constructor(props) {
    super(props);
    this.newContentHandler= this.newContentHandler.bind(this);
    this.addNewTask = this.addNewTask.bind(this);
    this.state = {
      newNote: ''
    };
  }

  newContentHandler(content) {
    this.setState({newNote: content});
  }

  addNewTask() {
    if (this.state.newNote) {
      this.props.addNewTask(this.state.newNote);
      this.setState({newNote: ''});
    }
  }

  render() {
    const {newNote} = this.state;
    const {addNewTask} = this.props;
    return (
      <div className="footer">
        <div className="taskInput">
          <input placeholder = 'Add a New Task...' value={newNote} onChange={(e) => this.newContentHandler(e.target.value)}></input>
          <span className="addtaskBtn" onClick={this.addNewTask}>Add</span>
        </div>
      </div>
    );
  }
}