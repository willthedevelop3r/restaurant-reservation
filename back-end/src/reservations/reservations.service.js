const knex = require('../db/connection');

function list() {
  return knex('reservations').select('*').orderBy('reservation_time', 'asc');
}

function listByDate(date) {
  return knex('reservations')
    .select('*')
    .where('reservation_date', date)
    .orderBy('reservation_time', 'asc');
}

function create(newReservation) {
  return knex('reservations').insert(newReservation).returning('*');
}

function read(reservationId) {
  return knex('reservations')
    .select('*')
    .where({ reservation_id: reservationId })
    .first();
}

module.exports = {
  list,
  listByDate,
  create,
  read,
};
