import React, { Component } from 'react'
import './LapTime.css'
import PropTypes from 'prop-types'
import timeFormat from '../../utils/timeFormat'

export default class LapTime extends Component {
  static proptTypes = {
    lap: PropTypes.number,
    time: PropTypes.number
  }

  static defaultProps = {
    lap: 0,
    time: 0
  }

  render() {

    const { lap, time } = this.props

    return (
      <div className='LapTime'>
        <span className='LapTime__lap' >{ lap }</span>
        <span className='LapTime__time' >{ timeFormat( time ) }</span>
      </div>
    )
  }
}
