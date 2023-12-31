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

  // Regular expression pattern for a valid mobile number format
  const isValidMobileNumber = (number) =>
    /^(?:\d{3}-\d{3}-\d{4})$/.test(number);

  const handleSubmit = (e) => {
    e.preventDefault();
    const abortController = new AbortController();

    // Validate the mobile number before making the API call
    if (!isValidMobileNumber(formData.mobile_number)) {
      setError({
        message: 'Invalid mobile number.',
      });
      return; // Prevent form submission
    }

    // Call the API function
    createReservation(formData, abortController.signal)
      .then((reservation) => {
        // Reset the form after successful submission
        setFormData(defaultFormData);
        // Access the date only from Date object
        const dateOnly = new Date(reservation.reservation_date)
          .toISOString()
          .split('T')[0];
        history.push(`/dashboard?date=${dateOnly}`); // Redirect to the dashboard page for the reservation date
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setError(error);
        }
      });

    return () => abortController.abort(); // Cleanup the AbortController
  };

  return (
    <div className='d-flex flex-column align-items-center'>
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
