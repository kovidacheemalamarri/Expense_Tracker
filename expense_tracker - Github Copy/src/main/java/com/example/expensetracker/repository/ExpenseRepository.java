package com.example.expensetracker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.expensetracker.model.Expense;

public interface ExpenseRepository extends JpaRepository<Expense, Integer> {

    List<Expense> findByUserUserIdOrderByDateDescExpenseIdDesc(int userId);

    void deleteByUserUserId(int userId);
}
