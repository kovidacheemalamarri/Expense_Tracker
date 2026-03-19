package com.example.expensetracker.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.expensetracker.model.Budget;

public interface BudgetRepository extends JpaRepository<Budget, Integer> {

    List<Budget> findByUserUserIdOrderByBudgetIdDesc(int userId);

    Optional<Budget> findFirstByUserUserIdAndCategoryCategoryIdOrderByBudgetIdDesc(int userId, int categoryId);

    void deleteByUserUserId(int userId);
}
