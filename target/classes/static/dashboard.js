const savedUser = localStorage.getItem("expenseTrackerUser");

if (!savedUser) {
    window.location.href = "index.html";
}

const currentUser = JSON.parse(savedUser);

const profileText = document.getElementById("profileText");
const logoutBtn = document.getElementById("logoutBtn");
const deleteUserBtn = document.getElementById("deleteUserBtn");
const accountMessage = document.getElementById("accountMessage");

const categoryForm = document.getElementById("categoryForm");
const categoryNameInput = document.getElementById("categoryName");
const categoryBtn = document.getElementById("categoryBtn");
const categoryMessage = document.getElementById("categoryMessage");
const categoryList = document.getElementById("categoryList");
const categoryState = document.getElementById("categoryState");

const budgetForm = document.getElementById("budgetForm");
const budgetCategorySelect = document.getElementById("budgetCategory");
const budgetAmountInput = document.getElementById("budgetAmount");
const budgetBtn = document.getElementById("budgetBtn");
const budgetMessage = document.getElementById("budgetMessage");
const budgetList = document.getElementById("budgetList");
const budgetState = document.getElementById("budgetState");

const expenseForm = document.getElementById("expenseForm");
const expenseAmountInput = document.getElementById("expenseAmount");
const expenseDateInput = document.getElementById("expenseDate");
const expenseCategorySelect = document.getElementById("expenseCategory");
const expensePaymentMethodSelect = document.getElementById("expensePaymentMethod");
const expenseBtn = document.getElementById("expenseBtn");
const expenseMessage = document.getElementById("expenseMessage");
const expenseList = document.getElementById("expenseList");
const expenseState = document.getElementById("expenseState");

const totalSpent = document.getElementById("totalSpent");
const categoryCount = document.getElementById("categoryCount");
const budgetCount = document.getElementById("budgetCount");

let categories = [];
let budgets = [];
let expenses = [];
let paymentMethods = [];

function findBudgetByCategoryId(categoryId) {
    return budgets.find((budget) => budget.categoryId === Number(categoryId));
}

function formatCurrency(value) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2
    }).format(value);
}

function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

function setMessage(element, message, type) {
    element.textContent = message;
    element.className = `form-message ${type}`;
}

async function fetchJson(url, options = {}) {
    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || data.error || "Request failed.");
    }

    return data;
}

async function sendDelete(url) {
    const response = await fetch(url, { method: "DELETE" });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || data.error || "Request failed.");
    }
}

function populateCategorySelects() {
    const options = categories.length === 0
        ? '<option value="">Create a category first</option>'
        : categories.map((category) => `<option value="${category.categoryId}">${category.name}</option>`).join("");

    budgetCategorySelect.innerHTML = options;
    expenseCategorySelect.innerHTML = options;
    updateBudgetFormState();
}

function populatePaymentMethodSelect() {
    const options = paymentMethods.length === 0
        ? '<option value="">No payment methods available</option>'
        : paymentMethods.map((paymentMethod) => (
            `<option value="${paymentMethod.paymentId}">${paymentMethod.methodName}</option>`
        )).join("");

    expensePaymentMethodSelect.innerHTML = options;
}

function updateBudgetFormState() {
    if (!budgetCategorySelect.value) {
        budgetAmountInput.value = "";
        budgetBtn.textContent = "Save Limit";
        return;
    }

    const existingBudget = findBudgetByCategoryId(budgetCategorySelect.value);
    budgetAmountInput.value = existingBudget ? Number(existingBudget.limitAmount) : "";
    budgetBtn.textContent = existingBudget ? "Update Limit" : "Save Limit";
}

function renderCategories() {
    categoryList.innerHTML = "";
    categoryCount.textContent = String(categories.length);

    if (categories.length === 0) {
        categoryState.textContent = "No categories yet. Add one to start organizing expenses.";
        categoryState.style.display = "block";
        populateCategorySelects();
        return;
    }

    categoryState.style.display = "none";

    categories.forEach((category) => {
        const item = document.createElement("li");
        item.className = "item-card";
        item.innerHTML = `
            <div>
                <p class="item-title">${category.name}</p>
                <p class="item-subtitle">Personal category</p>
            </div>
        `;
        categoryList.appendChild(item);
    });

    populateCategorySelects();
}

function renderBudgets() {
    budgetList.innerHTML = "";
    budgetCount.textContent = String(budgets.length);

    if (budgets.length === 0) {
        budgetState.textContent = "No budgets yet. Set one per category to track spending.";
        budgetState.style.display = "block";
        updateBudgetFormState();
        return;
    }

    budgetState.style.display = "none";

    budgets.forEach((budget) => {
        const spent = expenses
            .filter((expense) => expense.categoryId === budget.categoryId)
            .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
        const remaining = budget.limitAmount - spent;

        const item = document.createElement("li");
        item.className = "item-card";
        item.innerHTML = `
            <div>
                <p class="item-title">${budget.categoryName}</p>
                <p class="item-subtitle">Budget ${formatCurrency(budget.limitAmount)}</p>
            </div>
            <div class="item-metrics">
                <span>Spent ${formatCurrency(spent)}</span>
                <span class="${remaining < 0 ? "danger-text" : "ok-text"}">${remaining < 0 ? "Over by" : "Left"} ${formatCurrency(Math.abs(remaining))}</span>
            </div>
        `;
        budgetList.appendChild(item);
    });

    updateBudgetFormState();
}

