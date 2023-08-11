import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ErrorAlert from './ErrorAlert';
import { createTable } from '../utils/api';
// import TableForm from './TableForm';

function NewTable() {
  const [formData, setFormData] = useState({
    table_name: '',
    capacity: '',
  });
  const [error, setError] = useState(null);
  const history = useHistory();

  const handleChange = (e) => {
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
        console.log('Table created:', table);

        // Reset the form after successful submission
        setFormData({
          table_name: '',
          capacity: '',
        });

        // Redirect to the dashboard or wherever appropriate for tables
        history.push('/dashboard');
      })
      .catch((error) => {
        console.error('Error creating table:', error);
        setError(error);
      });

    return () => abortController.abort(); // Cleanup the AbortController
  };

  return (
    <div>
      <h2>Create a New Table</h2>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit}>
        <div>
          <label>Table name:</label>
          <input
            name='table_name'
            value={formData.table_name}
            onChange={handleChange}
            required
            minLength={2}
          />
        </div>
        <div>
          <label>Capacity:</label>
          <input
            name='capacity'
            type='number'
            value={formData.capacity}
            onChange={handleChange}
            required
            min={1}
          />
        </div>
        <div>
          <button type='submit'>Submit</button>
          <button type='button' onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewTable;
