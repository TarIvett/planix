package backend;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenParola {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = encoder.encode("12345678");
        System.out.println(hash);
    }
}
