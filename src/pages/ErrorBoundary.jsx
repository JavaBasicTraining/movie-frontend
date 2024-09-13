import React, { useLayoutEffect, useRef } from 'react';
import { useRouteError } from 'react-router-dom';
import './ErrorBoundary.scss';

function ErrorBoundary(props) {
  const error = useRouteError();
  const statusRef = useRef();

  useLayoutEffect(() => {
    if (statusRef.current) {
      const status = error['status'].toString();
      statusRef.current.style.setProperty('--text-size', status.length);

      setTimeout(() => {
        statusRef.current.style.setProperty('--border-right', 'none');
      }, (status.length * 0.4 * 1000) + 500);
    }
  }, [error]);

  return (
    <div ref={statusRef} className="ErrorBoundary">
      <div className="ErrorBoundary__status-wrapper">
        <h1 className="ErrorBoundary__status">{error['status']}</h1>
      </div>
    </div>
  );
}

export default ErrorBoundary;
