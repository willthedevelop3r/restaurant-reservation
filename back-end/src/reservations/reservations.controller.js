/**
 * List handler for reservation resources
 */
const service = require('./reservations.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

async function list(req, res) {
  const { date } = req.query;

  const reservations = date
    ? await service.listByDate(date)
    : await service.list();

  res.json({ data: reservations });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data: data[0] });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: asyncErrorBoundary(create),
};
