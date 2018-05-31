package abalone.dto;

import lombok.Data;

@Data
public class LobbyUpdateDto {
    private Iterable<PlayerDto> players;
    private Iterable<ChallengeDto> challenges;
}
