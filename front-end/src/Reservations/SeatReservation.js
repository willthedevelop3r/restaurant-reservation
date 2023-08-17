import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { readReservation, listTables, seatTable } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';

function SeatReservation() {
  const [tables, setTables] = useState([]);
  const [reservation, setReservation] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [error, setError] = useState(null); // To set any errors
  const history = useHistory();
  const { reservation_id } = useParams();

  useEffect(() => {
    const abortController = new AbortController();

    // Call the api function
    readReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setError);

    //Call the api function
    listTables(abortController.signal)
      .then((availableTables) => {
        setTables(availableTables);
        if (availableTables.length) {
          setSelectedTable(availableTables[0]);
        }
      })
      .catch(setError);

    return () => abortController.abort(); // Cleanup AbortController
  }, [reservation_id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation check
    if (!reservation) {
      setError(new Error('Reservation not found!'));
      return;
    }

    // Validation check
    if (!selectedTable) {
      setError(new Error('Please select a table.'));
      return;
    }

    // Validation check
    if (selectedTable.reservation_id) {
      setError(new Error('This table is already occupied.'));
      return;
    }

    // Validation check
    if (selectedTable.capacity < reservation.people) {
      setError(
        new Error(
          "Can't seat a reservation with more people than the table's capacity."
        )
      );
      return;
    }

    seatTable(selectedTable.table_id, reservation_id)
      .then(() => {
        history.push('/dashboard');
      })
      .catch(setError);

    return;
  };

  const handleCancel = () => {
    history.goBack();
  };

  return (
    <div className='container mt-5'>
      <ErrorAlert error={error} />

      <div className='form-group'>
        <h2 className='text-center font-weight-bold mb-4'>Seat Reservation</h2>
        <select
          name='table_id'
          id='table_id'
          value={selectedTable ? selectedTable.table_id : ''}
          onChange={(e) =>
            setSelectedTable(
              tables.find((table) => table.table_id === Number(e.target.value))
            )
          }
          className='form-control rounded'
        >
          {tables.length ? (
            tables.map((table) => (
              <option key={table.table_id} value={table.table_id}>
                {table.table_name} - {table.capacity}
              </option>
            ))
          ) : (
            <option>No tables available</option>
          )}
        </select>
      </div>

      <div className='form-group d-flex justify-content-end'>
        <button
          type='submit'
          onClick={handleSubmit}
          className='btn btn-primary rounded-pill mr-2'
        >
          Submit
        </button>
        <button
          onClick={handleCancel}
          className='btn btn-secondary rounded-pill'
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default SeatReservation;
