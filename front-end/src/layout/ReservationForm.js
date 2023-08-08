import React, { useState } from 'react';

const ReservationForm = () => {
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
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Need to handle form submission
    console.log(formData);
    // Reset the form after submission
    setFormData({
      first_name: '',
      last_name: '',
      mobile_number: '',
      reservation_date: '',
      reservation_time: '',
      people: 1,
    });
  };

  return (
    <div>
      <h2>Create a New Reservation</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type='text'
            name='first_name'
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type='text'
            name='last_name'
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Mobile Number:</label>
          <input
            type='text'
            name='mobile_number'
            value={formData.mobile_number}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Reservation Date:</label>
          <input
            type='date'
            name='reservation_date'
            value={formData.reservation_date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Reservation Time:</label>
          <input
            type='time'
            name='reservation_time'
            value={formData.reservation_time}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Number of People:</label>
          <input
            type='number'
            name='people'
            value={formData.people}
            onChange={handleChange}
            min='1'
            required
          />
        </div>
        <button>Submit</button>
        <button>Cancel</button>
      </form>
    </div>
  );
};

export default ReservationForm;
