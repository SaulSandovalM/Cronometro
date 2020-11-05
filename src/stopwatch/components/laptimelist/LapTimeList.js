import React, { Component } from 'react'
import './LapTimeList.css'
import PropTypes from 'prop-types'
import LapTime from '../laptime/LapTime'

export default class LapTimeList extends Component {
  static proptTypes = {
    timeList: PropTypes.array
  }

  static defaultProps = {
    timeList: []
  }

  render() {
    const { timeList } = this.props

    return (
      <div className='LapTimeList'>
        <div className='LapTimeList__listwrap'>
          <div className='LapTimeList__headers'>
            <span> Marca </span>
            <span> Tiempo </span>
          </div>
          <ul className='LapTimeList__list' >
            {
              timeList.map( (time, index) => {
                return (
                  <li key={ index }>
                    <LapTime lap={ index + 1 } time={ time }  />
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
    )
  }
}
