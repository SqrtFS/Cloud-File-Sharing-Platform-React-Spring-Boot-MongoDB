package com.yaki.cloudshareapp.repository;

import com.yaki.cloudshareapp.document.UserCredits;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserCreditsRepository extends MongoRepository<UserCredits , String> {
    Optional<UserCredits> findByClerkId(String clerkId);
}
