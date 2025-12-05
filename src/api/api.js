const BASE_URL = 'http://localhost:5000';
const ML_URL = 'http://localhost:8000';

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
    // return error with message so caller can display inline feedback instead of alert
    return { error: true, data: null, message: responseJson.message };
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
    return { error: true, message: responseJson.message };
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
    return { error: true, data: null, message: responseJson.message };
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
    return { error: true, message: responseJson.message };
  }

  return { error: false };
}

async function getCustomers(token,
  {
    page = 1,
    pageSize = 10,
    search = "",
    filters = {}
  } = {}
) {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("pageSize", pageSize);

  if (search && search.trim() !== "") {
    params.append("search", search.trim());
  }

  if (filters && Object.keys(filters).length > 0) {
    params.append("filters", JSON.stringify(filters));
  }

  const response = await fetchWithToken(
    `${BASE_URL}/private/customers?${params.toString()}`,
    token
  );

  const responseJson = await response.json();  

  if (responseJson.status !== "success") {
    console.error("API error:", responseJson);
    return {
      customers: [],
      totalPages: 1,
      totalItems: 0,
      page: 1
    };
  }

  return {
    customers: responseJson.data.customers,
    totalPages: responseJson.data.totalPages,
    totalItems: responseJson.data.totalItems,
    page: responseJson.data.page
  };
}

async function addCustomer(token, payload) {
  const response = await fetchWithToken(`${BASE_URL}/private/customers`, token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const responseJson = await response.json();

  if (responseJson.status !== 'success') {
    console.error('API error:', responseJson);
    return { error: true };
  }

  return { error: false, data: responseJson.data };
}

async function getStatusColor(token, {key, value}) {
  
  const params = new URLSearchParams();

  params.append("key", key);
  params.append("value", value);

  const response = await fetchWithToken(
    `${BASE_URL}/private/customers/status?${params.toString()}`,
    token
  );

  const responseJson = await response.json();

  if (responseJson.status !== "success") {
    console.error("API error:", responseJson);
    return 'bg-green-500';
  }
  
  return responseJson.data.statusColor;
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
    return { error: true, message: responseJson.message };
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
    return { error: true, message: responseJson.message };
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
    return { error: true, message: responseJson.message };
  }

  return { error: false };
}

async function calculateProbability(customer) {
  const response = await fetch(`${ML_URL}/nasabah/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customer),
  })

  const responseJson = await response.json();

  if (responseJson.status !== 'success') {
    return { error: true, message: responseJson.message };
  }

  return { error: false, predicted: responseJson.data.predicted };
}

async function updateCustomerProbability(token, { id, probability }) {
  const response = await fetchWithToken(`${BASE_URL}/private/customers/probability/${id}`, token, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ probability }),
  });

  const responseJson = await response.json();

  if (responseJson.status !== 'success') {
    return { error: true, message: responseJson.message };
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
  addCustomer,
  getStatusColor,
  getDashboard,
  addNote,
  editNote,
  deleteNote,
  calculateProbability,
  updateCustomerProbability
};