function renderExpenses() {
    expenseList.innerHTML = "";
    totalSpent.textContent = formatCurrency(
        expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0)
    );

    if (expenses.length === 0) {
        expenseState.textContent = "No expenses recorded yet.";
        expenseState.style.display = "block";
        return;
    }

    expenseState.style.display = "none";

    expenses.forEach((expense) => {
        const item = document.createElement("li");
        item.className = "expense-item";
        item.innerHTML = `
            <div>
                <p class="expense-title">${formatCurrency(expense.amount)}</p>
                <p class="expense-subtitle">${expense.categoryName || "Uncategorized"} | ${expense.paymentMethodName || "Unknown payment method"}</p>
            </div>
            <span class="expense-date">${formatDate(expense.date)}</span>
        `;
        expenseList.appendChild(item);
    });
}

async function loadProfile() {
    const profile = await fetchJson(`/users/${currentUser.userId}`);
    profileText.textContent = `${profile.name} (${profile.email})`;
    localStorage.setItem("expenseTrackerUser", JSON.stringify(profile));
}

async function loadCategories() {
    categoryState.style.display = "block";
    categoryState.textContent = "Loading categories...";
    categories = await fetchJson(`/categories?userId=${currentUser.userId}`);
    renderCategories();
}

async function loadBudgets() {
    budgetState.style.display = "block";
    budgetState.textContent = "Loading budgets...";
    budgets = await fetchJson(`/budgets?userId=${currentUser.userId}`);
    renderBudgets();
}

async function loadExpenses() {
    expenseState.style.display = "block";
    expenseState.textContent = "Loading expenses...";
    expenses = await fetchJson(`/expenses?userId=${currentUser.userId}`);
    renderExpenses();
}

async function loadPaymentMethods() {
    paymentMethods = await fetchJson("/payment-methods");
    populatePaymentMethodSelect();
}

async function refreshDashboard() {
    try {
        await loadProfile();
        await loadPaymentMethods();
        await loadCategories();
        await loadExpenses();
        await loadBudgets();
    } catch (error) {
        profileText.textContent = error.message;
    }
}

categoryForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    categoryBtn.disabled = true;
    setMessage(categoryMessage, "", "");

    try {
        await fetchJson("/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: categoryNameInput.value.trim(),
                userId: currentUser.userId
            })
        });

        categoryForm.reset();
        setMessage(categoryMessage, "Category created.", "success");
        await loadCategories();
        await loadBudgets();
    } catch (error) {
        setMessage(categoryMessage, error.message, "error");
    } finally {
        categoryBtn.disabled = false;
    }
});

budgetForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    budgetBtn.disabled = true;
    setMessage(budgetMessage, "", "");

    try {
        await fetchJson("/budgets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                limitAmount: Number(budgetAmountInput.value),
                userId: currentUser.userId,
                categoryId: Number(budgetCategorySelect.value)
            })
        });

        setMessage(budgetMessage, "Budget limit saved.", "success");
        await loadBudgets();
        updateBudgetFormState();
    } catch (error) {
        setMessage(budgetMessage, error.message, "error");
    } finally {
        budgetBtn.disabled = false;
    }
});

budgetCategorySelect.addEventListener("change", updateBudgetFormState);

expenseForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    expenseBtn.disabled = true;
    setMessage(expenseMessage, "", "");

    try {
        await fetchJson("/expenses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount: Number(expenseAmountInput.value),
                date: expenseDateInput.value,
                userId: currentUser.userId,
                categoryId: Number(expenseCategorySelect.value),
                paymentId: Number(expensePaymentMethodSelect.value)
            })
        });

        expenseForm.reset();
        expenseDateInput.value = new Date().toISOString().split("T")[0];
        populateCategorySelects();
        populatePaymentMethodSelect();
        setMessage(expenseMessage, "Expense added.", "success");
        await loadExpenses();
        renderBudgets();
    } catch (error) {
        setMessage(expenseMessage, error.message, "error");
    } finally {
        expenseBtn.disabled = false;
    }
});

document.getElementById("refreshCategoriesBtn").addEventListener("click", loadCategories);
document.getElementById("refreshBudgetsBtn").addEventListener("click", async () => {
    await loadBudgets();
    renderBudgets();
});
document.getElementById("refreshExpensesBtn").addEventListener("click", async () => {
    await loadExpenses();
    renderBudgets();
});

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("expenseTrackerUser");
    window.location.href = "index.html";
});

deleteUserBtn.addEventListener("click", async () => {
    const confirmed = window.confirm(
        "Delete your account permanently? This will remove your categories, budgets, and expenses."
    );

    if (!confirmed) {
        return;
    }

    deleteUserBtn.disabled = true;
    logoutBtn.disabled = true;
    setMessage(accountMessage, "", "");

    try {
        await sendDelete(`/users/${currentUser.userId}`);
        localStorage.removeItem("expenseTrackerUser");
        window.location.href = "register.html";
    } catch (error) {
        setMessage(accountMessage, error.message, "error");
        deleteUserBtn.disabled = false;
        logoutBtn.disabled = false;
    }
});

expenseDateInput.value = new Date().toISOString().split("T")[0];
refreshDashboard();
