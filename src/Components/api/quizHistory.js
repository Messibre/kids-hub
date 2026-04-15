import { apiUrl } from "./index";

const getJsonIfPossible = async (response) => {
  const isJson = (response.headers.get("content-type") || "").includes(
    "application/json",
  );
  return isJson ? response.json() : null;
};

const buildAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

export async function createQuizHistory({
  token,
  category,
  numberQuestionsDid,
  numberQuestionsGot,
}) {
  const response = await fetch(apiUrl("/api/quiz-history"), {
    method: "POST",
    headers: buildAuthHeaders(token),
    body: JSON.stringify({
      category,
      numberQuestionsDid,
      numberQuestionsGot,
    }),
  });

  const data = await getJsonIfPossible(response);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to save quiz history");
  }

  return data;
}

export async function fetchMyBestQuizStats(token) {
  const response = await fetch(apiUrl("/api/quiz-history/me/best"), {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await getJsonIfPossible(response);

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }

    throw new Error(data?.message || "Failed to fetch best quiz stats");
  }

  return data;
}

export async function fetchMyOverallRank(token) {
  const response = await fetch(apiUrl("/api/quiz-history/me/rank"), {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await getJsonIfPossible(response);

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }

    throw new Error(data?.message || "Failed to fetch ranking");
  }

  return data;
}

export async function fetchMyQuizHistory(token, category) {
  const query =
    typeof category === "string" && category.trim()
      ? `?category=${encodeURIComponent(category.trim())}`
      : "";

  const response = await fetch(apiUrl(`/api/quiz-history/me${query}`), {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await getJsonIfPossible(response);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch quiz history");
  }

  return Array.isArray(data) ? data : [];
}
