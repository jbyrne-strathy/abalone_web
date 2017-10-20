package abalone.database.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

@Entity
@NoArgsConstructor
public class Player {
    public Player(String username, String password) {
        this.username = username;
        this.password = password;
        this.enabled = true;
        this.role = "ROLE_USER";
    }

    @Id @NotNull @NonNull
    private @Getter @Setter String username;

    @NotNull @NonNull
    private @Getter @Setter String password;

    @NotNull @NonNull
    private @Getter @Setter Boolean enabled;

    @NotNull @NonNull
    private @Getter @Setter String role;
}
