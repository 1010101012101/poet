// Rendering
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import RedBox from 'redbox-react'

// bitcore
const bitcore = require('bitcore-lib')

// Routing
import { Router, Route, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

// Hot reloading
import { AppContainer } from 'react-hot-loader'

// My redux config
import { configureStore } from './store'

// Get routes
import { routes } from './routes'

// Style
import 'antd/dist/antd.less'

// Instantiation
const store = configureStore()
const history = syncHistoryWithStore(browserHistory, store)

if (!localStorage.getItem('privateKey')) {
  const privateKey = new bitcore.PrivateKey()
  localStorage.setItem('privateKey', privateKey.toString())
}

function drawApp(getRoutes) {
  try {
    ReactDOM.render(
      <AppContainer>
        <Provider store={store}>
          <div>
            <Router history={history}>
              { getRoutes() }
            </Router>
          </div>
        </Provider>
      </AppContainer>,
      document.getElementById('app')
    )
  } catch (e) {
    ReactDOM.render(<RedBox error={e} />, document.getElementById('app'))
  }
}

// Finally, draw!
drawApp(routes)

if (module.hot) {
  module.hot.accept('./routes', () => {
    const routes = require('./routes').routes
    drawApp(routes)
  })
}