import React from 'react';

/**
 * Defines the alert message to render if the specified error is truthy.
 * @param error
 *  an instance of an object with `.message` property as a string, typically an Error instance.
 * @returns {JSX.Element}
 *  a bootstrap danger alert that contains the message string.
 */

function ErrorAlert({ error }) {
  return (
    error && (
      <div className='bg-red-500 text-white p-2 m-2'>
        Error: {error.message}
      </div>
    )
  );
}

export default ErrorAlert;
