package com.example.expensetracker.dto;

public record BudgetRequest(double limitAmount, int userId, int categoryId) {
}
