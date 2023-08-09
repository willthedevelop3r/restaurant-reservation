import React, { useState } from 'react';
import { createReservation } from '../utils/api';
import { useHistory } from 'react-router-dom';
import Form from './Form';

const CreateReservation = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    mobile_number: '',
    reservation_date: '',
    reservation_time: '',
    people: 1,
  });

  const handleChange = (e) => {
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
        history.push(`/dashboard?date=${reservation.reservation_date}`);
      })
      .catch((error) => {
        console.error('Error creating reservation:', error);
      });
    return () => abortController.abort(); // Cleanup the AbortController
  };

  return (
    <div>
      <h2>Create a New Reservation</h2>
      <Form
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      />
    </div>
  );
};

export default CreateReservation;
