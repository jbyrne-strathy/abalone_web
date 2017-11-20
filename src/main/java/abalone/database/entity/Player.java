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
    }

    @Id @NotNull @NonNull
    private @Getter @Setter String username;

    @NotNull @NonNull
    private @Getter @Setter String password;
}
