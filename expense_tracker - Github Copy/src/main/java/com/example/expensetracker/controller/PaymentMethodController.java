package com.example.expensetracker.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.expensetracker.dto.PaymentMethodResponse;
import com.example.expensetracker.service.PaymentMethodService;

@RestController
@RequestMapping("/payment-methods")
@CrossOrigin
public class PaymentMethodController {

    private final PaymentMethodService paymentMethodService;

    public PaymentMethodController(PaymentMethodService paymentMethodService) {
        this.paymentMethodService = paymentMethodService;
    }

    @GetMapping
    public List<PaymentMethodResponse> getPaymentMethods() {
        return paymentMethodService.getPaymentMethods();
    }
}
