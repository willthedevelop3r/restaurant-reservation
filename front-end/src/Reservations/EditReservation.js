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

  const handleSubmit = (e) => {
    e.preventDefault();

    const abortController = new AbortController();

    // Call the api function
    updateReservation(reservation_id, formData, abortController.signal)
      .then((updatedReservation) => {
        // Access the date only from Date object
        const dateOnly = new Date(updatedReservation.reservation_date)
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
    <div>
      <h2>Edit Reservation</h2>
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
