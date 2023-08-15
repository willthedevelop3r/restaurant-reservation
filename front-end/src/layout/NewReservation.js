import React, { useState } from 'react';
import { createReservation } from '../utils/api';
import { useHistory } from 'react-router-dom';
import ReservationForm from './ReservationForm';
import ErrorAlert from './ErrorAlert';

const NewReservation = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    mobile_number: '',
    reservation_date: '',
    reservation_time: '',
    people: 1,
  });
  const [error, setError] = useState(null);
  const history = useHistory();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'people' ? Number(value) : value,
    });
  };

  const handleCancel = () => {
    history.goBack();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const abortController = new AbortController();

    // Call the API function
    createReservation(formData, abortController.signal)
      .then((reservation) => {
        console.log('Reservation created:', reservation);

        // Reset the form after successful submission
        setFormData({
          first_name: '',
          last_name: '',
          mobile_number: '',
          reservation_date: '',
          reservation_time: '',
          people: 1,
        });

        // Redirect to the dashboard page for the reservation date
        const dateOnly = new Date(reservation.reservation_date)
          .toISOString()
          .split('T')[0];
        history.push(`/dashboard?date=${dateOnly}`);
      })
      .catch((error) => setError(error));
    return () => abortController.abort(); // Cleanup the AbortController
  };

  return (
    <div>
      <h2>Create a New Reservation</h2>
      <ErrorAlert error={error} />
      <ReservationForm
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      />
    </div>
  );
};

export default NewReservation;
