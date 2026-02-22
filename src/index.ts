import http from "node:http";

const PORT = Number(process.env.PORT) || 3000;

interface Voice {
  id: string;
  name: string;
  language: string;
  style: string;
}

const voices: Voice[] = [
  { id: "v1", name: "Aria", language: "en-US", style: "conversational" },
  { id: "v2", name: "Luna", language: "en-GB", style: "narrative" },
  { id: "v3", name: "Kai", language: "ja-JP", style: "formal" },
];

const json = (res: http.ServerResponse, status: number, data: unknown) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url!, `http://${req.headers.host}`);

  if (url.pathname === "/healthz") {
    return json(res, 200, { status: "ok" });
  }

  if (url.pathname === "/api/voices" && req.method === "GET") {
    return json(res, 200, { voices });
  }

  if (url.pathname.startsWith("/api/voices/") && req.method === "GET") {
    const id = url.pathname.split("/").pop();
    const voice = voices.find((v) => v.id === id);
    if (voice) return json(res, 200, voice);
    return json(res, 404, { error: "Voice not found" });
  }

  json(res, 404, { error: "Not found" });
});

server.listen(PORT, () => {
  console.log(`voice-manager listening on :${PORT}`);
});
