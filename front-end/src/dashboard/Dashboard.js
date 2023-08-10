import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { listReservations } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import { previous, today, next } from '../utils/date-time';

function Dashboard() {
  const location = useLocation(); // Get the location object
  const queryDate = new URLSearchParams(location.search).get('date'); // Parse the date from the query parameters
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(queryDate || today());

  useEffect(() => {
    loadDashboard(selectedDate);
  }, [selectedDate]);

  function loadDashboard(date) {
    const abortController = new AbortController();
    setReservationsError(null);

    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    return () => abortController.abort();
  }

  function handleDateChange(newDate) {
    setSelectedDate(newDate);
  }

  return (
    <main>
      <h1 className='text-xl font-bold'>Dashboard</h1>
      <div className='flex flex-col md:flex-row items-center mb-3'>
        <h4 className='mb-0'>Reservations for date: {selectedDate}</h4>
        <button onClick={() => handleDateChange(previous(selectedDate))}>
          Previous
        </button>
        <button onClick={() => handleDateChange(today())}>Today</button>
        <button onClick={() => handleDateChange(next(selectedDate))}>
          Next
        </button>
      </div>
      <ErrorAlert error={reservationsError} />
      {JSON.stringify(reservations)}
    </main>
  );
}

export default Dashboard;
