import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { readReservation, updateReservation } from '../utils/api';
import ReservationForm from './ReservationForm';
import ErrorAlert from '../layout/ErrorAlert';

const EditReservation = () => {
  const { reservation_id } = useParams();
  const history = useHistory();

  const defaultFormData = {
    first_name: '',
    last_name: '',
    mobile_number: '',
    reservation_date: '',
    reservation_time: '',
    people: 1,
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [error, setError] = useState(null); // To set any errors

  useEffect(() => {
    const abortController = new AbortController();

    // Call the api function
    readReservation(reservation_id, abortController.signal)
      .then((data) => {
        // Access the date only from Date object
        data.reservation_date = new Date(data.reservation_date)
          .toISOString()
          .split('T')[0];
        setFormData(data);
      })
      .catch((error) => setError(error));

    return () => abortController.abort(); // Cleanup the AbortController
  }, [reservation_id]);

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

  // To validate date
  const isDateInThePast = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only the date
    const selectedDate = new Date(dateString);
    return selectedDate < today;
  };

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

    // Validate if the date is in the past
    if (isDateInThePast(formData.reservation_date)) {
      setError({
        message: 'Reservation date cannot be in the past.',
      });
      return; // Prevent form submission
    }

    // Call the api function
    updateReservation(reservation_id, formData, abortController.signal)
      .then((updatedReservation) => {
        history.push(`/dashboard?date=${updatedReservation.reservation_date}`); // Redirect to the dashboard page for the reservation date
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
      <h2 className='text-center font-weight-bold mt-5'>Edit Reservation</h2>
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

export default EditReservation;
