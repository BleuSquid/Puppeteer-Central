import 'regenerator-runtime'

import * as ReactDOM from 'react-dom'
import App from './comps/app'
import connect from './services/connection'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from './comps/errorhandler'

ReactDOM.render(
    <ErrorBoundary FallbackComponent={ErrorFallback}>
        <App />
    </ErrorBoundary>,
    document.getElementById('app')
)
connect()
