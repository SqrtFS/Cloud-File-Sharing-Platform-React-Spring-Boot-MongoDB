package com.yaki.cloudshareapp.service;

import com.yaki.cloudshareapp.document.ProfileDocument;
import com.yaki.cloudshareapp.document.UserCredits;
import com.yaki.cloudshareapp.exception.ProfileNotFoundException;
import com.yaki.cloudshareapp.repository.UserCreditsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


@Slf4j
@Service
@RequiredArgsConstructor
public class UserCreditsService {
    private final UserCreditsRepository userCreditsRepository;
    private final ProfileService profileService;
    public UserCredits createInitialCredits(String clerkId){
        UserCredits userCredits = UserCredits.builder()
                .clerkId(clerkId)
                .credits(5)
                .plan("BASIC")
                .build();

        return userCreditsRepository.save(userCredits);
    }
    public UserCredits getUserCredits(String clerkId){
        return userCreditsRepository.findByClerkId(clerkId).orElseGet(() -> createInitialCredits(clerkId));
    }

    public UserCredits getUserCredits(){
        String clerkId = profileService.getCurrentProfile()
                .map(ProfileDocument::getClerkId)
                .orElseThrow( () -> new ProfileNotFoundException("Profile Not Found"));
        return getUserCredits(clerkId);
    }
    public Boolean hasEnoughCredits(int requiredCredits){
        UserCredits userCredits = getUserCredits();
         return userCredits.getCredits() >= requiredCredits;
    }
    public void consumeCredit(){
        UserCredits userCredits = getUserCredits();
        if(userCredits.getCredits() <= 0 ){
            return;
        }
        userCredits.setCredits(userCredits.getCredits()-1);
        userCreditsRepository.save(userCredits);
    }
}
