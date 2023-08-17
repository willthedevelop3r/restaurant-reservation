import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  listReservations,
  listTables,
  finishTable,
  updateReservationStatus,
} from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import { previous, today, next } from '../utils/date-time';
import DisplayReservations from '../Reservations/DisplayReservations';
import DisplayTables from '../Tables/DisplayTables';

function Dashboard() {
  const location = useLocation(); // Get the location object
  const queryDate = new URLSearchParams(location.search).get('date'); // Parse the date from the query parameters
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null); // To set any reservations error
  const [tablesError, setTablesError] = useState(null); // To set any tables error
  const [selectedDate, setSelectedDate] = useState(queryDate || today());

  useEffect(() => {
    loadDashboard(selectedDate); // Load dashboard by selected date
  }, [selectedDate]);

  function loadDashboard(date) {
    const abortController = new AbortController();

    // Call the api function
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    // Call the api function
    listTables(abortController.signal).then(setTables).catch(setTablesError);

    return () => abortController.abort();
  }

  function handleDateChange(newDate) {
    setSelectedDate(newDate);
  }

  function handleFinish(tableId) {
    if (
      window.confirm(
        'Is this table ready to seat new guests? This cannot be undone.'
      )
    ) {
      finishTable(tableId) // Call the api function
        .then(() => loadDashboard(selectedDate))
        .catch(setTablesError);
    }
  }

  function handleCancel(reservationId) {
    if (
      window.confirm(
        'Do you want to cancel this reservation? This cannot be undone.'
      )
    ) {
      updateReservationStatus(reservationId, 'cancelled') // Call the api function
        .then(() => {
          return loadDashboard(selectedDate);
        })
        .catch((error) => {
          setReservationsError(error);
        });
    }
  }

  return (
    <div className='container mt-5'>
      <main className='d-flex flex-column align-items-center'>
        <h1 className='font-weight-bold mb-3'>Dashboard</h1>

        <div className='d-flex flex-column align-items-center gap-2 mb-3'>
          <h4 className='mb-2'>
            Reservations for date: {selectedDate.split('T')[0]}
          </h4>
          <div className='d-flex gap-2'>
            <button
              className='btn btn-primary mr-2 mt-2'
              onClick={() => handleDateChange(previous(selectedDate))}
            >
              Previous
            </button>
            <button
              className='btn btn-primary mr-2 mt-2'
              onClick={() => handleDateChange(today())}
            >
              Today
            </button>
            <button
              className='btn btn-primary mt-2'
              onClick={() => handleDateChange(next(selectedDate))}
            >
              Next
            </button>
          </div>
        </div>

        <DisplayReservations
          reservations={reservations}
          handleCancel={handleCancel}
        />

        <ErrorAlert error={reservationsError} />

        <DisplayTables tables={tables} handleFinish={handleFinish} />

        <ErrorAlert error={tablesError} />
      </main>
    </div>
  );
}

export default Dashboard;
