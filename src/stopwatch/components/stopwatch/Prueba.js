import React, { Component } from 'react'
import firebase from '../../../Firebase'
import './Stopwatch.css'

export default class Cronometro extends Component {
  constructor (props) {
    super(props)
    this.state = {
      timerLigado: false,
      timerInicio: 0,
      timerTempo: 0,
      parcialCount: 0,
      parcialValue: [],
      inicio: '',
      final: ''
    }
  }

  handleClick = () => {
    this.setState({ parcialCount: this.state.parcialCount + 1 })
    this.setState({ parcialValue: this.state.parcialValue.concat(this.state.timerTempo) })
  }

  getParcial = () => {
    let parcial = []
    for (let i = 0; i < this.state.parcialCount; i++) {
      const valores = this.getTempo(this.state.parcialValue[i])
      let valoresDiferenca = this.getTempo(this.state.parcialValue[i])
      if (i !== 0) {
        valoresDiferenca = this.getTempo(this.state.parcialValue[i] - this.state.parcialValue[i - 1])
          parcial.push(
            <div>
              <ul>
                <li>
                  <span>{i + 1}</span>
                </li>
                <li>
                  +<span>{valoresDiferenca.horas}:</span>
                  <span>{valoresDiferenca.minutos}:</span>
                  <span>{valoresDiferenca.segundos}:</span>
                  <span>{valoresDiferenca.centesimos}</span>
                </li>
                <li >
                  <span>{valores.horas}:</span>
                  <span>{valores.minutos}:</span>
                  <span>{valores.segundos}:</span>
                  <span>{valores.centesimos}</span>
                </li>
              </ul>
            </div>
          )
        }
      }
    return parcial
  }

  getTempo = (tempoTotal) => {
    let centesimos = ('0' + (Math.floor(tempoTotal / 10) % 100)).slice(-2)
    let segundos = ('0' + (Math.floor(tempoTotal / 1000) % 60)).slice(-2)
    let minutos = ('0' + (Math.floor(tempoTotal / 60000) % 60)).slice(-2)
    let horas = ('0' + Math.floor(tempoTotal / 3600000)).slice(-2)
    this.state.horas = horas
    this.state.minutos = minutos
    this.state.segundos = segundos
    return ({ centesimos, segundos, minutos, horas })
  }

  iniciarTimer = () => {
    this.setState({
      timerLigado: true,
      timerInicio: Date.now() - this.state.timerTempo,
      timerTempo: this.state.timerTempo
    })
    this.timer = setInterval(() => {
      this.setState({
        timerTempo: Date.now() - this.state.timerInicio
      })
    }, 10)
    var inicio = new Date()
    var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    var f = new Date()
    inicio = f.getDate() + ' de ' + meses[f.getMonth()] + ' del ' + f.getFullYear() + ' con ' + f.getHours() + ':' + f.getMinutes() + ':' + f.getSeconds()
    this.state.inicio = inicio
  }

