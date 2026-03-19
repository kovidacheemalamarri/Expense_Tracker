package com.example.expensetracker.dto;

public record ExpenseRequest(double amount, String date, int userId, int categoryId, int paymentId) {
}
