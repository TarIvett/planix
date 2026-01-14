package backend.Service;

import backend.Model.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthUserProvider {

    private final UserService userService;

    public AuthUserProvider(UserService userService) {
        this.userService = userService;
    }

    public User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if ((auth == null) || (auth.getName() == null) || "anonymousUser".equals(auth.getName())) {
            throw new RuntimeException("Unauthenticated");
        }
        String email = auth.getName(); // <- email-ul setat de JwtAuthenticationFilter
        return userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
