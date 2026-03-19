package com.example.expensetracker.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.expensetracker.dto.ExpenseRequest;
import com.example.expensetracker.dto.ExpenseResponse;
import com.example.expensetracker.model.Category;
import com.example.expensetracker.model.Expense;
import com.example.expensetracker.model.PaymentMethod;
import com.example.expensetracker.model.User;
import com.example.expensetracker.repository.CategoryRepository;
import com.example.expensetracker.repository.ExpenseRepository;
import com.example.expensetracker.repository.PaymentMethodRepository;
import com.example.expensetracker.repository.UserRepository;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PaymentMethodRepository paymentMethodRepository;

    public ExpenseService(
        ExpenseRepository expenseRepository,
        UserRepository userRepository,
        CategoryRepository categoryRepository,
        PaymentMethodRepository paymentMethodRepository
    ) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.paymentMethodRepository = paymentMethodRepository;
    }

    public List<ExpenseResponse> getExpensesByUser(int userId) {
        return expenseRepository.findByUserUserIdOrderByDateDescExpenseIdDesc(userId)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    public ExpenseResponse saveExpense(ExpenseRequest request) {
        User user = userRepository.findById(request.userId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));

        Category category = categoryRepository.findById(request.categoryId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found."));

        PaymentMethod paymentMethod = paymentMethodRepository.findById(request.paymentId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment method not found."));

        if (category.getUser() == null || category.getUser().getUserId() != user.getUserId()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category does not belong to this user.");
        }

        Expense expense = new Expense();
        expense.setAmount(request.amount());
        expense.setDate(request.date());
        expense.setUser(user);
        expense.setCategory(category);
        expense.setPaymentMethod(paymentMethod);

        return toResponse(expenseRepository.save(expense));
    }

    private ExpenseResponse toResponse(Expense expense) {
        String categoryName = expense.getCategory() != null ? expense.getCategory().getName() : null;
        Integer categoryId = expense.getCategory() != null ? expense.getCategory().getCategoryId() : null;
        Integer paymentId = expense.getPaymentMethod() != null ? expense.getPaymentMethod().getPaymentId() : null;
        String paymentMethodName = expense.getPaymentMethod() != null ? expense.getPaymentMethod().getMethodName() : null;

        return new ExpenseResponse(
            expense.getExpenseId(),
            expense.getAmount(),
            expense.getDate(),
            expense.getUser() != null ? expense.getUser().getUserId() : 0,
            categoryId,
            categoryName,
            paymentId,
            paymentMethodName
        );
    }
}
