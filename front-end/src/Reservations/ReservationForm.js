import React from 'react';

const ReservationForm = ({
  formData,
  handleInputChange,
  handleSubmit,
  handleCancel,
}) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type='text'
            name='first_name'
            value={formData.first_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type='text'
            name='last_name'
            value={formData.last_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Mobile Number:</label>
          <input
            type='text'
            name='mobile_number'
            value={formData.mobile_number}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Reservation Date:</label>
          <input
            type='date'
            name='reservation_date'
            value={formData.reservation_date}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Reservation Time:</label>
          <input
            type='time'
            name='reservation_time'
            value={formData.reservation_time}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Number of People:</label>
          <input
            type='number'
            name='people'
            value={formData.people}
            onChange={handleInputChange}
            min='1'
            required
          />
        </div>
        <button type='submit'>Submit</button>
        <button type='button' onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;
