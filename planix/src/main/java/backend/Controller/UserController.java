package backend.Controller;

import backend.DTO.AuthResponse;
import backend.Model.User;
import backend.Service.UserService;
import backend.Security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> updates
    ) {
        try {
            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token);

            return userService.findByEmail(email)
                    .map(user -> {
                        if (updates.containsKey("nickname")) {
                            user.setNickname((String) updates.get("nickname"));
                        }
                        if (updates.containsKey("name")) {
                            user.setName((String) updates.get("name"));
                        }
                        if (updates.containsKey("surname")) {
                            user.setSurname((String) updates.get("surname"));
                        }
                        if (updates.containsKey("email")) {
                            String newEmail = (String) updates.get("email");
                            if (userService.findByEmail(newEmail).isPresent()
                                    && !newEmail.equals(user.getEmail())) {
                                Map<String, String> error = new HashMap<>();
                                error.put("message", "Email already in use");
                                return ResponseEntity.status(HttpStatus.CONFLICT).body((Object) error);
                            }
                            user.setEmail(newEmail);
                        }
                        if (updates.containsKey("profilePictureId")) {
                            user.setProfilePictureId((Integer) updates.get("profilePictureId"));
                        }

                        User savedUser = userService.userRepository.save(user);

                        AuthResponse response = new AuthResponse(
                                token,
                                savedUser.getId(),
                                savedUser.getEmail(),
                                savedUser.getName(),
                                savedUser.getSurname(),
                                savedUser.getNickname(),
                                savedUser.getProfilePictureId()
                        );

                        return ResponseEntity.ok((Object) response);
                    })
                    .orElseGet(() -> {
                        Map<String, String> error = new HashMap<>();
                        error.put("message", "User not found");
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
                    });
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Update failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> passwordData
    ) {
        try {
            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token);

            return userService.findByEmail(email)
                    .map(user -> {
                        String currentPassword = passwordData.get("currentPassword");
                        String newPassword = passwordData.get("newPassword");

                        if (!userService.verifyPassword(currentPassword, user.getPassword())) {
                            Map<String, String> error = new HashMap<>();
                            error.put("message", "Current password is incorrect");
                            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body((Object) error);
                        }

                        user.setPassword(userService.passwordEncoder.encode(newPassword));
                        userService.userRepository.save(user);

                        Map<String, String> success = new HashMap<>();
                        success.put("message", "Password changed successfully");
                        return ResponseEntity.ok((Object) success);
                    })
                    .orElseGet(() -> {
                        Map<String, String> error = new HashMap<>();
                        error.put("message", "User not found");
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
                    });
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Password change failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}