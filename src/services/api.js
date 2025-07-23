const BASE = "https://leaderboardbackend.netlify.app/";

export const fetchUsers = async (page = 1, limit = 10) => {
  const res = await fetch(`${BASE}/users?page=${page}&limit=${limit}`);
  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }
  return await res.json(); 
};

export const addUser = (user) =>
  fetch(`${BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  }).then(res => res.json());

export const claimPoints = (id) =>
  fetch(`${BASE}/users/${id}/claim`, { method: "POST" }).then(res => res.json());

export async function fetchHistory(page = 1, limit = 10) {
  const response = await fetch(`${BASE}/history?page=${page}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch history');
  }
  return response.json();
}


export const fetchRankedUsers = async (page = 1, limit = 10) => {
  const res = await fetch(`${BASE}/users/ranked?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch ranked users');
  return res.json(); 
};

export const updateRanks = () =>
  fetch(`${BASE}/users/ranks/update`, { method: "PUT" }).then(res => res.json());
