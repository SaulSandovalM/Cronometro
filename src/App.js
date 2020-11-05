import React, { Component } from 'react'
import './App.css'
import Stopwatch from './stopwatch/components/stopwatch/Stopwatch'

export default class App extends Component {
  render () {
    return (
      <div className='App'>
        <Stopwatch />
      </div>
    )
  }
}
