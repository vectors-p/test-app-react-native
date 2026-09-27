const API_URL = process.env.EXPO_PUBLIC_API_URL;
export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

export async function getMe(token: string) {
  const response = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Not authenticated");
  }

  return response.json();
}

export async function getDashboard(token: string) {
  const response = await fetch(`${API_URL}/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to load dashboard");
  }

  return response.json();
}

export async function getMuscleGroups(token: string) {
  const res = await fetch(`${API_URL}/muscle-groups`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  return res.json();
}

export async function getExercisesForGroup(token: string, groupId: number) {
  const res = await fetch(`${API_URL}/muscle-groups/${groupId}/exercises`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  return res.json();
}

export async function getRecommendation(token: string, exerciseId: number) {
  const res = await fetch(`${API_URL}/exercises/${exerciseId}/recommendation`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  return res.json();
}

export async function createSession(token: string) {
  const res = await fetch(`${API_URL}/sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  return res.json();
}

export async function addExerciseToSession(
  token: string,
  sessionId: number,
  exerciseId: number,
) {
  const res = await fetch(`${API_URL}/sessions/${sessionId}/exercises`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ exercise_id: exerciseId }),
  });
  return res.json();
}

export async function logSet(
  token: string,
  sessionExerciseId: number,
  reps: number,
  weight: number,
) {
  const res = await fetch(
    `${API_URL}/session-exercises/${sessionExerciseId}/sets`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reps, weight }),
    },
  );
  return res.json();
}

export async function getSessions(token: string) {
  const res = await fetch(`${API_URL}/sessions`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  if (!res.ok) throw new Error("Failed to load workout history");
  return res.json();
}

export async function finishSession(token: string, sessionId: number) {
  const res = await fetch(`${API_URL}/sessions/${sessionId}/finish`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  return { ok: res.ok, ...data };
}
