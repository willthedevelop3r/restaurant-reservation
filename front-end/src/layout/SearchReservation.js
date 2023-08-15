import React, { useState } from 'react';
import {
  searchReservationsByPhoneNumber,
  updateReservationStatus,
} from '../utils/api';
import { Link } from 'react-router-dom';
import ErrorAlert from './ErrorAlert';

function SearchReservation() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    searchReservationsByPhoneNumber(mobileNumber)
      .then(setReservations)
      .catch((error) => setError(error));
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
    <div>
      <h2>Search Reservation by Phone Number</h2>
      <form onSubmit={handleSearch}>
        <input
          type='text'
          name='mobile_number'
          placeholder='Enter Mobile Number'
          value={mobileNumber}
          onChange={handleInputChange}
        />
        <button type='submit'>Find</button>
      </form>

      <ErrorAlert error={error} />

      {reservations.length > 0 ? (
        <ul>
          {reservations.map((reservation) => (
            <li key={reservation.reservation_id}>
              <strong>Name:</strong> {reservation.first_name}{' '}
              {reservation.last_name} <br />
              <strong>Mobile:</strong> {reservation.mobile_number} <br />
              <strong>Date:</strong> {reservation.reservation_date} <br />
              <strong>Time:</strong> {reservation.reservation_time} <br />
              <strong>Party Size:</strong> {reservation.people} <br />
              {reservation.status === 'booked' && (
                <>
                  <Link to={`/reservations/${reservation.reservation_id}/edit`}>
                    Edit
                  </Link>
                  <button
                    data-reservation-id-cancel={reservation.reservation_id}
                    onClick={() => handleCancel(reservation.reservation_id)}
                  >
                    Cancel
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No reservations found.</p>
      )}
    </div>
  );
}

export default SearchReservation;
