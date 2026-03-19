package com.example.expensetracker.dto;

public record BudgetResponse(
    int budgetId,
    double limitAmount,
    int userId,
    int categoryId,
    String categoryName
) {
}
