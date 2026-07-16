package com.yaki.cloudshareapp.controller;

import com.yaki.cloudshareapp.dto.PaymentDto;
import com.yaki.cloudshareapp.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public PaymentDto createOrder(@RequestBody PaymentDto paymentDto) {
        return paymentService.createOrder(paymentDto);
    }

    @PostMapping("/{orderId}/capture")
    public PaymentDto captureOrder(@PathVariable String orderId) {
        return paymentService.captureOrder(orderId);
    }

    @GetMapping("/{orderId}")
    public PaymentDto getOrder(@PathVariable String orderId) {
        return paymentService.getOrder(orderId);
    }
    @GetMapping("/history")
    public List<PaymentDto> getTransactionHistory() {
        return paymentService.getUserTransactions();
    }
}