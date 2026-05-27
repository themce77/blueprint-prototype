export async function onRequest(context) {
  const { request, next, env } = context;
  const password = env.CFP_PASSWORD || "blueprintwidelab123!";

  const cookie = request.headers.get("Cookie") || "";
  if (cookie.includes("cfp_auth=true")) {
    return next();
  }

  if (request.method === "POST") {
    const formData = await request.formData();
    if (formData.get("password") === password) {
      const response = await next();
      const newResponse = new Response(response.body, response);
      newResponse.headers.append("Set-Cookie", "cfp_auth=true; Path=/; Max-Age=604800");
      return newResponse;
    }
  }

  return new Response(`
    <html><body style="font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;background:#f5f5f5">
    <form method="POST" style="background:white;padding:2rem;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1)">
      <h2 style="margin-top:0">Enter password</h2>
      <input type="password" name="password" placeholder="Password" style="display:block;width:100%;padding:8px;margin-bottom:1rem;box-sizing:border-box;border:1px solid #ddd;border-radius:4px">
      <button type="submit" style="width:100%;padding:8px;background:#0051c3;color:white;border:none;border-radius:4px;cursor:pointer">Enter prototype</button>
    </form></body></html>
  `, { headers: { "Content-Type": "text/html" } });
}
