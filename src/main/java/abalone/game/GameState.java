package abalone.game;

import abalone.dto.PlayerDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Map;
import java.util.Observable;
import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@Data
public class GameState extends Observable {

    private UUID id;
    private PlayerDto player1;
    private PlayerDto player2;
    private Map<String, Integer> spaces;
    private Integer winner = 0;
    private Integer currentPlayer = 1;
    private Integer player1Score = 0;
    private Integer player2Score = 0;

    public int getMarbleAtSpace(String space) {
        return spaces.get(space);
    }

    public void incrementPlayer1score() {
        player1Score++;
        setChanged();
    }

    public void incrementPlayer2score() {
        player2Score++;
        setChanged();
    }

    public void removeMarble(String space) {
        spaces.put(space, 0);
        setChanged();
    }

    public void setMarble(String space, int player) {
        spaces.put(space, player);
        setChanged();
    }
}
