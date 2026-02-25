document.addEventListener("DOMContentLoaded", () => {
  // SIGN UP
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const payload = {
        first_name: document.getElementById("firstname")?.value.trim(),
        last_name: document.getElementById("lastname")?.value.trim(),
        nickname: document.getElementById("nickname")?.value.trim(),
        email: document.getElementById("email")?.value.trim(),
        password: document.getElementById("password")?.value
      };

      try {
        const res = await fetch("/create-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          alert("Account created!");
          window.location.href = "feed.html";
        } else {
          const msg = await res.text();
          alert("Sign up failed: " + msg);
        }
      } catch (err) {
        alert("Network error: " + err.message);
      }
    });
  }

  // LOG IN
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      const email = document.getElementById("loginEmail")?.value.trim();
      const password = document.getElementById("loginPassword")?.value;

      try {
        const res = await fetch("/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.success) {
          window.location.href = "feed.html";
        } else {
          alert("Wrong email or password");
        }
      } catch (err) {
        alert("Network error: " + err.message);
      }
    });
  }
});