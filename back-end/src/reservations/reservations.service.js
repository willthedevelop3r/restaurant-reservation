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

module.exports = {
  list,
  listByDate,
  create,
};
