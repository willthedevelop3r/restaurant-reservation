import React, { useState } from 'react';
import { createReservation } from '../utils/api';
import { useHistory } from 'react-router-dom';
import ReservationForm from './ReservationForm';
import ErrorAlert from '../layout/ErrorAlert';

const NewReservation = () => {
  const defaultFormData = {
    first_name: '',
    last_name: '',
    mobile_number: '',
    reservation_date: '',
    reservation_time: '',
    people: 1,
  };
  const [formData, setFormData] = useState(defaultFormData);
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
    console.log('formData: ', formData);
    // Call the API function
    createReservation(formData, abortController.signal)
      .then((reservation) => {
        // Reset the form after successful submission
        setFormData(defaultFormData);

        history.push(`/dashboard?date=${reservation.reservation_date}`); // Redirect to the dashboard page for the reservation date
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setError(error);
        }
      });

    return () => abortController.abort(); // Cleanup the AbortController
  };

  return (
    <div>
      <h2 className='text-center font-weight-bold mt-5'>
        Create a New Reservation
      </h2>
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
