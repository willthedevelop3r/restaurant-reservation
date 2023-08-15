import React, { useState } from 'react';
import {
  searchReservationsByPhoneNumber,
  updateReservationStatus,
} from '../utils/api';
import { Link } from 'react-router-dom';
import ErrorAlert from '../layout/ErrorAlert';

function SearchReservation() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();

    searchReservationsByPhoneNumber(mobileNumber)
      .then((data) => {
        if (data.length === 0) {
          setReservations([]); // Clear the reservations
          setError(new Error('No reservations found.'));
        } else {
          setReservations(data);
          setError(null); // Clear any previous error
        }
      })
      .catch((error) => {
        setReservations([]); // Clear the reservations
        setError(error);
      });
  };

  const handleInputChange = (e) => {
    setMobileNumber(e.target.value);
  };

  const handleCancel = (reservation_id) => {
    const confirmed = window.confirm(
      'Do you want to cancel this reservation? This cannot be undone.'
    );
    if (confirmed) {
      updateReservationStatus(reservation_id, 'cancelled')
        .then(() => {
          // Refresh reservations or remove the cancelled one from the list.
          setReservations((prev) =>
            prev.filter((res) => res.reservation_id !== reservation_id)
          );
        })
        .catch((error) => setError(error));
    }
  };

  return (
    <div className='container mt-5'>
      <h2 className='font-weight-bold mb-3 text-center'>
        Search Reservation by Phone Number
      </h2>

      <div className='row justify-content-center'>
        <div className='col-lg-6 col-md-8 col-sm-12'>
          <form onSubmit={handleSearch} className='mb-4'>
            <div className='input-group'>
              <input
                type='text'
                name='mobile_number'
                placeholder='Enter Mobile Number'
                value={mobileNumber}
                onChange={handleInputChange}
                className='form-control mr-2'
              />
              <div className='input-group-append'>
                <button type='submit' className='btn btn-primary rounded-pill'>
                  Find
                </button>
              </div>
            </div>
          </form>

          <ErrorAlert error={error} />

          {error ? null : reservations.length ? (
            <div className='list-group'>
              {reservations.map((reservation) => (
                <div
                  key={reservation.reservation_id}
                  className='list-group-item'
                >
                  <strong>Name:</strong>{' '}
                  {`${reservation.first_name} ${reservation.last_name}`} <br />
                  <strong>Mobile:</strong> {reservation.mobile_number} <br />
                  <strong>Date:</strong> {reservation.reservation_date} <br />
                  <strong>Time:</strong> {reservation.reservation_time} <br />
                  <strong>Party Size:</strong> {reservation.people} <br />
                  {reservation.status === 'booked' && (
                    <div className='mt-2'>
                      <Link
                        to={`/reservations/${reservation.reservation_id}/edit`}
                        className='btn btn-secondary btn-sm mr-2'
                      >
                        Edit
                      </Link>
                      <button
                        data-reservation-id-cancel={reservation.reservation_id}
                        onClick={() => handleCancel(reservation.reservation_id)}
                        className='btn btn-danger btn-sm'
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className='alert alert-warning'>No reservations found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchReservation;
