const knex = require('../db/connection');

function list() {
  return knex('tables').select('*').orderBy('table_name', 'asc');
}

function read(tableId) {
  return knex('tables').select('*').where({ table_id: tableId }).first();
}

function create(newTable) {
  return knex('tables').insert(newTable).returning('*');
}

module.exports = {
  list,
  read,
  create,
};
