package com.example.expensetracker.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.expensetracker.dto.BudgetRequest;
import com.example.expensetracker.dto.BudgetResponse;
import com.example.expensetracker.model.Budget;
import com.example.expensetracker.model.Category;
import com.example.expensetracker.model.User;
import com.example.expensetracker.repository.BudgetRepository;
import com.example.expensetracker.repository.CategoryRepository;
import com.example.expensetracker.repository.UserRepository;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public BudgetService(
        BudgetRepository budgetRepository,
        UserRepository userRepository,
        CategoryRepository categoryRepository
    ) {
        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<BudgetResponse> getBudgetsByUser(int userId) {
        Map<Integer, Budget> latestBudgetByCategory = new LinkedHashMap<>();

        budgetRepository.findByUserUserIdOrderByBudgetIdDesc(userId)
            .forEach((budget) -> {
                if (budget.getCategory() != null) {
                    latestBudgetByCategory.putIfAbsent(budget.getCategory().getCategoryId(), budget);
                }
            });

        return latestBudgetByCategory.values().stream()
            .map(this::toResponse)
            .toList();
    }

    public BudgetResponse createBudget(BudgetRequest request) {
        if (request.limitAmount() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Budget limit must be greater than zero.");
        }

        User user = userRepository.findById(request.userId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));

        Category category = categoryRepository.findById(request.categoryId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found."));

        if (category.getUser() == null || category.getUser().getUserId() != user.getUserId()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category does not belong to this user.");
        }

        Budget budget = budgetRepository
            .findFirstByUserUserIdAndCategoryCategoryIdOrderByBudgetIdDesc(user.getUserId(), category.getCategoryId())
            .orElseGet(Budget::new);

        budget.setUser(user);
        budget.setCategory(category);
        budget.setLimitAmount(request.limitAmount());

        return toResponse(budgetRepository.save(budget));
    }

    private BudgetResponse toResponse(Budget budget) {
        return new BudgetResponse(
            budget.getBudgetId(),
            budget.getLimitAmount(),
            budget.getUser() != null ? budget.getUser().getUserId() : 0,
            budget.getCategory() != null ? budget.getCategory().getCategoryId() : 0,
            budget.getCategory() != null ? budget.getCategory().getName() : null
        );
    }
}
