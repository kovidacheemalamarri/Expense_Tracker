# Expense Tracker

A Spring Boot-based expense tracker web application for managing users, categories, budgets, expenses, and payment methods.

## Features

- User registration and login
- User-specific categories
- Editable budget limits by category
- Expense tracking with payment methods
- Account deletion
- Auto-selects a free port when the app starts

## Tech Stack

- Java
- Spring Boot
- Spring Data JPA
- MySQL
- HTML
- CSS
- JavaScript
- Maven

## Project Structure

- `src/main/java` - backend source code
- `src/main/resources/static` - frontend files
- `src/main/resources/application.properties` - app configuration
- `database/expense_tracker.sql` - sample database schema and data

## Prerequisites

Make sure you have installed:

- Java 17 or above
- Maven or use the included Maven Wrapper
- MySQL Server

## Database Setup

1. Create a database named `expense_tracker`
2. Import the SQL file:

```sql
SOURCE database/expense_tracker.sql;