  pararTimer = () => {
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
      tiempo: this.state.horas + ':' + this.state.minutos + ':' + this.state.segundos
    }
    if (params.inicio && params.final) {
      firebase.database().ref('marcas').push(params).then(() => {
        alert('Tu tiempo fue guardado')
      }).catch(() => {
        alert('Tu solicitud no puede ser enviada')
      })
      this.setState({ timerLigado: false })
      clearInterval(this.timer)
      this.resetTimer()
    } else {
      alert('Por favor llene el formulario')
    }
  }

  handleChange (event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  resetTimer = () => {
    this.setState({
      timerInicio: 0,
      timerTempo: 0,
      parcialCount: 0,
      parcialValue: []
    })
  }

  render() {
    const { timerTempo } = this.state;
    let valores = this.getTempo(timerTempo)

    return (
      <div className='container'>
        <div className='Cronometro'>
          <div className='Cronometro-display'>
            <div className='spancon'>
              <span>{valores.horas}:</span>
              <span>{valores.minutos}:</span>
              <span>{valores.segundos}</span>
              <span className='centesimos'>{valores.centesimos}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', width: '100%', textAlign: 'left' }}>
                <div style={{ textAlign: 'left' }}>
                  Ingrese su nombre:
                </div>
              </div>
              <div>
                <input
                  style={{ width: '40%', marginBottom: '30px' }}
                  id='nombre'
                  required
                  name='nombre'
                  onChange={this.handleChange.bind(this)}
                  value={this.state.nombre}
                  ref={nombre => this.inputNombre = nombre}
                />
              </div>
              <div style={{ display: 'flex', width: '100%', textAlign: 'left' }}>
                <div style={{ textAlign: 'left' }}>
                  Seleccione su agencia:
                </div>
              </div>
              <div>
                <select
                  style={{ width: '100%' }}
                  id='agencia'
                  required
                  name='agencia'
                  value={this.state.agencia}
                  onChange={this.handleChange.bind(this)}
                  ref={agencia => this.inputAgencia = agencia}
                >
                  <option />
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Atotonilco el Grande, Atotonilco el Grande, UIM I'>Subprocuraduria de Procedimientos Penales Región Orinte, Atotonilco el Grande, Atotonilco el Grande, UIM I</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Atotonilco el Grande, Atotonilco el Grande, UIM II'>Subprocuraduria de Procedimientos Penales Región Orinte, Atotonilco el Grande, Atotonilco el Grande, UIM II</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Huejutla de Reyes, Huejutla de Reyes, UI I'>Subprocuraduria de Procedimientos Penales Región Orinte, Huejutla de Reyes, Huejutla de Reyes, UI I</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Huejutla de Reyes, Huejutla de Reyes, UI II'>Subprocuraduria de Procedimientos Penales Región Orinte, Huejutla de Reyes, Huejutla de Reyes, UI II</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Huejutla de Reyes, Huejutla de Reyes, UI III'>Subprocuraduria de Procedimientos Penales Región Orinte, Huejutla de Reyes, Huejutla de Reyes, UI III</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Huejutla de Reyes, Huejutla de Reyes, UI IV'>Subprocuraduria de Procedimientos Penales Región Orinte, Huejutla de Reyes, Huejutla de Reyes, UI IV</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Huejutla de Reyes, Huejutla de Reyes, Centro de Atención Temprana 1er. Turno'>Subprocuraduria de Procedimientos Penales Región Orinte, Huejutla de Reyes, Huejutla de Reyes, Centro de Atención Temprana 1er. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Huejutla de Reyes, Huejutla de Reyes, Centro de Atención Temprana 2do. Turno'>Subprocuraduria de Procedimientos Penales Región Orinte, Huejutla de Reyes, Huejutla de Reyes, Centro de Atención Temprana 2do. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Huejutla de Reyes, Huejutla de Reyes, Centro de Atención Temprana 3er. Turno'>Subprocuraduria de Procedimientos Penales Región Orinte, Huejutla de Reyes, Huejutla de Reyes, Centro de Atención Temprana 3er. Turno'</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Metztitlan, Metztitlan, UIM Unica'>Subprocuraduria de Procedimientos Penales Región Orinte, Metztitlan, Metztitlan, UIM Unica</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Molango, Molango, UIM Unica'>Subprocuraduria de Procedimientos Penales Región Orinte, Molango, Molango, UIM Unica</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, DECOVIS I'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, DECOVIS I</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, DECOVIS II'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, DECOVIS II</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, DECOVIS III'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, DECOVIS III</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, DECOVIS IV'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, DECOVIS IV</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, DECOVIS V'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, DECOVIS V</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Robos I'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Robos I</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Robos II'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Robos II</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Robos III'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Robos III</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Robos IV'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Robos IV</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Robos V'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Robos V</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Patrimoniales I'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Patrimoniales I</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Patrimoniales II'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Patrimoniales II</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Patrimoniales III'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Patrimoniales III</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Patrimoniales IV'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Patrimoniales IV</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Diversos I'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Diversos I</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Diversos II'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Diversos II</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Diversos III'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Diversos III</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Con Detenido I'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Con Detenido I</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Con Detenido II'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Con Detenido II</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Con Detenido III'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Con Detenido III</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Con Detenido IV'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Con Detenido IV</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Con Detenido V'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Con Detenido V</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Tortura I'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Tortura I</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Tortura II'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Tortura II</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Tortura III'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Tortura III</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Casos Masivos'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Casos Masivos</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Centro de Atención Temprana Sector Central 1er. Turno'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Centro de Atención Temprana Sector Central 1er. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Centro de Atención Temprana Sector Central 2do. Turno'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Centro de Atención Temprana Sector Central 2do. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Centro de Atención Temprana Sector Central 3er. Turno'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Centro de Atención Temprana Sector Central 3er. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Centro de Atención Temprana Hospital General 1er. Turno'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Centro de Atención Temprana Hospital General 1er. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Centro de Atención Temprana Hospital General 2do. Turno'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Centro de Atención Temprana Hospital General 2do. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Centro de Atención Temprana Hospital General 3er. Turno'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Centro de Atención Temprana Hospital General 3er. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Centro de Atención Temprana Seguridad Pública Municipal 1er. Turno'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Centro de Atención Temprana Seguridad Pública Municipal 1er. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Centro de Atención Temprana Seguridad Pública Municipal 2do. Turno'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Centro de Atención Temprana Seguridad Pública Municipal 2do. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Centro de Atención Temprana Seguridad Pública Municipal 3er. Turno'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Centro de Atención Temprana Seguridad Pública Municipal 3er. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Centro de Atención Temprana Seguridad Pública Estatal 1er. Turno'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Centro de Atención Temprana Seguridad Pública Estatal 1er. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Centro de Atención Temprana Seguridad Pública Estatal 2do. Turno'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Centro de Atención Temprana Seguridad Pública Estatal 2do. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Centro de Atención Temprana Seguridad Pública Estatal 3er. Turno'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Centro de Atención Temprana Seguridad Pública Estatal 3er. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Centro de Atención Temprana Providencia (Mineral de la Reforma) 1er. Turno'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Centro de Atención Temprana Providencia (Mineral de la Reforma) 1er. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Centro de Atención Temprana Providencia (Mineral de la Reforma) 2do. Turno'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Centro de Atención Temprana Providencia (Mineral de la Reforma) 2do. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Centro de Atención Temprana Providencia (Mineral de la Reforma) 3er. Turno'>Subprocuraduria de Procedimientos Penales Región Orinte, Pachuca, Pachuca, Centro de Atención Temprana Providencia (Mineral de la Reforma) 3er. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Tenango, Tenango, UIM I'>Subprocuraduria de Procedimientos Penales Región Orinte, Tenango, Tenango, UIM I</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Tenango, Tenango, UIM II'>Subprocuraduria de Procedimientos Penales Región Orinte, Tenango, Tenango, UIM II</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Tulancingo, Tulancingo, UISD I'>Subprocuraduria de Procedimientos Penales Región Orinte, Tulancingo, Tulancingo, UISD I</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Tulancingo, Tulancingo, UISD II'>Subprocuraduria de Procedimientos Penales Región Orinte, Tulancingo, Tulancingo, UISD II</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Tulancingo, Tulancingo, UISD III'>Subprocuraduria de Procedimientos Penales Región Orinte, Tulancingo, Tulancingo, UISD III</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Tulancingo, Tulancingo, UISD IV'>Subprocuraduria de Procedimientos Penales Región Orinte, Tulancingo, Tulancingo, UISD IV</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Tulancingo, Tulancingo, UISD V'>Subprocuraduria de Procedimientos Penales Región Orinte, Tulancingo, Tulancingo, UISD V</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Tulancingo, Tulancingo, UISD IV'>Subprocuraduria de Procedimientos Penales Región Orinte, Tulancingo, Tulancingo, UISD VI</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Tulancingo, Tulancingo, UISD VII'>Subprocuraduria de Procedimientos Penales Región Orinte, Tulancingo, Tulancingo, UISD VII</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Tulancingo, Tulancingo, UICD I'>Subprocuraduria de Procedimientos Penales Región Orinte, Tulancingo, Tulancingo, UICD I</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Tulancingo, Tulancingo, UICD II'>Subprocuraduria de Procedimientos Penales Región Orinte, Tulancingo, Tulancingo, UICD II</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Tulancingo, Tulancingo, UICD III'>Subprocuraduria de Procedimientos Penales Región Orinte, Tulancingo, Tulancingo, UICD III</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Tulancingo, Tulancingo, UICD IV'>Subprocuraduria de Procedimientos Penales Región Orinte, Tulancingo, Tulancingo, UICD IV</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Tulancingo, Tulancingo, Centro de Atención Temprana 1er. Turno'>Subprocuraduria de Procedimientos Penales Región Orinte, Tulancingo, Tulancingo, Centro de Atención Temprana 1er. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Tulancingo, Tulancingo, Centro de Atención Temprana 2do. Turno'>Subprocuraduria de Procedimientos Penales Región Orinte, Tulancingo, Tulancingo, Centro de Atención Temprana 2do. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Tulancingo, Tulancingo, Centro de Atención Temprana 3er. Turno'>Subprocuraduria de Procedimientos Penales Región Orinte, Tulancingo, Tulancingo, Centro de Atención Temprana 3er. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Orinte, Zacualtipan, Zacualtipan, UIM Unica'>Subprocuraduria de Procedimientos Penales Región Orinte, Zacualtipan, Zacualtipan, UIM Unica</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Actopan, Actopan, UI I'>Subprocuraduria de Procedimientos Penales Región Poniente, Actopan, Actopan, UI I</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Actopan, Actopan, UI II'>Subprocuraduria de Procedimientos Penales Región Poniente, Actopan, Actopan, UI II</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Actopan, Actopan, UI III'>Subprocuraduria de Procedimientos Penales Región Poniente, Actopan, Actopan, UI III</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Actopan, Actopan, UI IV'>Subprocuraduria de Procedimientos Penales Región Poniente, Actopan, Actopan, UI IV</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Actopan, Actopan, UI V'>Subprocuraduria de Procedimientos Penales Región Poniente, Actopan, Actopan, UI V</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Actopan, Actopan, Centro de Atención Temprana 1er. Turno'>Subprocuraduria de Procedimientos Penales Región Poniente, Actopan, Actopan, Centro de Atención Temprana 1er. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Actopan, Actopan, Centro de Atención Temprana 2do. Turno'>Subprocuraduria de Procedimientos Penales Región Poniente, Actopan, Actopan, Centro de Atención Temprana 2do. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Actopan, Actopan, Centro de Atención Temprana 3er. Turno'>Subprocuraduria de Procedimientos Penales Región Poniente, Actopan, Actopan, Centro de Atención Temprana 3er. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Apan, Apan, UIM I'>Subprocuraduria de Procedimientos Penales Región Poniente, Apan, Apan, UIM I</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Apan, Apan, UIM II'>Subprocuraduria de Procedimientos Penales Región Poniente, Apan, Apan, UIM II</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Apan, Apan, UIM III'>Subprocuraduria de Procedimientos Penales Región Poniente, Apan, Apan, UIM III</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Apan, Apan, UIM IV'>Subprocuraduria de Procedimientos Penales Región Poniente, Apan, Apan, UIM IV</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Apan, Tepeapulco, UIM I'>Subprocuraduria de Procedimientos Penales Región Poniente, Apan, Tepeapulco, UIM I</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Apan, Tepeapulco, UIM II'>Subprocuraduria de Procedimientos Penales Región Poniente, Apan, Tepeapulco, UIM II</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Apan, Tepeapulco, UIM III'>Subprocuraduria de Procedimientos Penales Región Poniente, Apan, Tepeapulco, UIM III</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Apan, Tepeapulco, UIM IV'>Subprocuraduria de Procedimientos Penales Región Poniente, Apan, Tepeapulco, UIM IV</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Huichapan, Huichapan, UIM I'>Subprocuraduria de Procedimientos Penales Región Poniente, Huichapan, Huichapan, UIM I</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Huichapan, Huichapan, UIM II'>Subprocuraduria de Procedimientos Penales Región Poniente, Huichapan, Huichapan, UIM II</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Huichapan, Huichapan, UIM III'>Subprocuraduria de Procedimientos Penales Región Poniente, Huichapan, Huichapan, UIM III</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Huichapan, Huichapan, UIM IV'>Subprocuraduria de Procedimientos Penales Región Poniente, Huichapan, Huichapan, UIM IV</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Ixmiquilpan, Ixmiquilpan, UI I'>Subprocuraduria de Procedimientos Penales Región Poniente, Ixmiquilpan, Ixmiquilpan, UI I</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Ixmiquilpan, Ixmiquilpan, UI II'>Subprocuraduria de Procedimientos Penales Región Poniente, Ixmiquilpan, Ixmiquilpan, UI II</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Ixmiquilpan, Ixmiquilpan, UI III'>Subprocuraduria de Procedimientos Penales Región Poniente, Ixmiquilpan, Ixmiquilpan, UI III</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Ixmiquilpan, Ixmiquilpan, UI IV'>Subprocuraduria de Procedimientos Penales Región Poniente, Ixmiquilpan, Ixmiquilpan, UI IV</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Ixmiquilpan, Ixmiquilpan, UI V'>Subprocuraduria de Procedimientos Penales Región Poniente, Ixmiquilpan, Ixmiquilpan, UI V</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Ixmiquilpan, Ixmiquilpan, Centro de Atención Temprana 1er. Turno'>Subprocuraduria de Procedimientos Penales Región Poniente, Ixmiquilpan, Ixmiquilpan, Centro de Atención Temprana 1er. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Ixmiquilpan, Ixmiquilpan, Centro de Atención Temprana 2do. Turno'>Subprocuraduria de Procedimientos Penales Región Poniente, Ixmiquilpan, Ixmiquilpan, Centro de Atención Temprana 2do. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Ixmiquilpan, Ixmiquilpan, Centro de Atención Temprana 3er. Turno'>Subprocuraduria de Procedimientos Penales Región Poniente, Ixmiquilpan, Ixmiquilpan, Centro de Atención Temprana 3er. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Jacala, Jacala, UIM Unica'>Subprocuraduria de Procedimientos Penales Región Poniente, Jacala, Chapulguacan, UIM Unica</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Jacala, Chapulguacan, UIM Unica'>Subprocuraduria de Procedimientos Penales Región Poniente, Jacala, Chapulguacan, UIM Unica</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Mixquiahuala, Mixquiahuala, UI I'>Subprocuraduria de Procedimientos Penales Región Poniente, Mixquiahuala, Mixquiahuala, UI I</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Mixquiahuala, Mixquiahuala, UI II'>Subprocuraduria de Procedimientos Penales Región Poniente, Mixquiahuala, Mixquiahuala, UI II</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Mixquiahuala, Mixquiahuala, UI III'>Subprocuraduria de Procedimientos Penales Región Poniente, Mixquiahuala, Mixquiahuala, UI III</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Mixquiahuala, Mixquiahuala, Centro de Atención Temprana 1er. Turno'>Subprocuraduria de Procedimientos Penales Región Poniente, Mixquiahuala, Mixquiahuala, Centro de Atención Temprana 1er. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Mixquiahuala, Mixquiahuala, Centro de Atención Temprana 2do. Turno'>Subprocuraduria de Procedimientos Penales Región Poniente, Mixquiahuala, Mixquiahuala, Centro de Atención Temprana 2do. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Mixquiahuala, Mixquiahuala, Centro de Atención Temprana 3er. Turno'>Subprocuraduria de Procedimientos Penales Región Poniente, Mixquiahuala, Mixquiahuala, Centro de Atención Temprana 3er. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Tizayuca, Tizayuca, UI I'>Subprocuraduria de Procedimientos Penales Región Poniente, Tizayuca, Tizayuca, UI I</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Tizayuca, Tizayuca, UI II'>Subprocuraduria de Procedimientos Penales Región Poniente, Tizayuca, Tizayuca, UI II</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Tizayuca, Tizayuca, UI III'>Subprocuraduria de Procedimientos Penales Región Poniente, Tizayuca, Tizayuca, UI III</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Tizayuca, Tizayuca, UI IV'>Subprocuraduria de Procedimientos Penales Región Poniente, Tizayuca, Tizayuca, UI IV</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Tizayuca, Tizayuca, UI V'>Subprocuraduria de Procedimientos Penales Región Poniente, Tizayuca, Tizayuca, UI V</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Tizayuca, Tizayuca, Centro de Atención Temprana 1er. Turno'>Subprocuraduria de Procedimientos Penales Región Poniente, Tizayuca, Tizayuca, Centro de Atención Temprana 3er. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Tizayuca, Tizayuca, Centro de Atención Temprana 2do. Turno'>Subprocuraduria de Procedimientos Penales Región Poniente, Tizayuca, Tizayuca, Centro de Atención Temprana 3er. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Tizayuca, Tizayuca, Centro de Atención Temprana 3er. Turno'>Subprocuraduria de Procedimientos Penales Región Poniente, Tizayuca, Tizayuca, Centro de Atención Temprana 3er. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tula de Allende, UISD I'>Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tula de Allende, UISD I</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tula de Allende, UISD II'>Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tula de Allende, UISD II</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tula de Allende, UISD III'>Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tula de Allende, UISD III</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tula de Allende, UISD IV'>Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tula de Allende, UISD IV</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tula de Allende, UISD V'>Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tula de Allende, UISD V</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tula de Allende, UICD I'>Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tula de Allende, UICD I</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tula de Allende, IUCD II'>Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tula de Allende, UICD II</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tula de Allende, UICD III'>Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tula de Allende, UICD III</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tula de Allende, UICD IV'>Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tula de Allende, UICD IV</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tula de Allende, Centro de Atención Temprana 1er. Turno'>Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tula de Allende, Centro de Atención Temprana 1er. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tula de Allende, Centro de Atención Temprana 2do. Turno'>Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tula de Allende, Centro de Atención Temprana 2do. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tula de Allende, Centro de Atención Temprana 3er. Turno'>Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tula de Allende, Centro de Atención Temprana 3er. Turno</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tepeji del Rio, UIM I'>Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tepeji del Rio, UIM I</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tepeji del Rio, UIM II'>Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tepeji del Rio, UIM II</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tepeji del Rio, UIM III'>Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tepeji del Rio, UIM III</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tepeji del Rio, UIM IV'>Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tepeji del Rio, UIM IV</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tlaxcuapan, UIM I'>Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tlaxcuapan, UIM I</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tlaxcuapan, UIM II'>Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tlaxcuapan, UIM II</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tlaxcuapan, UIM III'>Subprocuraduria de Procedimientos Penales Región Poniente, Tula de Allende, Tlaxcuapan, UIM III</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Zimapan, Zimapan, UIM I'>Subprocuraduria de Procedimientos Penales Región Poniente, Zimapan, Zimapan, UIM I</option>
                  <option id='Subprocuraduria de Procedimientos Penales Región Poniente, Zimapan, Zimapan, UIM II'>Subprocuraduria de Procedimientos Penales Región Poniente, Zimapan, Zimapan, UIM II</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Pachuca de Soto, UISD I'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Pachuca de Soto, UISD I</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Pachuca de Soto, UISD II'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Pachuca de Soto, UISD II</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Pachuca de Soto, UISD III'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Pachuca de Soto, UISD III</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Pachuca de Soto, UISD IV'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Pachuca de Soto, UISD IV</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Centro de justicia para mujeres, CJM SD I'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Centro de justicia para mujeres, CJM SD I</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Centro de justicia para mujeres, CJM SD'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Centro de justicia para mujeres, CJM SD II</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Centro de justicia para mujeres, CJM SD'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Centro de justicia para mujeres, CJM SD III</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Centro de justicia para mujeres, CJM SD'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Centro de justicia para mujeres, CJM SD IV</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Centro de justicia para mujeres, CJM SD'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Centro de justicia para mujeres, CJM SD V</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Centro de justicia para mujeres, CJM SD'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Centro de justicia para mujeres, CJM SD VI</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Centro de justicia para mujeres, CJM CD'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Centro de justicia para mujeres, CJM CD I</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Centro de justicia para mujeres, CJM CD'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Centro de justicia para mujeres, CJM CD II</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Adolecentes, UISD I'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Adolecentes, UISD I</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Adolecentes, UISD II'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Adolecentes, UISD II</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Adolecentes, UISD III'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Adolecentes, UISD III</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Adolecentes, UISD IV'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Adolecentes, UISD IV</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Unidad niños niñas y adolecentes, UISD I'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Pachuca de Soto, Unidad niños niñas y adolecentes, UISD I</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Actopan, Actopan, UIM I'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Actopan, Actopan, UIM I</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Huajutla de reyes, Huajutla de reyes, UIM I'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Huajutla de reyes, Huajutla de reyes, UIM I</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Huajutla de reyes, Huajutla de reyes, UIM II'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Huajutla de reyes, Huajutla de reyes, UIM II</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Huajutla de reyes, Huajutla de reyes, UIM III'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Huajutla de reyes, Huajutla de reyes, UIM III</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Ixmiquilpan, Ixmiquilpan, UIM I'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Ixmiquilpan, Ixmiquilpan, UIM I</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Ixmiquilpan, Ixmiquilpan, UIM II'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Ixmiquilpan, Ixmiquilpan, UIM II</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Ixmiquilpan, Ixmiquilpan, UIM III'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Ixmiquilpan, Ixmiquilpan, UIM III</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Tizayuca, Tizayuca, UIM I'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Tizayuca, Tizayuca, UIM I</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Tizayuca, Tizayuca, UIM II'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Tizayuca, Tizayuca, UIM II</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Tizayuca, Tizayuca, UIM III'> Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Tizayuca, Tizayuca, UIM III</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Tula de Allende, Tula de Allende, UIM I'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Tula de Allende, Tula de Allende, UIM I</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Tula de Allende, Tula de Allende, UIM II'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Tula de Allende, Tula de Allende, UIM II</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Tula de Allende, Tula de Allende, UIM III'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Tula de Allende, Tula de Allende, UIM III</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Tula de Allende, Tula de Allende, UIM IV'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Tula de Allende, Tula de Allende, UIM IV</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Tula de Allende, Tula de Allende, UIM V'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Tula de Allende, Tula de Allende, UIM V</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Tulancingo de Bravo, Tulancingo de Bravo UIM I'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Tulancingo de Bravo, Tulancingo de Bravo UIM I, UIM I</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Tulancingo de Bravo, Tulancingo de Bravo, UIM II'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Tulancingo de Bravo, Tulancingo de Bravo, UIM II</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Tulancingo de Bravo, Tulancingo de Bravo UIM III'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Tulancingo de Bravo, Tulancingo de Bravo, UIM III</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Tulancingo de Bravo, Tulancingo de Bravo, UIM IV'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Tulancingo de Bravo, Tulancingo de Bravo, UIM IV</option>
                  <option id='Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Tulancingo de Bravo, Tulancingo de Bravo, UIM V'>Subprocuraduria de Derechos Humanos y Servicios a la Comunidad, Tulancingo de Bravo, Tulancingo de Bravo UIM V</option>
                  <option id='Coordinación de Investigación y Recuperación de Vehículos Robados (CIRVR), Pachuca de Soto, Pachuca de Soto, UIM I'>Coordinación de Investigación y Recuperación de Vehículos Robados (CIRVR), Pachuca de Soto, Pachuca de Soto, UIM I</option>
                  <option id='Coordinación de Investigación y Recuperación de Vehículos Robados (CIRVR), Pachuca de Soto, Pachuca de Soto, UIM II'>Coordinación de Investigación y Recuperación de Vehículos Robados (CIRVR), Pachuca de Soto, Pachuca de Soto, UIM II</option>
                  <option id='Coordinación de Investigación y Recuperación de Vehículos Robados (CIRVR), Pachuca de Soto, Pachuca de Soto, UIM IV'>Coordinación de Investigación y Recuperación de Vehículos Robados (CIRVR), Pachuca de Soto, Pachuca de Soto, UIM IV</option>
                  <option id='Coordinación de Investigación y Recuperación de Vehículos Robados (CIRVR), Pachuca de Soto, Pachuca de Soto, UIM V'>Coordinación de Investigación y Recuperación de Vehículos Robados (CIRVR), Pachuca de Soto, Pachuca de Soto, UIM V</option>
                  <option id='Coordinación de Investigación y Recuperación de Vehículos Robados (CIRVR), Pachuca de Soto, Pachuca de Soto, UIM VII'>Coordinación de Investigación y Recuperación de Vehículos Robados (CIRVR), Pachuca de Soto, Pachuca de Soto, UIM VII</option>
                  <option id='Coordinación de Investigación y Recuperación de Vehículos Robados (CIRVR), Pachuca de Soto, Pachuca de Soto, UIM VIII'>Coordinación de Investigación y Recuperación de Vehículos Robados (CIRVR), Pachuca de Soto, Pachuca de Soto, UIM VIII</option>
                  <option id='Coordinación de Investigación y Recuperación de Vehículos Robados (CIRVR), Pachuca de Soto, Pachuca de Soto, UIM IX'>Coordinación de Investigación y Recuperación de Vehículos Robados (CIRVR), Pachuca de Soto, Pachuca de Soto, UIM IX</option>
                  <option id='Coordinación de Investigación y Recuperación de Vehículos Robados (CIRVR), Pachuca de Soto, Pachuca de Soto, Casos Masivos'>Coordinación de Investigación y Recuperación de Vehículos Robados (CIRVR), Pachuca de Soto, Pachuca de Soto, Casos Masivos</option>
                  <option id='Coordinación de Investigación y Recuperación de Vehículos Robados (CIRVR), Tula de Allende, Tula de Allende, UIM I'>Coordinación de Investigación y Recuperación de Vehículos Robados (CIRVR), Tula de Allende, Tula de Allende, UIM I</option>
                  <option id='Coordinación de Investigación y Recuperación de Vehículos Robados (CIRVR), Tula de Allende, Tula de Allende, UIM II'>Coordinación de Investigación y Recuperación de Vehículos Robados (CIRVR), Tula de Allende, Tula de Allende, UIM II</option>
                  <option id='Coordinación de Investigación y Recuperación de Vehículos Robados (CIRVR), Tula de Allende, Tula de Allende, UIM III'>Coordinación de Investigación y Recuperación de Vehículos Robados (CIRVR), Tula de Allende, Tula de Allende, UIM III</option>
                  <option id='Coordinación de Investigación y Recuperación de Vehículos Robados (CIRVR), Tulancingo de bravo, Tulancingo de Bravo, UIM III'>Coordinación de Investigación y Recuperación de Vehículos Robados (CIRVR), Tulancingo de bravo, Tulancingo de Bravo, UIM III</option>
                  <option id='Coordinación de Investigación y Recuperación de Vehículos Robados (CIRVR), Tulancingo de bravo, Tulancingo de Bravo, UIM VI'>Coordinación de Investigación y Recuperación de Vehículos Robados (CIRVR), Tulancingo de bravo, Tulancingo de Bravo, UIM VI</option>
                  <option id='Coordinación de Investigación y Recuperación de Vehículos Robados (CIRVR), Tulancingo de bravo, Tulancingo de Bravo, UIM X'>Coordinación de Investigación y Recuperación de Vehículos Robados (CIRVR), Tulancingo de bravo, Tulancingo de Bravo, UIM X</option>
                  <option id='Unidad Especializada en Combate al Secuestro (UECS), Pachuca de Soto, Pachuca de Soto, UIM I'>Unidad Especializada en Combate al Secuestro (UECS), Pachuca de Soto, Pachuca de Soto, UIM I</option>
                  <option id='Unidad Especializada en Combate al Secuestro (UECS), Pachuca de Soto, Pachuca de Soto, UIM II'>Unidad Especializada en Combate al Secuestro (UECS), Pachuca de Soto, Pachuca de Soto, UIM II</option>
                  <option id='Unidad Especializada en Combate al Secuestro (UECS), Pachuca de Soto, Pachuca de Soto, UIM III'>Unidad Especializada en Combate al Secuestro (UECS), Pachuca de Soto, Pachuca de Soto, UIM III</option>
                  <option id='Unidad Especializada en Combate al Secuestro (UECS), Pachuca de Soto, Pachuca de Soto, UIM IV'>Unidad Especializada en Combate al Secuestro (UECS), Pachuca de Soto, Pachuca de Soto, UIM IV</option>
                  <option id='Unidad Especializada en Combate al Secuestro (UECS), Pachuca de Soto, Pachuca de Soto, UIM V'>Unidad Especializada en Combate al Secuestro (UECS), Pachuca de Soto, Pachuca de Soto, UIM V</option>
                  <option id='Unidad Especializada en Combate al Secuestro (UECS), Pachuca de Soto, Pachuca de Soto, UIM VI'>Unidad Especializada en Combate al Secuestro (UECS), Pachuca de Soto, Pachuca de Soto, UIM VI</option>
                  <option id='Unidad Especializada en Combate al Secuestro (UECS), Pachuca de Soto, Pachuca de Soto, Extorsión I'>Unidad Especializada en Combate al Secuestro (UECS), Pachuca de Soto, Pachuca de Soto, Extorsión I</option>
                  <option id='Unidad Especializada en Combate al Secuestro (UECS), Pachuca de Soto, Pachuca de Soto, Extorsión II'>Unidad Especializada en Combate al Secuestro (UECS), Pachuca de Soto, Pachuca de Soto, Extorsión II</option>
                  <option id='Unidad Especializada en Combate al Secuestro (UECS), Pachuca de Soto, Pachuca de Soto, Extorsión III'>Unidad Especializada en Combate al Secuestro (UECS), Pachuca de Soto, Pachuca de Soto, Extorsión III</option>
                  <option id='Centro de Operación Estratégica(COE), Pachuca de Soto, Pachuca de Soto, UIM I'>Centro de Operación Estratégica(COE), Pachuca de Soto, Pachuca de Soto, UIM I</option>
                  <option id='Centro de Operación Estratégica(COE), Pachuca de Soto, Pachuca de Soto, UIM II'>Centro de Operación Estratégica(COE), Pachuca de Soto, Pachuca de Soto, UIM II</option>
                  <option id='Centro de Operación Estratégica(COE), Pachuca de Soto, Pachuca de Soto, UIM III'>Centro de Operación Estratégica(COE), Pachuca de Soto, Pachuca de Soto, UIM III</option>
                  <option id='Centro de Operación Estratégica(COE), Pachuca de Soto, Pachuca de Soto, UIM IV'>Centro de Operación Estratégica(COE), Pachuca de Soto, Pachuca de Soto, UIM IV</option>
                  <option id='Fiscalias, Pachuca de Soto, Trata de Personas, UIM Unica'>Fiscalias, Pachuca de Soto, Trata de Personas, UIM Unica</option>
                  <option id='Fiscalias, Pachuca de Soto, Genero, UIM Unica'>Fiscalias, Pachuca de Soto, Genero, UIM Unica</option>
                  <option id='Fiscalias, Pachuca de Soto, Anticorrupcion, UIM I<'>Fiscalias, Pachuca de Soto, Anticorrupcion, UIM I</option>
                  <option id='Fiscalias, Pachuca de Soto, Anticorrupcion, UIM II'>Fiscalias, Pachuca de Soto, Anticorrupcion, UIM II</option>
                  <option id='Fiscalias, Pachuca de Soto, Anticorrupcion, UIM III'>Fiscalias, Pachuca de Soto, Anticorrupcion, UIM III</option>
                  <option id='Fiscalias, Pachuca de Soto, Anticorrupcion, UIM IV'>Fiscalias, Pachuca de Soto, Anticorrupcion, UIM IV</option>
                  <option id='Fiscalias, Pachuca de Soto, Electorales, UIM Unica'>Fiscalias, Pachuca de Soto, Electorales, UIM Unica</option>
                  <option id='Fiscalias, Pachuca de Soto, Desaparicion de Personas, Desaparicion de Personas, UIM I'>Fiscalias, Pachuca de Soto, Desaparicion de Personas, Desaparicion de Personas, UIM I</option>
                  <option id='Fiscalias, Pachuca de Soto, Desaparicion de Personas, UIM II'>Fiscalias, Pachuca de Soto, Desaparicion de Personas, UIM II</option>
                  <option id='Fiscalias, Pachuca de Soto, Desaparicion de Personas, UIM III'>Fiscalias, Pachuca de Soto, Desaparicion de Personas, UIM III</option>
                  <option id='Fiscalias, Pachuca de Soto, Desaparicion de Personas, UIM IV'>Fiscalias, Pachuca de Soto, Desaparicion de Personas, UIM IV</option>
                </select>
              </div>
            </div>
            <div>
              {this.state.agencia && this.state.nombre ?
                <div className='boton'>
                  {this.state.timerLigado === false && this.state.timerTempo === 0 && (
                    <button className='play' onClick={this.iniciarTimer}>Play</button>
                  )}
                  {this.state.timerLigado === true && (
                    <button className='detener' onClick={this.pararTimer}>Detener</button>
                  )}
                </div>: null
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
