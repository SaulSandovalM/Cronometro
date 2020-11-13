import React, { Component } from 'react'
import './Stopwatch.css'
import Timer from '../timer/Timer'
import Controls from '../controls/Controls'
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
    var inicio = new Date()
    var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    var f = new Date()
    inicio = f.getDate() + ' de ' + meses[f.getMonth()] + ' del ' + f.getFullYear() + ' con ' + f.getHours() + ':' + f.getMinutes() + ':' + f.getSeconds()
    this.state.inicio = inicio
  }

  stop () {
    this.setState({
      isRunning: false
    }, () => {
      clearInterval(this.timerRef)
    })
    var final = new Date()
    var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    var f = new Date()
    final = f.getDate() + ' de ' + meses[f.getMonth()] + ' del ' + f.getFullYear() + ' con ' + f.getHours() + ':' + f.getMinutes() + ':' + f.getSeconds()
    this.state.final = final
    const params = {
      nombre: this.inputNombre.value,
      agencia: this.inputAgencia.value,
      inicio: this.state.inicio,
      final: this.state.final,
      tiempo: this.state.time
    }
    if (params.inicio && params.final) {
      firebase.database().ref('marcas').push(params).then(() => {
        alert('Tu tiempo fue guardado')
      }).catch(() => {
        alert('Tu solicitud no puede ser enviada')
      })
      this.setState(getDefaultState())
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

  handleChange (event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  render () {
    const { isRunning, time } = this.state

    return (
      <div className='Stopwatch'>
        <h1> Cronometro </h1>
        <Timer time={time} />
        <input
          id='nombre'
          required
          name='nombre'
          onChange={this.handleChange.bind(this)}
          value={this.state.nombre}
          ref={nombre => this.inputNombre = nombre}
          placeholder='Ingresa tu nombre por favor'
        />
        <select
          id='agencia'
          required
          name='agencia'
          value={this.state.agencia}
          onChange={this.handleChange.bind(this)}
          ref={agencia => this.inputAgencia = agencia}
        >
          <option id='agencia'>CAT1</option>
          <option id='agencia'>CAT2</option>
          <option id='agencia'>CAT3</option>
          <option id='agencia'>CAT4</option>
          <option id='agencia'>CAT5</option>
          <option id='agencia'>CAT6</option>
          <option id='agencia'>CAT7</option>
          <option id='agencia'>CAT8</option>
        </select>
        {this.state.agencia && this.state.nombre ?
          <Controls
            isRunning={isRunning}
            start={() => this.start()}
            stop={() => this.stop()}
            reset={() => this.reset()}
            addLapTime={() => this.addLapTime()}
          /> : null
        }
      </div>
    )
  }
}
