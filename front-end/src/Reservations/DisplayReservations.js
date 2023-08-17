import React from 'react';
import { Link } from 'react-router-dom';

function DisplayReservations({ reservations, handleCancel }) {
  return (
    <div className='container mt-3'>
      <h2 className='font-weight-bold mb-3 text-center'>Reservations</h2>
      {reservations.length ? (
        <div className='row justify-content-center'>
          {reservations.map((reservation) => (
            <div
              key={reservation.reservation_id}
              className='col-lg-4 col-md-6 col-sm-12 mb-3'
            >
              <div className='card text-center' style={{ width: '100%' }}>
                <div className='card-body'>
                  <h5 className='card-title'>
                    {reservation.first_name} {reservation.last_name}
                  </h5>
                  <h6 className='card-subtitle mb-2 text-muted'>
                    {reservation.reservation_date}
                  </h6>
                  <p className='card-text'>
                    Mobile: {reservation.mobile_number}
                  </p>
                  <p className='card-text'>People: {reservation.people}</p>
                  <p
                    className='card-text'
                    data-reservation-id-status={reservation.reservation_id}
                  >
                    Status: {reservation.status}
                  </p>

                  {reservation.status === 'booked' && (
                    <>
                      <Link
                        to={`/reservations/${reservation.reservation_id}/seat`}
                      >
                        <button className='btn btn-primary'>Seat</button>
                      </Link>
                      <Link
                        to={`/reservations/${reservation.reservation_id}/edit`}
                      >
                        <button className='btn btn-secondary ml-2'>Edit</button>
                      </Link>
                      <button
                        data-reservation-id-cancel={reservation.reservation_id}
                        className='btn btn-danger ml-2'
                        onClick={() => handleCancel(reservation.reservation_id)}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='row justify-content-center'>
          <div className='col-lg-4 col-md-6 col-sm-12'>
            <div className='card text-center' style={{ width: '100%' }}>
              <div className='card-body'>
                <p className='card-text'>No reservations for selected date.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DisplayReservations;
