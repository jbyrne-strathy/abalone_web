package abalone.dto;

import lombok.Value;

import java.util.UUID;

@Value
public class ChallengeDto {
    private PlayerDto challenger;
    private PlayerDto challenged;
    private UUID gameID;
}
