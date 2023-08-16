import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ErrorAlert from '../layout/ErrorAlert';
import { createTable } from '../utils/api';
// import TableForm from './TableForm';

function NewTable() {
  const [formData, setFormData] = useState({
    table_name: '',
    capacity: '',
  });
  const [error, setError] = useState(null);
  const history = useHistory();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'capacity' ? Number(value) : value,
    });
  };

  const handleCancel = () => {
    history.goBack();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const abortController = new AbortController();

    // Call the API function
    createTable(formData, abortController.signal)
      .then((table) => {
        // Reset the form after successful submission
        setFormData({
          table_name: '',
          capacity: '',
        });

        // Redirect to the dashboard or wherever appropriate for tables
        history.push('/dashboard');
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setError(error);
        }
      });

    return () => abortController.abort(); // Cleanup the AbortController
  };

  return (
    <div className='container mt-5'>
      <h2 className='text-center font-weight-bold '>Create a New Table</h2>
      <ErrorAlert error={error} />
      <form
        onSubmit={handleSubmit}
        className='mx-auto'
        style={{ maxWidth: '500px' }}
      >
        <div className='form-group'>
          <label htmlFor='table_name'>Table Name:</label>
          <input
            type='text'
            name='table_name'
            id='table_name'
            value={formData.table_name}
            onChange={handleInputChange}
            required
            minLength={2}
            className='form-control rounded'
          />
        </div>

        <div className='form-group'>
          <label htmlFor='capacity'>Capacity:</label>
          <input
            type='number'
            name='capacity'
            id='capacity'
            value={formData.capacity}
            onChange={handleInputChange}
            required
            min={1}
            className='form-control rounded'
          />
        </div>

        <div className='form-group d-flex justify-content-end'>
          <button type='submit' className='btn btn-primary rounded-pill mr-2'>
            Submit
          </button>
          <button
            type='button'
            onClick={handleCancel}
            className='btn btn-secondary rounded-pill'
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewTable;
