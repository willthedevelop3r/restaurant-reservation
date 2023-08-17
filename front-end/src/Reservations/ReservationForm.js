import React from 'react';

const ReservationForm = ({
  formData,
  handleInputChange,
  handleSubmit,
  handleCancel,
}) => {
  return (
    <div className='container mt-4'>
      <form
        onSubmit={handleSubmit}
        className='mx-auto'
        style={{ maxWidth: '500px' }}
      >
        <div className='form-group'>
          <label htmlFor='first_name'>First Name:</label>
          <input
            type='text'
            name='first_name'
            id='first_name'
            value={formData.first_name}
            onChange={handleInputChange}
            required
            className='form-control rounded'
          />
        </div>

        <div className='form-group'>
          <label htmlFor='last_name'>Last Name:</label>
          <input
            type='text'
            name='last_name'
            id='last_name'
            value={formData.last_name}
            onChange={handleInputChange}
            required
            className='form-control rounded'
          />
        </div>

        <div className='form-group'>
          <label htmlFor='mobile_number'>Mobile Number:</label>
          <input
            type='text'
            name='mobile_number'
            id='mobile_number'
            value={formData.mobile_number}
            onChange={handleInputChange}
            required
            className='form-control rounded'
          />
        </div>

        <div className='form-group'>
          <label htmlFor='reservation_date'>Reservation Date:</label>
          <input
            type='date'
            name='reservation_date'
            id='reservation_date'
            value={formData.reservation_date}
            onChange={handleInputChange}
            required
            className='form-control rounded'
          />
        </div>

        <div className='form-group'>
          <label htmlFor='reservation_time'>
            Enter Reservation in Central Time:
          </label>
          <input
            type='time'
            name='reservation_time'
            id='reservation_time'
            value={formData.reservation_time}
            onChange={handleInputChange}
            required
            className='form-control rounded'
          />
        </div>

        <div className='form-group'>
          <label htmlFor='people'>Number of People:</label>
          <input
            type='number'
            name='people'
            id='people'
            value={formData.people}
            onChange={handleInputChange}
            min='1'
            required
            className='form-control rounded'
          />
        </div>

        <div className='form-group d-flex justify-content-end'>
          <button type='submit' className='btn btn-primary rounded-pill mr-2'>
            Submit
          </button>
          <button
            type='button'
            onClick={handleCancel}
            className='btn btn-secondary rounded-pill'
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReservationForm;
