const service = require('./reservations.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

async function list(req, res) {
  const { date } = req.query;

  const data = date ? await service.listByDate(date) : await service.list();

  res.json({ data: data });
}

async function create(req, res) {
  console.log('Request body:', req.body);

  if (!req.body.data) {
    return res.status(400).json({ error: 'Request body must include data.' });
  }

  const { reservation_date, reservation_time, people } = req.body.data;

  const requiredFields = [
    'first_name',
    'last_name',
    'mobile_number',
    'reservation_date',
    'reservation_time',
    'people',
  ];

  for (const field of requiredFields) {
    if (!req.body.data[field])
      return res.status(400).json({ error: `${field} is required.` });
  }

  if (typeof people !== 'number') {
    return res
      .status(400)
      .json({ error: 'Number of people must be a valid number.' });
  }

  // Validation check for reservation_date
  if (isNaN(Date.parse(reservation_date))) {
    return res.status(400).json({ error: 'Invalid reservation_date.' });
  }

  // Check if the reservation date falls on a Tuesday
  const reservationDate = new Date(reservation_date);
  if (reservationDate.getUTCDay() === 2) {
    return res.status(400).json({ error: 'Restaurant is closed on Tuesdays.' });
  }

  // Parsing reservation_time
  const reservationTime = reservation_time.split(':');
  const reservationHours = Number(reservationTime[0]);
  const reservationMinutes = Number(reservationTime[1]);

  // Check if the reservation time is before 10:30 AM
  if (
    reservationHours < 10 ||
    (reservationHours === 10 && reservationMinutes < 30)
  ) {
    return res
      .status(400)
      .json({ error: 'Reservation time must be after 10:30 AM.' });
  }

  // Check if the reservation time is after 9:30 PM
  if (
    (reservationHours === 21 && reservationMinutes > 30) ||
    reservationHours > 21
  ) {
    return res
      .status(400)
      .json({ error: 'Reservation time must be before 9:30 PM.' });
  }

  // Combine reservation date and time for complete date object
  const reservationDateTime = new Date(
    `${reservation_date}T${reservation_time}`
  );
  const now = new Date();

  // Check if the reservation date and time are in the past
  if (reservationDateTime <= now) {
    return res
      .status(400)
      .json({ error: 'Reservation date and time must be in the future.' });
  }

  // Validation check for reservation_time
  if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(reservation_time)) {
    return res.status(400).json({ error: 'Invalid reservation_time.' });
  }

  const data = await service.create(req.body.data);
  res.status(201).json({ data: data[0] });
}

async function read(req, res) {
  const reservationId = req.params.reservation_Id;
  const data = await service.readReservation(reservationId);

  if (!data) {
    return res
      .status(404)
      .json({ error: `Reservation not found: ${reservationId}` });
  }

  res.status(200).json({ data: data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: asyncErrorBoundary(create),
  read: asyncErrorBoundary(read),
};
