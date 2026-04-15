import { apiUrl } from "./index";

const getJsonIfPossible = async (response) => {
  const isJson = (response.headers.get("content-type") || "").includes(
    "application/json",
  );
  return isJson ? response.json() : null;
};

const buildAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

export async function fetchMyPaintings(token) {
  const response = await fetch(apiUrl("/api/paintings"), {
    headers: buildAuthHeaders(token),
  });

  const data = await getJsonIfPossible(response);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to load paintings");
  }

  return data;
}

export async function uploadPainting({
  token,
  title,
  imageBlob,
  filename = "painting.png",
}) {
  const formData = new FormData();
  if (typeof title === "string" && title.trim()) {
    formData.append("title", title.trim());
  }
  formData.append("image", imageBlob, filename);

  const response = await fetch(apiUrl("/api/paintings"), {
    method: "POST",
    headers: buildAuthHeaders(token),
    body: formData,
  });

  const data = await getJsonIfPossible(response);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to upload painting");
  }

  return data;
}

export async function deletePainting({ token, paintingId }) {
  const response = await fetch(apiUrl(`/api/paintings/${paintingId}`), {
    method: "DELETE",
    headers: buildAuthHeaders(token),
  });

  const data = await getJsonIfPossible(response);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to delete painting");
  }

  return data;
}

export async function renamePainting({ token, paintingId, title }) {
  const response = await fetch(apiUrl(`/api/paintings/${paintingId}`), {
    method: "PATCH",
    headers: {
      ...buildAuthHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  const data = await getJsonIfPossible(response);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to rename painting");
  }

  return data;
}
