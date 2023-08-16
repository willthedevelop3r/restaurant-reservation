/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */

import formatReservationDate from './format-reservation-date';
import formatReservationTime from './format-reservation-time';

let API_BASE_URL;

if (window.location.hostname === 'localhost') {
  API_BASE_URL = 'http://localhost:5001';
} else {
  API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
}

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append('Content-Type', 'application/json');

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();
    console.log('Raw payload from server:', payload);

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then((data) => {
      console.log('Data from fetchJson:', data);
      return data;
    })
    .then(formatReservationDate)
    .then((data) => {
      console.log('Data after formatReservationDate:', data);
      return data;
    })
    .then(formatReservationTime)
    .then((data) => {
      console.log('Data after formatReservationTime:', data);
      return data;
    });
}

export async function createReservation(formData, signal) {
  const response = await fetch(`${API_BASE_URL}/reservations`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ data: formData }),
    signal,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error);
  }

  return response.json().then((response) => response.data);
}

export async function createTable(formData, signal) {
  const response = await fetch(`${API_BASE_URL}/tables`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ data: formData }),
    signal,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error);
  }

  return response.json().then((response) => response.data);
}

export async function listTables(signal) {
  const response = await fetch(`${API_BASE_URL}/tables`, {
    method: 'GET',
    headers,
    signal,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error);
  }

  return response.json().then((response) => response.data);
}

export async function readReservation(reservation_id, signal) {
  const response = await fetch(
    `${API_BASE_URL}/reservations/${reservation_id}`,
    {
      method: 'GET',
      headers,
      signal,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error);
  }

  return response.json().then((response) => response.data);
}

export async function seatTable(table_id, reservation_id, signal) {
  const response = await fetch(`${API_BASE_URL}/tables/${table_id}/seat`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ data: { reservation_id: reservation_id } }),
    signal,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error);
  }

  return response.json().then((response) => response.data);
}

export async function finishTable(table_id, signal) {
  const response = await fetch(`${API_BASE_URL}/tables/${table_id}/seat`, {
    method: 'DELETE',
    headers,
    signal,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error);
  }
}

export async function searchReservationsByPhoneNumber(mobile_number, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/search`);
  url.searchParams.append('mobile_number', mobile_number);

  const response = await fetch(url, { headers, signal });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error);
  }

  return response
    .json()
    .then((response) => response.data)
    .then(formatReservationDate)
    .then(formatReservationTime);
}

export async function updateReservationStatus(reservation_id, status, signal) {
  const response = await fetch(
    `${API_BASE_URL}/reservations/${reservation_id}/status`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify({ data: { status: status } }),
      signal,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error);
  }

  return response.json().then((response) => response.data);
}

export async function updateReservation(reservation_id, updatedData, signal) {
  const response = await fetch(
    `${API_BASE_URL}/reservations/${reservation_id}`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify({ data: updatedData }),
      signal,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error);
  }

  return response.json().then((response) => response.data);
}
