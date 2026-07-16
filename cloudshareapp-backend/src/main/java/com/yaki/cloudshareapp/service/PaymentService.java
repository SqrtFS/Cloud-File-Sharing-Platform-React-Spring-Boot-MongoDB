package com.yaki.cloudshareapp.service;

import com.paypal.orders.AmountWithBreakdown;
import com.paypal.orders.Order;
import com.paypal.orders.PurchaseUnit;
import com.yaki.cloudshareapp.document.PaymentTransaction;
import com.yaki.cloudshareapp.document.ProfileDocument;
import com.yaki.cloudshareapp.document.UserCredits;
import com.yaki.cloudshareapp.dto.PaymentDto;
import com.yaki.cloudshareapp.exception.ProfileNotFoundException;
import com.yaki.cloudshareapp.repository.PaymentTransactionRepository;
import com.yaki.cloudshareapp.repository.UserCreditsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final ProfileService profileService;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final UserCreditsRepository userCreditsRepository;

    public PaymentDto createOrder(PaymentDto paymentDto) {
        try {
            ProfileDocument currentProfile = profileService.getCurrentProfile()
                    .orElseThrow(() -> new ProfileNotFoundException("Profile not found"));
            String clerkId = currentProfile.getClerkId();

            AmountWithBreakdown amount = new AmountWithBreakdown()
                    .currencyCode(paymentDto.getCurrency())
                    .value(String.valueOf(paymentDto.getAmount()));

            PurchaseUnit purchaseUnit = new PurchaseUnit()
                    .referenceId(paymentDto.getPlanId())
                    .amountWithBreakdown(amount);

            String mockOrderId = UUID.randomUUID().toString().replace("-", "").substring(0, 17).toUpperCase();

            Order order = new Order();
            order.id(mockOrderId);
            order.status("CREATED");
            order.purchaseUnits(List.of(purchaseUnit));

            PaymentTransaction transaction = PaymentTransaction.builder()
                    .clerkId(clerkId)
                    .orderId(order.id())
                    .planId(paymentDto.getPlanId())
                    .amount(paymentDto.getAmount())
                    .currency(paymentDto.getCurrency())
                    .credits(paymentDto.getCredits())
                    .status("CREATED")
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build();

            paymentTransactionRepository.save(transaction);

            log.info("Mock PayPal order created: {} for user {}", order.id(), clerkId);

            paymentDto.setOrderId(order.id());
            paymentDto.setSuccess(true);
            paymentDto.setMessage("Order created successfully");

            return paymentDto;

        } catch (Exception e) {
            log.error("Failed to create order", e);
            paymentDto.setSuccess(false);
            paymentDto.setMessage(e.getMessage());
            return paymentDto;
        }
    }

    public PaymentDto captureOrder(String orderId) {
        PaymentTransaction transaction = paymentTransactionRepository.findByOrderId(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));

        if ("SUCCEEDED".equals(transaction.getStatus()) || "FAILED".equals(transaction.getStatus())) {
            return buildDtoFromTransaction(transaction);
        }

        try {
            boolean captureSuccess = Math.random() > 0.1;

            transaction.setStatus(captureSuccess ? "SUCCEEDED" : "FAILED");
            transaction.setUpdatedAt(Instant.now());
            paymentTransactionRepository.save(transaction);

            log.info("Mock PayPal order {} captured, success: {}", orderId, captureSuccess);

            if (captureSuccess) {
                creditUser(transaction);
            }

            return buildDtoFromTransaction(transaction);

        } catch (Exception e) {
            log.error("Failed to capture order {}", orderId, e);
            transaction.setStatus("FAILED");
            paymentTransactionRepository.save(transaction);
            return buildDtoFromTransaction(transaction);
        }
    }

    public PaymentDto getOrder(String orderId) {
        PaymentTransaction transaction = paymentTransactionRepository.findByOrderId(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
        return buildDtoFromTransaction(transaction);
    }

    private void creditUser(PaymentTransaction transaction) {
        UserCredits userCredits = userCreditsRepository.findByClerkId(transaction.getClerkId())
                .orElseGet(() -> UserCredits.builder()
                        .clerkId(transaction.getClerkId())
                        .credits(0)
                        .plan("BASIC")
                        .build());

        userCredits.setCredits(userCredits.getCredits() + transaction.getCredits());
        userCredits.setPlan(transaction.getPlanId().toUpperCase());

        UserCredits saved = userCreditsRepository.save(userCredits);
        log.info("Credited {} credits to user {}, new total: {}, new plan: {}",
                transaction.getCredits(), transaction.getClerkId(), saved.getCredits(), saved.getPlan());
    }

    private PaymentDto buildDtoFromTransaction(PaymentTransaction transaction) {
        PaymentDto dto = new PaymentDto();
        dto.setPlanId(transaction.getPlanId());
        dto.setAmount(transaction.getAmount());
        dto.setCurrency(transaction.getCurrency());
        dto.setCredits(transaction.getCredits());
        dto.setOrderId(transaction.getOrderId());
        dto.setSuccess("SUCCEEDED".equals(transaction.getStatus()));
        dto.setMessage(switch (transaction.getStatus()) {
            case "SUCCEEDED" -> "Order captured successfully";
            case "FAILED" -> "Order capture failed";
            default -> "Order created successfully";
        });
        return dto;
    }

    public List<PaymentDto> getUserTransactions() {
        ProfileDocument currentProfile = profileService.getCurrentProfile()
                .orElseThrow(() -> new ProfileNotFoundException("Profile not found"));

        List<PaymentTransaction> transactions = paymentTransactionRepository
                .findByClerkIdOrderByCreatedAtDesc(currentProfile.getClerkId());

        return transactions.stream()
                .map(this::buildDtoFromTransaction)
                .toList();
    }
}