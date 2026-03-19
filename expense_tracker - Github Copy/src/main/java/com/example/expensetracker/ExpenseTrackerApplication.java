package com.example.expensetracker;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class ExpenseTrackerApplication {

	private final Environment environment;

	public ExpenseTrackerApplication(Environment environment) {
		this.environment = environment;
	}

	public static void main(String[] args) {
		SpringApplication.run(ExpenseTrackerApplication.class, args);
	}

	@EventListener(ApplicationReadyEvent.class)
	public void logStartupUrl() {
		String port = environment.getProperty("local.server.port", environment.getProperty("server.port", "8080"));
		System.out.println("Expense Tracker is running at http://localhost:" + port);
	}

}
