const knex = require('../db/connection');

function list() {
  return knex('tables').select('*').orderBy('table_name', 'asc');
}

function readTable(tableId) {
  return knex('tables').select('*').where({ table_id: tableId }).first();
}

function create(newTable) {
  return knex('tables').insert(newTable).returning('*');
}

function seatReservation(tableId, reservationId) {
  return knex.transaction(async (trx) => {
    await knex('tables')
      .where({ table_id: tableId })
      .update({ reservation_id: reservationId })
      .transacting(trx);
  });
}

module.exports = {
  list,
  readTable,
  create,
  seatReservation,
};
