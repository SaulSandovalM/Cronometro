import React, { Component } from 'react'
import './Controls.css'
import PropTypes from 'prop-types'

export default class Controls extends Component {
  static proptTypes = {
    isRunning: PropTypes.bool,
    start: PropTypes.func.isRequired,
    stop: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    addLapTime: PropTypes.func.isRequired
  }

  static defaultProps = {
    isRunning : false
  }

  render() {
    const { isRunning, start, stop, reset, addLapTime } = this.props

    return (
      <div className='Controls'>
        { !isRunning ?
          <button
            onClick={ start }
            className='Controls__button'
            ref='startBtn'
          >
            Iniciar
          </button>
        : null
        }
        { isRunning ?
          <button
            onClick={ stop }
            className='Controls__button'
            ref='stopBtn'
          >
            Detener
          </button>
          : null
        }
        <button
          onClick={ reset }
          disabled={ isRunning }
          className='Controls__button'
          ref='resetBtn'
        >
          Reset
        </button>
        <button
          onClick={ addLapTime }
          disabled={ !isRunning }
          className='Controls__button'
          ref='lapBtn'
        >
          Marca
        </button>
      </div>
    )
  }
}
