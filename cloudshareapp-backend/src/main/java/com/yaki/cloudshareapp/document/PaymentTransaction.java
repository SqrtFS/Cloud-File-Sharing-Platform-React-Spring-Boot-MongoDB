package com.yaki.cloudshareapp.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "payment_transactions")
public class PaymentTransaction {

    @Id
    private String id;

    @Indexed
    private String clerkId;

    @Indexed(unique = true)
    private String orderId;

    private String planId;
    private Integer amount;
    private String currency;
    private Integer credits;
    private String status; // CREATED, SUCCEEDED, FAILED

    private Instant createdAt;
    private Instant updatedAt;
}