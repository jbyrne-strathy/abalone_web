package abalone.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class ChallengeDto {
    private PlayerDto challenger;
    private PlayerDto challenged;
    private UUID gameID;
}
