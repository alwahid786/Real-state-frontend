/**
 * Call analyze-selected-stream endpoint and parse Server-Sent Events.
 * @param {string} baseUrl - API base URL (e.g. http://localhost:4000/api)
 * @param {string} token - Bearer token
 * @param {Object} body - { propertyId, selectedCompIds, maoInputs, subjectImages }
 * @param {function(Object): void} onProgress - Called for each SSE event (step or complete)
 * @returns {Promise<Object>} Resolves with the full response (success, message, data) when type is 'complete'
 */
export async function analyzeSelectedCompsStream(baseUrl, token, body, onProgress) {
  const url = `${baseUrl}/comps/analyze-selected-stream`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = new Error(res.statusText || "Analysis request failed");
    err.status = res.status;
    try {
      const data = await res.json();
      err.data = data;
    } catch (_) {}
    throw err;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  return new Promise((resolve, reject) => {
    const processChunk = () => {
      reader.read().then(({ done, value }) => {
        if (done) {
          if (buffer.trim()) {
            try {
              const ev = JSON.parse(buffer.trim());
              if (ev.type === "complete") {
                resolve(ev);
              }
              onProgress(ev);
            } catch (_) {}
          }
          resolve(null);
          return;
        }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (line.startsWith("data:")) {
            try {
              const ev = JSON.parse(line.slice(5).trim());
              if (ev.type === "complete") {
                reader.cancel();
                resolve(ev);
                return;
              }
              onProgress(ev);
            } catch (_) {}
          }
        }
        processChunk();
      }).catch(reject);
    };
    processChunk();
  });
}
