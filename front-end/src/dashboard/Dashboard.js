import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { listReservations, listTables, finishTable } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import { previous, today, next } from '../utils/date-time';

function Dashboard() {
  const location = useLocation(); // Get the location object
  const queryDate = new URLSearchParams(location.search).get('date'); // Parse the date from the query parameters
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(queryDate || today());

  useEffect(() => {
    loadDashboard(selectedDate);
  }, [selectedDate]);

  function loadDashboard(date) {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);

    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

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
      finishTable(tableId)
        .then(() => loadDashboard(selectedDate))
        .catch(setTablesError);
    }
  }

  return (
    <main className='d-flex flex-column align-items-center'>
      <h1 className='h3 font-weight-bold mb-3'>Dashboard</h1>
      <div className='d-flex flex-column flex-md-column align-items-center gap-2 mb-3'>
        <h4 className='mb-2'>Reservations for date: {selectedDate}</h4>
        <div className='d-flex gap-2'>
          <button
            className='btn btn-primary mr-2'
            onClick={() => handleDateChange(previous(selectedDate))}
          >
            Previous
          </button>
          <button
            className='btn btn-primary mr-2'
            onClick={() => handleDateChange(today())}
          >
            Today
          </button>
          <button
            className='btn btn-primary'
            onClick={() => handleDateChange(next(selectedDate))}
          >
            Next
          </button>
        </div>
      </div>

      <div>
        <h2>Reservations</h2>
        {reservations.length ? (
          reservations.map((reservation) => (
            <div key={reservation.reservation_id}>
              <p>
                {reservation.first_name} {reservation.last_name}
              </p>
              <Link to={`/reservations/${reservation.reservation_id}/seat`}>
                <button>Seat</button>
              </Link>
            </div>
          ))
        ) : (
          <p>No reservations for the selected date.</p>
        )}
      </div>

      <div>
        <h2>Tables</h2>
        {tables.length ? (
          tables.map((table) => (
            <div key={table.table_id}>
              <p>{table.table_name}</p>
              <span data-table-id-status={table.table_id}>
                {table.reservation_id ? 'Occupied' : 'Free'}
              </span>
              {table.reservation_id && (
                <button
                  data-table-id-finish={table.table_id}
                  onClick={() => handleFinish(table.table_id)}
                >
                  Finish
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No tables available.</p>
        )}
      </div>

      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      {JSON.stringify(reservations)}
    </main>
  );
}

export default Dashboard;
