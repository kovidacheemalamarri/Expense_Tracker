package com.example.expensetracker.dto;

public record ExpenseResponse(
    int expenseId,
    double amount,
    String date,
    int userId,
    Integer categoryId,
    String categoryName,
    Integer paymentId,
    String paymentMethodName
) {
}
