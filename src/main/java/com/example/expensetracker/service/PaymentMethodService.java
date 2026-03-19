package com.example.expensetracker.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.expensetracker.dto.PaymentMethodResponse;
import com.example.expensetracker.repository.PaymentMethodRepository;

@Service
public class PaymentMethodService {

    private final PaymentMethodRepository paymentMethodRepository;

    public PaymentMethodService(PaymentMethodRepository paymentMethodRepository) {
        this.paymentMethodRepository = paymentMethodRepository;
    }

    public List<PaymentMethodResponse> getPaymentMethods() {
        return paymentMethodRepository.findAll().stream()
            .map((paymentMethod) -> new PaymentMethodResponse(
                paymentMethod.getPaymentId(),
                paymentMethod.getMethodName()
            ))
            .toList();
    }
}
