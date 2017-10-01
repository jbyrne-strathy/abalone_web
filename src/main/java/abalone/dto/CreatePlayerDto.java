package abalone.dto;

import lombok.Getter;
import lombok.Setter;

public class CreatePlayerDto {
    private @Getter @Setter String username;

    private @Getter @Setter String password;
}
