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
  const newReservation = req.body.data;
  const reservation = await service.create(newReservation);
  res.status(201).json({ data: reservation[0] });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: asyncErrorBoundary(create),
};
