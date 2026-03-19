package com.example.expensetracker.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.expensetracker.dto.CategoryRequest;
import com.example.expensetracker.dto.CategoryResponse;
import com.example.expensetracker.model.Category;
import com.example.expensetracker.model.User;
import com.example.expensetracker.repository.CategoryRepository;
import com.example.expensetracker.repository.UserRepository;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public CategoryService(CategoryRepository categoryRepository, UserRepository userRepository) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    public List<CategoryResponse> getCategoriesByUser(int userId) {
        return categoryRepository.findByUserUserIdOrderByNameAsc(userId)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    public CategoryResponse createCategory(CategoryRequest request) {
        if (request.name() == null || request.name().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category name is required.");
        }

        User user = userRepository.findById(request.userId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));

        Category category = new Category();
        category.setName(request.name().trim());
        category.setUser(user);

        return toResponse(categoryRepository.save(category));
    }

    private CategoryResponse toResponse(Category category) {
        return new CategoryResponse(
            category.getCategoryId(),
            category.getName(),
            category.getUser() != null ? category.getUser().getUserId() : 0
        );
    }
}
