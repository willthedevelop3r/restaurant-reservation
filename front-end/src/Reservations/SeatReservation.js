import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { readReservation, listTables, seatTable } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';

function SeatReservation() {
  const [tables, setTables] = useState([]);
  const [reservation, setReservation] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const history = useHistory();
  const { reservation_id } = useParams();

  useEffect(() => {
    const abortController = new AbortController();

    readReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setError);

    listTables(abortController.signal)
      .then((availableTables) => {
        setTables(availableTables);
        if (availableTables.length) {
          setSelectedTable(availableTables[0]);
        }
      })
      .catch(setError);

    return () => abortController.abort();
  }, [reservation_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const abortController = new AbortController();

    if (!reservation) {
      setError(new Error('Reservation not found!'));
      return;
    }

    if (!selectedTable) {
      setError(new Error('Please select a table.'));
      return;
    }

    if (selectedTable.reservation_id) {
      setError(new Error('This table is already occupied.'));
      return;
    }

    if (selectedTable.capacity < reservation.people) {
      setError(
        new Error(
          "Can't seat a reservation with more people than the table's capacity."
        )
      );
      return;
    }

    seatTable(selectedTable.table_id, reservation_id, abortController.signal)
      .then(() => {
        history.push('/dashboard');
      })
      .catch(setError);

    return () => abortController.abort();
  };

  const handleCancel = () => {
    history.goBack();
  };

  return (
    <div>
      <ErrorAlert error={error} />

      <select
        name='table_id'
        value={selectedTable ? selectedTable.table_id : ''}
        onChange={(e) =>
          setSelectedTable(
            tables.find((table) => table.table_id === Number(e.target.value))
          )
        }
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

      <input
        type='text'
        name='name'
        value={formData.name || ''}
        onChange={handleInputChange}
        placeholder='Name'
      />

      <button type='submit' onClick={handleSubmit}>
        Submit
      </button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
}

export default SeatReservation;
