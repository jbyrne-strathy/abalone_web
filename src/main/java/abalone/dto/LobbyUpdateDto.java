package abalone.dto;

import lombok.Value;

@Value
public class LobbyUpdateDto {
    private Iterable<PlayerDto> players;
    private Iterable<ChallengeDto> challenges;
}
