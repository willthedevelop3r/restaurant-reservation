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
  return knex('reservations')
    .insert(newReservation)
    .returning('*')
    .then((createdReservation) => createdReservation[0]);
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

function search(mobile_number) {
  return knex('reservations')
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, '')}%`
    )
    .orderBy('reservation_date');
}

async function update(reservationId, updatedReservation) {
  return knex('reservations')
    .where({ reservation_id: reservationId })
    .update(updatedReservation, '*')
    .then((updatedRecords) => updatedRecords[0]);
}

module.exports = {
  list,
  listByDate,
  create,
  readReservation,
  updateStatus,
  search,
  update,
};
