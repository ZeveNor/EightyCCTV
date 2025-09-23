
export async function handleEmailVerify(email: string) {
  try {
    const res = await fetch("http://localhost:3000/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    return data.message;
  } catch (error) {
    console.error("Error during email verification request:", error);
  }
}

export async function handleOtpVerify(email: string, otp: string) {
  try {

    const res = await fetch("http://localhost:3000/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp_code: otp }),
    });
    const data = await res.json();
    console.debug('[handleOtpVerify] data status:', data?.status ?? data?.result?.status ?? res.status);

    if (data && typeof data === 'object') {
      if (typeof data.status === 'number') return data.status;
      if (data.result && typeof data.result === 'object' && typeof data.result.status === 'number') return data.result.status;
      if (typeof data.result === 'number') return data.result;
    }

    return res.status;
  } catch (error) {
    console.error("Error during email verification request:", error);
  }
}

export async function handleRegister(
  name: string,
  surname: string,
  email: string,
  password: string,
  phoneNumber: string,
) {
  try {
    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        surname,
        email,
        password,
        telephone: phoneNumber,
      }),
    });
    if (res.ok) {
      window.location.href = "/login";
    } else {
      console.log("Register failed.");
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }
}

export default {
  handleEmailVerify,
  handleRegister,
  handleOtpVerify
}