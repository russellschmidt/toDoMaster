import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  AsyncStorage
} from 'react-native';

module.exports = React.createClass({
  getInitialState() {
    return ({
      tasks: [],
      task: '',
      completedTasks:[]
    })
  },

  componentWillMount() {
    AsyncStorage.getItem('tasks')
      .then((response) => {
        this.setState({tasks: JSON.parse(response)})
      })
      .catch((error) => {
        console.log(error.message)
      })

    AsyncStorage.getItem('completedTasks')
      .then((response) => {
        this.setState({completedTasks: JSON.parse(response)})
      })
      .catch((error) => {
        console.log(error.message)
      })
  },

  componentDidUpdate() {
    this.setStorage();
  },

  setStorage() {
    AsyncStorage.setItem('tasks', JSON.stringify(this.state.tasks));
    AsyncStorage.setItem('completedTasks', JSON.stringify(this.state.completedTasks));
  },

  renderList(tasks) {
    // return views or rows based on teh argued tasks
    return (
      tasks.map( (task, index) => {
        return (
          <View key={index} style={styles.task}>
            <Text>{task}</Text>

            <TouchableOpacity
              onPress={() => this.completeTask(task, index)}
            >
              <Text>&#10003;</Text>
            </TouchableOpacity>
          </View>
        )
      })
    )
  },

  renderCompleted(tasks) {
    return (
      tasks.map((task, index) => {
        return (
          <View key={index} style={styles.task}>
            <Text style={styles.completed}>
              {task}
            </Text>
            <TouchableOpacity
              onPress={ () => this.deleteTask(index)}
            >
              <Text>
                &#10005;
              </Text>
            </TouchableOpacity>
          </View>
        )
      })
    )
  },

  deleteTask(index) {
    let completedTasks = this.state.completedTasks;
    completedTasks = completedTasks.slice(0, index).concat(completedTasks.slice(index+1));
    this.setState({completedTasks});
  },

  completeTask(task, index) {
    let tasks = this.state.tasks;
    tasks = tasks.slice(0, index).concat(tasks.slice(index + 1));

    let completedTasks = this.state.completedTasks;
    completedTasks = completedTasks.concat(this.state.tasks[index]);

    this.setState({
      tasks,
      completedTasks
    });
  },

  addTask() {
    if (this.state.task) {
      let tasks = this.state.tasks.concat([this.state.task]);
      this.setState({
        tasks,
        task: ''
      });
    }
  },

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          To Do Master
        </Text>
        <TextInput
          ref='ToDoMaster'

          style={styles.input}

          placeholder='Add a task...'

          onChangeText={(text) => {
            this.setState( {task: text} );
          }}

          onEndEditing={() => {
            this.addTask();
            this.refs.ToDoMaster.setNativeProps({text: ''});
            }
          }
        />
        <ScrollView>
          {this.renderList(this.state.tasks)}
          {this.renderCompleted(this.state.completedTasks)}
        </ScrollView>
      </View>
    )
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    margin: 30,
    marginTop: 40,
    textAlign: 'center',
    fontSize: 18
  },
  task: {
    flexDirection: 'row',
    height: 60,
    borderBottomWidth: 1,
    borderColor: '#eeddee',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20
  },
  input: {
    height: 60,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'black',
    textAlign: 'center',
    margin: 10
  },
  completed: {
    color: '#555',
    textDecorationLine: 'line-through',

  }

})
