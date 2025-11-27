const BASE_URL = 'http://localhost:5000';

async function fetchWithToken(url, token, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

async function login({ username, password }) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    credentials: "include",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const responseJson = await response.json();

  if (responseJson.status !== 'success') {
    alert(responseJson.message);
    return { error: true, data: null };
  }

  return { error: false, data: responseJson.data };
}

async function getUserLogged(token) {
  const response = await fetchWithToken(`${BASE_URL}/private/users/me`, token);
  const responseJson = await response.json();

  if (responseJson.status !== 'success') {
    return { error: true, data: null };
  }

  return { error: false, data: responseJson.data };
}

async function refreshTokenRequest() {
  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "PUT",
    credentials: "include",
  });
  const responseJson = await response.json();
  return responseJson.data?.accessToken;
}

async function logout() {
  const response = await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  const responseJson = await response.json();
  
  if (responseJson.status !== 'success') {
    alert(responseJson.message);
    return { error: true };
  }

  return { error: false };
}

async function verifyUsername({ username }) {
  const response = await fetch(`${BASE_URL}/auth/uname`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  });
  const responseJson = await response.json();

  if (responseJson.status !== 'success') {
    alert(responseJson.message);
    return { error: true, data: null };
  }

  return { error: false, data: responseJson.data };
}

async function resetPassword({ username, password }) {
  const response = await fetch(`${BASE_URL}/auth/reset`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  const responseJson = await response.json();

  if (responseJson.status !== 'success') {
    alert(responseJson.message);
    return { error: true };
  }

  return { error: false };
}

async function getCustomers(token) {
    const response = await fetchWithToken(`${BASE_URL}/private/customers`, token);
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      console.error("API error:", responseJson);
      return [];
    }

    return responseJson.data.customers;
}

async function getDashboard(token) {
  const response = await fetchWithToken(`${BASE_URL}/private/dashboard`, token);
  const responseJson = await response.json();

  if (responseJson.status !== 'success') {
    console.error("API error:", responseJson);
    return [];
  }

  return responseJson.data.dashboard;
}

async function addNote(token, { title, body, createdAt, customerId, sales }) {
  const response = await fetchWithToken(`${BASE_URL}/private/notes`, token, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, body, createdAt, customerId, sales }),
  });

  const responseJson = await response.json();

  if (responseJson.status !== 'success') {
    alert(responseJson.message);
    return { error: true };
  }

  return { error: false };
}

async function editNote(token, id, { title, body }) {
  const response = await fetchWithToken(`${BASE_URL}/private/notes/${id}`, token, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, body }),
  });

  const responseJson = await response.json();

  if (responseJson.status !== 'success') {
    alert(responseJson.message);
    return { error: true };
  }

  return { error: false };
}

async function deleteNote(token, id) {
  const response = await fetchWithToken(`${BASE_URL}/private/notes/${id}`, token, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const responseJson = await response.json();

  if (responseJson.status !== 'success') {
    alert(responseJson.message);
    return { error: true };
  }

  return { error: false };
}

export {
  login,
  getUserLogged,
  refreshTokenRequest,
  logout,
  verifyUsername,
  resetPassword,
  getCustomers,
  getDashboard,
  addNote,
  editNote,
  deleteNote,
};