package com.yaki.cloudshareapp.controller;



import com.yaki.cloudshareapp.document.UserCredits;
import com.yaki.cloudshareapp.dto.UserCreditsDto;
import com.yaki.cloudshareapp.mapper.UserCreditsMapper;
import com.yaki.cloudshareapp.service.UserCreditsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserCreditsController {
    private final UserCreditsService userCreditsService;
    private final UserCreditsMapper userCreditsMapper;

    @GetMapping("/credits")
    public ResponseEntity<?> getUserCredits(){
      UserCredits userCredits = userCreditsService.getUserCredits();
      UserCreditsDto userCreditsDto = userCreditsMapper.toDto(userCredits);

      return  ResponseEntity.ok(userCreditsDto);
    }
}
