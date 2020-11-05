import React, { Component } from 'react'
import './Stopwatch.css'
import Timer from '../timer/Timer'
import Controls from '../controls/Controls'
import LapTimeList from '../laptimelist/LapTimeList'
import Config from '../../constants/Config'
import firebase from '../../../Firebase'

function getDefaultState () {
  return {
    isRunning: false,
    time: 0,
    timeList: []
  }
}

export default class Stopwatch extends Component {
  constructor (props) {
    super(props)
    this.state = getDefaultState()
    this.timerRef = null
  }

  updateTimer (extraTime) {
    const { time } = this.state
    this.setState({ time: time + extraTime })
  }

  start () {
    this.setState({
      isRunning: true
    }, () => {
      this.timerRef = setInterval(
        () => { this.updateTimer(Config.updateInterval) }, Config.updateInterval
      )
    })
  }

  stop () {
    this.setState({
      isRunning: false
    }, () => {
      clearInterval(this.timerRef)
    })
    const params = {
      marca: this.state.timeList
    }
    if (params.marca) {
      firebase.database().ref('marcas').push(params).then(() => {
        alert('Tu solicitud fue enviada.')
      }).catch(() => {
        alert('Tu solicitud no puede ser enviada')
      })
    } else {
      alert('Por favor llene el formulario')
    }
  }

  reset () {
    this.setState(getDefaultState())
  }

  addLapTime () {
    const { time, timeList } = this.state
    this.setState({
      timeList: [...timeList, time]
    })
  }

  render () {
    const { isRunning, time, timeList } = this.state

    return (
      <div className='Stopwatch'>
        <h1> Cronometro </h1>
        <Timer time={time} />
        <Controls
          isRunning={isRunning}
          start={() => this.start()}
          stop={() => this.stop()}
          reset={() => this.reset()}
          addLapTime={() => this.addLapTime()}
        />
        <LapTimeList timeList={timeList} />
      </div>
    )
  }
}
