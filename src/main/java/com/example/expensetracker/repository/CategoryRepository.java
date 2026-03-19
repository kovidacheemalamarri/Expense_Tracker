package com.example.expensetracker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.expensetracker.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

    List<Category> findByUserUserIdOrderByNameAsc(int userId);

    void deleteByUserUserId(int userId);
}
