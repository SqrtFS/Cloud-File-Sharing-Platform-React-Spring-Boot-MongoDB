package com.yaki.cloudshareapp.repository;

import com.yaki.cloudshareapp.document.PaymentTransaction;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentTransactionRepository extends MongoRepository<PaymentTransaction, String> {

    Optional<PaymentTransaction> findByOrderId(String orderId);

    List<PaymentTransaction> findByClerkIdOrderByCreatedAtDesc(String clerkId);
}