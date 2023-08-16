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

// Update the 'tables' table to associate the specified reservation with the table.
function seatReservation(tableId, reservationId) {
  return knex.transaction(async (trx) => {
    await knex('tables')
      .where({ table_id: tableId })
      .update({ reservation_id: reservationId })
      .transacting(trx);
  });
}

function finishTable(tableId) {
  return knex.transaction(async (trx) => {
    const table = await trx('tables')
      .select('*')
      .where({ table_id: tableId })
      .first();

    // Update the status of the associated reservation to "finished"
    await trx('reservations')
      .where({ reservation_id: table.reservation_id })
      .update({ status: 'finished' });

    // Free up the table by setting its reservation_id to null
    await trx('tables')
      .where({ table_id: tableId })
      .update({ reservation_id: null });
  });
}

module.exports = {
  list,
  readTable,
  create,
  seatReservation,
  finishTable,
};
