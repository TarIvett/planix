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
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            if (user.getEmail() == null || user.getEmail().isBlank() ||
                    user.getPassword() == null || user.getPassword().isBlank() ||
                    user.getName() == null || user.getName().isBlank() ||
                    user.getSurname() == null || user.getSurname().isBlank() ||
                    user.getNickname() == null || user.getNickname().isBlank()) {

                Map<String, String> error = new HashMap<>();
                error.put("message", "All fields (Email, Password, First Name, Last Name, Nickname) are required!");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            if (userService.findByEmail(user.getEmail()).isPresent()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Email already exists");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
            }

            if (!userService.isPasswordValid(user.getPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message",
                        "The password must contain at least 8 characters, one uppercase letter, and one special character."));
            }

            if (!userService.isEmailValid(user.getEmail())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "The email format is invalid!"));
            }

            if (user.getProfilePictureId() == null) {
                user.setProfilePictureId(1);
            }

            User savedUser = userService.register(user);
            String token = jwtUtil.generateToken(savedUser.getEmail());

            AuthResponse response = new AuthResponse(
                    token,
                    savedUser.getId(),
                    savedUser.getEmail(),
                    savedUser.getName(),
                    savedUser.getSurname(),
                    savedUser.getNickname(),
                    savedUser.getProfilePictureId()
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody User user) {
        try {
            return userService.findByEmail(user.getEmail())
                    .map(existingUser -> {
                        if (userService.verifyPassword(user.getPassword(), existingUser.getPassword())) {
                            String token = jwtUtil.generateToken(existingUser.getEmail());

                            AuthResponse response = new AuthResponse(
                                    token,
                                    existingUser.getId(),
                                    existingUser.getEmail(),
                                    existingUser.getName(),
                                    existingUser.getSurname(),
                                    existingUser.getNickname(),
                                    existingUser.getProfilePictureId()
                            );
                            return ResponseEntity.ok((Object) response);
                        } else {
                            Map<String, String> error = new HashMap<>();
                            error.put("message", "Invalid password");
                            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body((Object) error);
                        }
                    })
                    .orElseGet(() -> {
                        Map<String, String> error = new HashMap<>();
                        error.put("message", "User not found");
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
                    });
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Login failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Invalid token");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }

            String token = authHeader.substring(7);

            if (!jwtUtil.validateToken(token)) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Invalid token");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }

            String email = jwtUtil.extractEmail(token);
            return userService.findByEmail(email)
                    .map(existingUser -> {
                        AuthResponse response = new AuthResponse(
                                token,
                                existingUser.getId(),
                                existingUser.getEmail(),
                                existingUser.getName(),
                                existingUser.getSurname(),
                                existingUser.getNickname(),
                                existingUser.getProfilePictureId()
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
            error.put("message", "Token verification failed");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }
}