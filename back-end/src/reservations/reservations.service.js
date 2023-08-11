const knex = require('../db/connection');

function list() {
  return knex('reservations').select('*').orderBy('reservation_time', 'asc');
}

function listByDate(date) {
  return knex('reservations')
    .select('*')
    .where('reservation_date', date)
    .andWhere('status', '<>', 'finished')
    .orderBy('reservation_time', 'asc');
}

function create(newReservation) {
  return knex('reservations').insert(newReservation).returning('*');
}

function readReservation(reservationId) {
  return knex('reservations')
    .select('*')
    .where({ reservation_id: reservationId })
    .first();
}

async function updateStatus(reservation_id, status) {
  return knex('reservations')
    .where({ reservation_id })
    .update({ status }, '*')
    .then((updatedRecords) => updatedRecords[0]);
}

module.exports = {
  list,
  listByDate,
  create,
  readReservation,
  updateStatus,
};
