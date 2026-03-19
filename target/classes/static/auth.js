const storedUser = localStorage.getItem("expenseTrackerUser");

if (storedUser && (window.location.pathname.endsWith("/") || window.location.pathname.endsWith("index.html"))) {
    window.location.href = "dashboard.html";
}

function setMessage(element, message, type) {
    element.textContent = message;
    element.className = `form-message ${type}`;
}

async function sendJson(url, payload) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.message || data.error || "Request failed.");
    }

    return data;
}

function bindLoginForm() {
    const form = document.getElementById("loginForm");
    if (!form) {
        return;
    }

    const button = document.getElementById("loginBtn");
    const message = document.getElementById("loginMessage");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        button.disabled = true;
        button.textContent = "Logging in...";
        setMessage(message, "", "");

        try {
            const user = await sendJson("/auth/login", {
                email: document.getElementById("loginEmail").value.trim(),
                password: document.getElementById("loginPassword").value
            });

            localStorage.setItem("expenseTrackerUser", JSON.stringify(user));
            window.location.href = "dashboard.html";
        } catch (error) {
            setMessage(message, error.message, "error");
        } finally {
            button.disabled = false;
            button.textContent = "Login";
        }
    });
}

function bindRegisterForm() {
    const form = document.getElementById("registerForm");
    if (!form) {
        return;
    }

    const button = document.getElementById("registerBtn");
    const message = document.getElementById("registerMessage");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        button.disabled = true;
        button.textContent = "Creating...";
        setMessage(message, "", "");

        try {
            const user = await sendJson("/auth/register", {
                name: document.getElementById("registerName").value.trim(),
                email: document.getElementById("registerEmail").value.trim(),
                password: document.getElementById("registerPassword").value
            });

            localStorage.setItem("expenseTrackerUser", JSON.stringify(user));
            window.location.href = "dashboard.html";
        } catch (error) {
            setMessage(message, error.message, "error");
        } finally {
            button.disabled = false;
            button.textContent = "Create Account";
        }
    });
}

bindLoginForm();
bindRegisterForm();
