package abalone.dto;

import lombok.Value;

import java.util.SortedMap;
import java.util.UUID;

@Value
public class GameStateDto {
    private UUID id;
    private PlayerDto player1;
    private PlayerDto player2;
    private SortedMap<String, Integer> board;
    private Integer winner;
    private Integer currentPlayer;
    private Integer player1Score;
    private Integer player2Score;
}
