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
    if (!req.body.data[field]) {
      return res.status(400).json({ error: `${field} is required.` });
    }
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

  // Check if the reservation date is in the past
  const reservationDate = new Date(reservation_date);
  const today = new Date();
  if (reservationDate < today) {
    return res
      .status(400)
      .json({ error: 'Reservation date must be in the future.' });
  }

  // Check if the reservation date falls on a Tuesday
  if (reservationDate.getUTCDay() === 2) {
    return res.status(400).json({ error: 'Restaurant is closed on Tuesdays.' });
  }

  // Validation check for reservation_time
  if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(reservation_time)) {
    return res.status(400).json({ error: 'Invalid reservation_time.' });
  }

  const data = await service.create(req.body.data);
  res.status(201).json({ data: data[0] });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: asyncErrorBoundary(create),
};
