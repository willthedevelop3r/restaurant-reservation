import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  listReservations,
  listTables,
  finishTable,
  updateReservationStatus,
} from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import { previous, today, next } from '../utils/date-time';

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
          <h4 className='mb-2'>Reservations for date: {selectedDate}</h4>
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

        <div className='container mt-3'>
          <h2 className='font-weight-bold mb-3 text-center'>Reservations</h2>
          {reservations.length ? (
            <div className='row justify-content-center'>
              {reservations.map((reservation) => (
                <div
                  key={reservation.reservation_id}
                  className='col-lg-4 col-md-6 col-sm-12 mb-3'
                >
                  <div className='card text-center' style={{ width: '100%' }}>
                    <div className='card-body'>
                      <h5 className='card-title'>
                        {reservation.first_name} {reservation.last_name}
                      </h5>
                      <h6 className='card-subtitle mb-2 text-muted'>
                        {reservation.reservation_date}
                      </h6>
                      <p className='card-text'>
                        Mobile: {reservation.mobile_number}
                      </p>
                      <p className='card-text'>People: {reservation.people}</p>
                      <p
                        className='card-text'
                        data-reservation-id-status={reservation.reservation_id}
                      >
                        Status: {reservation.status}
                      </p>

                      {reservation.status === 'booked' && (
                        <>
                          <Link
                            to={`/reservations/${reservation.reservation_id}/seat`}
                          >
                            <button className='btn btn-primary'>Seat</button>
                          </Link>
                          <Link
                            to={`/reservations/${reservation.reservation_id}/edit`}
                          >
                            <button className='btn btn-secondary ml-2'>
                              Edit
                            </button>
                          </Link>
                          <button
                            data-reservation-id-cancel={
                              reservation.reservation_id
                            }
                            className='btn btn-danger ml-2'
                            onClick={() =>
                              handleCancel(reservation.reservation_id)
                            }
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-center'>
              No reservations for the selected date.
            </p>
          )}
        </div>

        <div className='container mt-3'>
          <h2 className='font-weight-bold mb-3 text-center'>Tables</h2>
          {tables.length ? (
            <div className='row justify-content-center'>
              {tables.map((table) => (
                <div
                  key={table.table_id}
                  className='col-lg-4 col-md-6 col-sm-12 mb-3'
                >
                  <div className='card text-center' style={{ width: '100%' }}>
                    <div className='card-body'>
                      <h5 className='card-title'>{table.table_name}</h5>
                      <h6 className='card-subtitle mb-2 text-muted'>
                        Capacity: {table.capacity}
                      </h6>
                      <span data-table-id-status={table.table_id}>
                        Status: {table.reservation_id ? 'Occupied' : 'Free'}
                      </span>
                      {table.reservation_id && (
                        <div className='mt-2'>
                          <button
                            data-table-id-finish={table.table_id}
                            onClick={() => handleFinish(table.table_id)}
                            className='btn btn-primary'
                          >
                            Finish
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='row justify-content-center'>
              <div className='col-lg-4 col-md-6 col-sm-12'>
                <div className='card text-center' style={{ width: '100%' }}>
                  <div className='card-body'>
                    <p className='card-text'>No tables available.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <ErrorAlert error={reservationsError} />
        <ErrorAlert error={tablesError} />
      </main>
    </div>
  );
}

export default Dashboard;
