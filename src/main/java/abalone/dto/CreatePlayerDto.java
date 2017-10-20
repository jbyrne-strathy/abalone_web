package abalone.dto;

import lombok.Data;

public @Data class CreatePlayerDto {
    private String username;
    private String password;
}
