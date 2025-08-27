

export async function handleLoginFunc(email: string, password: string) {
  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error during email verification request:", error);
  }
}

export default {
  handleLoginFunc,
}