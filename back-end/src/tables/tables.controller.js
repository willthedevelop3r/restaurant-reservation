const service = require('./tables.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

async function list(req, res) {
  const data = await service.list();
  res.json({ data: data });
}

async function read(req, res) {
  const tableId = req.params.table_id;
  const data = await service.read(tableId);

  if (!data) {
    return res.status(404).json({ error: `Table not found: ${tableId}` });
  }

  res.status(200).json({ data: data });
}

async function create(req, res) {
  if (!req.body.data) return res.status(400).json({ error: 'Data is missing' });

  const { table_name, capacity } = req.body.data;

  if (!table_name || table_name === '' || table_name.length < 2) {
    return res
      .status(400)
      .json({ error: 'table_name must be at least 2 characters long' });
  }

  if (capacity === undefined) {
    return res.status(400).json({ error: 'capacity is missing' });
  }

  if (capacity === 0) {
    return res.status(400).json({ error: 'capacity cannot be zero' });
  }

  if (typeof capacity !== 'number') {
    return res.status(400).json({ error: 'capacity must be a number' });
  }

  const data = await service.create(req.body.data);
  res.status(201).json({ data: data[0] });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: asyncErrorBoundary(create),
  read: asyncErrorBoundary(read),
};
