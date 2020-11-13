import React, { Component } from 'react'
import './Controls.css'
import PropTypes from 'prop-types'

export default class Controls extends Component {
  static proptTypes = {
    isRunning: PropTypes.bool,
    start: PropTypes.func.isRequired,
    stop: PropTypes.func.isRequired,
    addLapTime: PropTypes.func.isRequired
  }

  static defaultProps = {
    isRunning : false
  }

  render() {
    const { isRunning, start, stop } = this.props

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
      </div>
    )
  }
}
