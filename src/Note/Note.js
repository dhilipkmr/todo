import React, {Component} from 'react';
import './Note.css';
import PropTypes from 'prop-types';

export default class Note extends Component {
  constructor(props) {
      super(props);
  }
  render() {
    const {taskList, removeTask} = this.props;
    return (
      <div className="tasksList">
        <div className="tasksHeader">
          <div>Tasks Pending - <span>{taskList.length}</span></div>
        </div>
        <div>
        <div>
          {taskList.map((taskEntry) => {
              return (
                <li className="task">
                  <div className="content">{taskEntry.task}</div>
                  <button onClick={removeTask.bind(this, taskEntry.id)}>Dismiss</button>
                </li>
              );
            })}  
        </div>
        </div>
      </div>
    );
  }
}