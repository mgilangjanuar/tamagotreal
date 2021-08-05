import { Layout } from 'antd'
import React from 'react'
import { Helmet } from 'react-helmet'
import { Route, Switch } from 'react-router-dom'
import NotFound from './pages/errors/NotFound'
import Home from './pages/Home'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'

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
        <Route path="/" exact component={Home} />
        <Route path="/terms" exact component={Terms} />
        <Route path="/privacy" exact component={Privacy} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  )
}

export default App
