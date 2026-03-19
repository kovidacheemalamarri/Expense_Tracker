package com.example.expensetracker.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.expensetracker.model.PaymentMethod;
import com.example.expensetracker.repository.PaymentMethodRepository;

@Component
public class PaymentMethodDataLoader implements CommandLineRunner {

    private static final List<String> DEFAULT_METHODS = List.of(
        "Cash",
        "Credit Card",
        "Debit Card",
        "UPI",
        "Net Banking",
        "Wallet"
    );

    private final PaymentMethodRepository paymentMethodRepository;

    public PaymentMethodDataLoader(PaymentMethodRepository paymentMethodRepository) {
        this.paymentMethodRepository = paymentMethodRepository;
    }

    @Override
    public void run(String... args) {
        for (String methodName : DEFAULT_METHODS) {
            if (paymentMethodRepository.findByMethodNameIgnoreCase(methodName).isEmpty()) {
                PaymentMethod paymentMethod = new PaymentMethod();
                paymentMethod.setMethodName(methodName);
                paymentMethodRepository.save(paymentMethod);
            }
        }
    }
}
