package abalone.entity;

import abalone.dto.PlayerDto;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

@Entity
@Data
public class Player {
    @Id @NotNull
    private String username;

    @NotNull
    private String password;

    public PlayerDto toDto() {
        return new PlayerDto(getUsername());
    }
}
