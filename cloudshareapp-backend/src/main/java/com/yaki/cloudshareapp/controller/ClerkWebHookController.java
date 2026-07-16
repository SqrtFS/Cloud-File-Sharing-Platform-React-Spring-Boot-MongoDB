package com.yaki.cloudshareapp.controller;

import com.yaki.cloudshareapp.dto.ProfileRequestDto;
import com.yaki.cloudshareapp.dto.ProfileResponseDto;
import com.yaki.cloudshareapp.exception.ProfileNotFoundException;
import com.yaki.cloudshareapp.service.ProfileService;
import com.yaki.cloudshareapp.service.UserCreditsService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Slf4j
@RestController
@RequestMapping("/webhooks")
@RequiredArgsConstructor
public class ClerkWebHookController {

@Value("${clerk.webhook.secret}")
private String webhookSecret;

private final ProfileService profileService;
private final UserCreditsService userCreditsService;

@PostMapping("/clerk")
@Operation(description = "handle webhook")
public ResponseEntity<?> handleClerkWebhook(@RequestHeader("svix-id") String svixId,
                                            @RequestHeader("svix-timestamp") String svixTimestamp,
                                            @RequestHeader("svix-signature") String svixSignature,
                                            @RequestBody String payload) {

    try {
        boolean isValid = verifyWebHookSignature(svixId , svixTimestamp , svixSignature , payload);
        if(!isValid){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Webhook Signature");
        }
        ObjectMapper mapper = new ObjectMapper();
        JsonNode rootNode = mapper.readTree(payload);
        String eventType = rootNode.path("type").asText();

        switch (eventType){
            case "user.created":
                handleUserCreated(rootNode.path("data"));
                break;
            case "user.updated":
                handleUserUpdated(rootNode.path("data"));
                break;
            case "user.deleted":
                handleUserDeleted(rootNode.path("data"));
                break;
        }
        return ResponseEntity.ok().build();
    }catch (Exception e){
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED , e.getMessage());
    }
}

private void handleUserDeleted(JsonNode data) {
    String clerkId = data.path("id").asText();

    profileService.deleteProfile(clerkId);
}

private void handleUserUpdated(JsonNode data) {

    String clerkId = data.path("id").asText();

    String email = "";
    JsonNode emailAddresses= data.path("email_addresses");
    if(emailAddresses.isArray() && !emailAddresses.isEmpty()){
        email = emailAddresses.get(0).path("email_address").asText();
    }
    String firstName = data.path("first_name").asText("");
    String lastName = data.path("last_name").asText("");
    String photoUrl = data.path("image_url").asText("");

    ProfileRequestDto updatedProfile = ProfileRequestDto.builder()
            .clerkId(clerkId)
            .email(email)
            .firstName(firstName)
            .lastName(lastName)
            .photoUrl(photoUrl)
            .build();

    ProfileResponseDto profile = profileService.updateProfile(clerkId , updatedProfile);

    if(profile == null){
        throw new ProfileNotFoundException("Profile not found with clerkId: " + clerkId);
    }
}

private void handleUserCreated(JsonNode data) {
    String clerkId = data.path("id").asText();

    String email = "";
    JsonNode emailAddresses= data.path("email_addresses");
    if(emailAddresses.isArray() && !emailAddresses.isEmpty()){
        email = emailAddresses.get(0).path("email_address").asText();
    }
    String firstName = data.path("first_name").asText("");
    String lastName = data.path("last_name").asText("");
    String photoUrl = data.path("image_url").asText("");

    ProfileRequestDto newProfile = ProfileRequestDto.builder()
            .clerkId(clerkId)
            .email(email)
            .firstName(firstName)
            .lastName(lastName)
            .photoUrl(photoUrl)
            .build();

    profileService.createProfile(newProfile);
    userCreditsService.createInitialCredits(clerkId);


}

private boolean verifyWebHookSignature(String svixId, String svixTimestamp, String svixSignature, String payload) {
    //validate the signature
    //in the real project you should validate, but I am leaving here true for learning purposes
    return true;
}
}
