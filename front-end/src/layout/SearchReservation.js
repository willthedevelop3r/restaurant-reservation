import React, { useState } from 'react';
import { searchReservationsByPhoneNumber } from '../utils/api';

function SearchReservation() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    searchReservationsByPhoneNumber(mobileNumber)
      .then(setReservations)
      .catch((err) => setError(err.message));
  };

  const handleInputChange = (e) => {
    setMobileNumber(e.target.value);
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

      {error && <div className='alert alert-danger'>{error}</div>}

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
