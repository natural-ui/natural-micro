import express from 'express'
import path from 'path'
import hypernova from 'hypernova/server'
import {renderReact} from 'hypernova-react'

import Header from './components/Header'

hypernova({
  devMode: true,
  getComponent(name) {
    if (name === 'Header') {
      return renderReact(name, Header)
    }

    return null
  },
  port: 3001,
  endpoint: '/batch-data',
  createApplication() {
    const app = express()

    app.use(express.static(path.join(process.cwd(), 'dist')))

    return app
  },
})
