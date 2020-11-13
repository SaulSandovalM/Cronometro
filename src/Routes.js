import React from 'react'
import { Route, Switch } from 'react-router-dom'
import StopWatch from './stopwatch/components/stopwatch/Stopwatch'
import List from './stopwatch/components/list/List'

export const Routes = () => (
  <Switch>
    <Route exact path='/' component={StopWatch} />
    <Route exact path='/Lista' component={List} />
  </Switch>
)
