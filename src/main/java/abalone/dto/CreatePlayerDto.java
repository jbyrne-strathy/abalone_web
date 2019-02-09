package abalone.dto;

import lombok.Value;

@Value
public class CreatePlayerDto {
    private String username;
    private String password;
}
