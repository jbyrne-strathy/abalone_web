package abalone.entity;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

@Entity
@Data
public class Player {
    @Id @NotNull
    private String name;

    @NotNull
    private String password;
}
