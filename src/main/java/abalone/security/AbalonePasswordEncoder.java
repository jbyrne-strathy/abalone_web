package abalone.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class AbalonePasswordEncoder {
    public static final PasswordEncoder PASSWORD_ENCODER = new BCryptPasswordEncoder();
}
