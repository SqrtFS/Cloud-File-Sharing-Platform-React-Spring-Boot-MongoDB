package com.yaki.cloudshareapp.repository;

import com.yaki.cloudshareapp.document.ProfileDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ProfileRepository extends MongoRepository<ProfileDocument , String> {
    Optional <ProfileDocument> findByClerkId (String id);
    long deleteByClerkId(String clerkId);
}
