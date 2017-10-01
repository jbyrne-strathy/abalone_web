package abalone.database.table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;
import java.util.UUID;

import static abalone.security.AbalonePasswordEncoder.PASSWORD_ENCODER;

@Entity
@NoArgsConstructor
public class Player {

    public Player(String username, String password) {
        this.id = UUID.randomUUID().toString();
        this.username = username;
        this.password = PASSWORD_ENCODER.encode(password);
        this.enabled = true;
        this.role = "ROLE_USER";
    }

    @Id @NonNull
    private @Getter @Setter String id;

    @Column(unique = true)
    @NotNull @NonNull
    private @Getter @Setter String username;

    @NotNull @NonNull
    private @Getter @Setter String password;

    @NotNull @NonNull
    private @Getter @Setter Boolean enabled;

    @NotNull @NonNull
    private @Getter @Setter String role;
}
