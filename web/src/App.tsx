import { Layout } from 'antd'
import React from 'react'
import { Helmet } from 'react-helmet'
import { Redirect, Route, Switch } from 'react-router-dom'
import Dashboard from './pages/dashboard'
import Feed from './pages/dashboard/Feed'
import NotFound from './pages/errors/NotFound'
import Home from './pages/Home'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'

import 'antd/dist/antd.min.css'
import './App.css'

function App(): React.ReactElement {
  return (
    <Layout className="App">
      <Helmet>
        <title>Tamagotreal</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://tamagotreal.vercel.app" />
        <meta
          name="description"
          content="Tamagotchi for your real pets"
        />
      </Helmet>
      <Switch>
        <Route path="/feed/:id" exact component={Feed} />
        <Route path="/dashboard/:page" exact component={Dashboard} />
        <Route path="/dashboard" exact><Redirect to="/dashboard/main" /></Route>
        <Route path="/" exact component={Home} />
        <Route path="/terms" exact component={Terms} />
        <Route path="/privacy" exact component={Privacy} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  )
}

export default App
