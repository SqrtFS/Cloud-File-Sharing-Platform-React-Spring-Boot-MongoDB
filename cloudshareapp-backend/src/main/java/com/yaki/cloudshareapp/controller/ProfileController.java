package com.yaki.cloudshareapp.controller;

import com.yaki.cloudshareapp.dto.ProfileRequestDto;
import com.yaki.cloudshareapp.dto.ProfileResponseDto;
import com.yaki.cloudshareapp.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.groups.Default;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/profiles")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    @GetMapping
    @Operation(description = "Get Profiles")
    public ResponseEntity<List<ProfileResponseDto>> getAll(){
        return ResponseEntity.status(HttpStatus.OK).body(profileService.getAll());
    }

    @PostMapping
    @Operation(description = "Create Profile")
    public ResponseEntity<ProfileResponseDto> registerProfile(@Validated(Default.class) @RequestBody ProfileRequestDto profileRequestDto){
        ProfileResponseDto savedProfile = profileService.createProfile(profileRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProfile);
    }

    @PutMapping("/{id}")
    @Operation(description ="Update Profiles")
    public ResponseEntity<ProfileResponseDto> updateProfile(@PathVariable("id") String id,  @Validated(Default.class) @RequestBody ProfileRequestDto profileRequestDto){
        return ResponseEntity.status(HttpStatus.OK).body(profileService.updateProfile(id , profileRequestDto));
    }
    @DeleteMapping("/{id}")
    @Operation(description ="Delete Profiles")
    public ResponseEntity<Void> deleteProfile(@PathVariable String id){
        profileService.deleteProfile(id);
        return ResponseEntity.noContent().build();
    }
}
