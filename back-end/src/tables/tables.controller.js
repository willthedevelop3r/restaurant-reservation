const service = require('./tables.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const reservationsService = require('../reservations/reservations.service');

async function list(req, res) {
  const data = await service.list();
  res.json({ data: data });
}

async function read(req, res) {
  const tableId = req.params.table_id;
  const data = await service.readTable(tableId);

  // Check if table exist
  if (!data) {
    return res.status(404).json({ error: `Table not found: ${tableId}` });
  }

  res.status(200).json({ data: data });
}

async function create(req, res) {
  if (!req.body.data) return res.status(400).json({ error: 'Data is missing' });

  const { table_name, capacity } = req.body.data;

  // Validations for table_name
  if (!table_name || table_name === '' || table_name.length < 2) {
    return res
      .status(400)
      .json({ error: 'table_name must be at least 2 characters long' });
  }

  // Validation
  if (capacity === undefined) {
    return res.status(400).json({ error: 'capacity is missing' });
  }

  // Validation
  if (capacity === 0) {
    return res.status(400).json({ error: 'capacity cannot be zero' });
  }

  // Validation
  if (typeof capacity !== 'number') {
    return res.status(400).json({ error: 'capacity must be a number' });
  }

  const data = await service.create(req.body.data);
  res.status(201).json({ data: data[0] });
}

async function seat(req, res) {
  const tableId = req.params.table_id;

  // Validation
  if (!req.body.data) {
    return res.status(400).json({ error: 'Data is required.' });
  }

  const { reservation_id: reservationId } = req.body.data;

  // Validation
  if (!reservationId) {
    return res.status(400).json({ error: 'reservation_id is required.' });
  }

  // Check if the reservation exists
  const reservation = await reservationsService.readReservation(reservationId);
  if (!reservation) {
    return res
      .status(404)
      .json({ error: `Reservation not found: ${reservationId}` });
  }

  // Check if the reservation is already seated
  if (reservation.status === 'seated') {
    return res.status(400).json({ error: 'Reservation is already seated.' });
  }

  // Check if the table is occupied
  const table = await service.readTable(tableId);
  if (table.reservation_id) {
    return res.status(400).json({ error: 'Table is already occupied.' });
  }

  // Check if the table has sufficient capacity for the reservation
  if (table.capacity < reservation.people) {
    return res.status(400).json({
      error: `Table's capacity of ${table.capacity} cannot accommodate the reservation for ${reservation.people} people.`,
    });
  }

  // Seat the reservation at the table
  const data = await service.seatReservation(tableId, reservationId);

  // Update the reservation status to 'seated'
  await reservationsService.updateStatus(reservationId, 'seated');

  res.status(200).json({ data: data });
}

async function finish(req, res) {
  const { table_id } = req.params;
  const table = await service.readTable(table_id);

  // Check if the table exists
  if (!table) {
    return res.status(404).json({ error: `Table not found: ${table_id}` });
  }

  // Check if table is occupied by reservation_id
  if (!table.reservation_id) {
    return res.status(400).json({ error: 'The table is not occupied.' });
  }

  await service.finishTable(table_id);
  res.sendStatus(200);
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: asyncErrorBoundary(create),
  read: asyncErrorBoundary(read),
  seat: asyncErrorBoundary(seat),
  finish: asyncErrorBoundary(finish),
};
