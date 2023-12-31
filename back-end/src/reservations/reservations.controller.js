const service = require('./reservations.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

async function list(req, res) {
  const { date, mobile_number } = req.query;

  // Handle search by mobile_number
  if (mobile_number) {
    const data = await service.search(mobile_number);
    return res.json({ data: data });
  }

  // If date is present render list by date
  const data = date ? await service.listByDate(date) : await service.list();
  res.json({ data: data });
}

function validateDataExists(req, res, next) {
  if (!req.body.data) {
    return res.status(400).json({ error: 'Request body must include data.' });
  }
  next();
}

async function validateIfReservationExists(req, res, next) {
  const reservationId = req.params.reservation_id;
  const data = await service.readReservation(reservationId);

  if (!data) {
    return res
      .status(404)
      .json({ error: `Reservation not found: ${reservationId}` });
  }

  next();
}

function validateRequiredFields(req, res, next) {
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
  next();
}

function validatePeopleCount(req, res, next) {
  const { people } = req.body.data;

  if (typeof people !== 'number') {
    return res
      .status(400)
      .json({ error: 'Number of people must be a valid number.' });
  }

  next();
}

function validateReservationDate(req, res, next) {
  const { reservation_date } = req.body.data;

  // Check if the 'reservation_date' is a valid date string.
  // The 'Date.parse()' function will return NaN if it cannot parse the input.
  if (isNaN(Date.parse(reservation_date))) {
    return res.status(400).json({ error: 'Invalid reservation_date.' });
  }

  const reservationDate = new Date(reservation_date);

  // Checks if day falls on a Tuesday
  if (reservationDate.getUTCDay() === 2) {
    return res.status(400).json({ error: 'Restaurant is closed on Tuesdays.' });
  }

  next();
}

function validateReservationTime(req, res, next) {
  const { reservation_time, reservation_date } = req.body.data;

  // Validation check for reservation_time format
  const isValidFormat = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/.test(
    reservation_time
  );
  if (!isValidFormat) {
    return res.status(400).json({ error: 'Invalid reservation_time.' });
  }

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

  // Combine reservation date and time for a complete date object
  const reservationDateTime = new Date(
    `${reservation_date}T${reservation_time}Z`
  );

  // Adjust for Central Time to UTC (add 5 hours)
  reservationDateTime.setHours(reservationDateTime.getHours() + 5);

  const now = new Date();

  // Convert both dates to UTC and compare
  if (reservationDateTime.getTime() < now.getTime()) {
    return res
      .status(400)
      .json({ error: 'Reservation date and time must be in the future.' });
  }

  next();
}

function validateReservationStatus(req, res, next) {
  if (['seated', 'finished'].includes(req.body.data.status)) {
    return res.status(400).json({
      error: `Reservation cannot be created with status: ${req.body.data.status}`,
    });
  }

  next();
}

function validateUpdateReservationTime(req, res, next) {
  const { reservation_time } = req.body.data;

  if (!reservation_time) {
    return next();
  }

  // Validation check for reservation_time format
  const isValidFormat = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/.test(
    reservation_time
  );
  if (!isValidFormat) {
    return res.status(400).json({ error: 'Invalid reservation_time.' });
  }

  next();
}

function validateMobileNumber(req, res, next) {
  const { mobile_number } = req.body.data;

  // Regular expression pattern for a valid mobile_number format
  const mobilePattern = /^\d{3}-\d{3}-\d{4}$/;

  if (!mobilePattern.test(mobile_number)) {
    return res.status(400).json({ error: 'Invalid mobile_number format.' });
  }

  next();
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data: data });
}

async function read(req, res) {
  const reservationId = req.params.reservation_id;
  const data = await service.readReservation(reservationId);

  if (!data) {
    return res
      .status(404)
      .json({ error: `Reservation not found: ${reservationId}` });
  }

  res.status(200).json({ data: data });
}

async function updateStatus(req, res) {
  const { status } = req.body.data;
  const { reservation_id } = req.params;

  const validStatuses = ['booked', 'seated', 'finished', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status: ${status}.` });
  }

  // If the reservation exists but its status is "finished"
  const currentReservation = await service.readReservation(reservation_id);
  if (currentReservation.status === 'finished') {
    return res.status(400).json({
      error: `Reservation with ID: ${reservation_id} has a status of "finished" and cannot be updated.`,
    });
  }

  const data = await service.updateStatus(reservation_id, status);
  res.json({ data: data });
}

async function search(req, res) {
  const { mobile_number } = req.query;

  if (!mobile_number) {
    return res.status(400).json({ error: 'mobile_number is required.' });
  }

  const data = await service.search(mobile_number);

  if (data.length === 0) {
    return res.status(404).json({ error: 'No reservations found.' });
  }

  res.json({ data: data });
}

async function update(req, res) {
  const reservationId = req.params.reservation_id;

  const updatedReservation = await service.update(reservationId, req.body.data);

  res.json({ data: updatedReservation });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    validateDataExists,
    validateRequiredFields,
    validatePeopleCount,
    validateMobileNumber,
    validateReservationDate,
    validateReservationTime,
    validateReservationStatus,
    asyncErrorBoundary(create),
  ],
  read: asyncErrorBoundary(read),
  updateStatus: [validateIfReservationExists, asyncErrorBoundary(updateStatus)],
  search: asyncErrorBoundary(search),
  update: [
    validateIfReservationExists,
    validateDataExists,
    validateRequiredFields,
    validatePeopleCount,
    validateReservationDate,
    validateUpdateReservationTime,
    asyncErrorBoundary(update),
  ],
};
