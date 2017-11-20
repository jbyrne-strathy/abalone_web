package abalone.security;

public class SecurityConstants {
    public static final String SECRET = "SecretKeyToGenJWTs";
    public static final long EXPIRATION_TIME = 864_000_000; // 10 days
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
    public static final String SIGN_UP_URL = "/createAccount";
    public static final String BASE_URL = "/*";
    public static final String SCRIPTS_URL = "/scripts/**";
    public static final String CSS_URL = "/css/**";
}