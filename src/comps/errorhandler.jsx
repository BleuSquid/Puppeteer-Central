import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'

export default function ErrorFallback({ error, resetErrorBoundary }) {
    return (
        <div role="alert">
            <p>There was an error displaying this</p>
            <p>This is usually due to invalid or missing data sent from the host game</p>
        </div>
    )
}