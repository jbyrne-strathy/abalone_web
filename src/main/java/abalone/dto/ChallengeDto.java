package abalone.dto;

import lombok.Data;

@Data
public class ChallengeDto {
    private PlayerDto challenger;
    private PlayerDto challenged;
    private Boolean isAccepted;
}
