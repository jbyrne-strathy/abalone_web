package abalone.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class GameStateDto {

    private UUID id;
    private PlayerDto player1;
    private PlayerDto player2;
    private BoardDto board;
    private Integer winner = 0;
    private Integer currentPlayer = 1;
    private Integer player1Score = 0;
    private Integer player2Score = 0;

    public GameStateDto() {
        id = UUID.randomUUID();
    }

    public int getMarbleAtSpace(String space) {
        return board.get(space);
    }

    public void incrementPlayer1score() {
        player1Score++;
    }

    public void incrementPlayer2score() {
        player2Score++;
    }

    public void removeMarble(String space) {
        board.put(space, 0);
    }

    public void setMarble(String space, int player) {
        board.put(space, player);
    }
}
