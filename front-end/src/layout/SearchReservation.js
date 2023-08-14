import React, { useState } from 'react';
import { searchReservationsByPhoneNumber } from '../utils/api';

function SearchReservation() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();

    searchReservationsByPhoneNumber(mobileNumber)
      .then((results) => {
        setReservations(results);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      });
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
          onChange={(e) => setMobileNumber(e.target.value)}
        />
        <button type='submit'>Find</button>
      </form>

      {error && <div className='alert alert-danger'>{error}</div>}

      {reservations.length > 0 ? (
        <ul>
          {reservations.map((reservation) => (
            <li key={reservation.reservation_id}>
              {reservation.first_name} {reservation.last_name} -{' '}
              {reservation.mobile_number}
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
