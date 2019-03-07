package abalone.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Observable;
import java.util.SortedMap;
import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@Data
public class GameState extends Observable {
    private UUID id;
    private Player player1;
    private Player player2;
    private SortedMap<String, Integer> board;
    private Integer winner = 0;
    private Integer currentPlayer = 1;
    private Integer player1Score = 0;
    private Integer player2Score = 0;

    public GameState() {
        id = UUID.randomUUID();
    }

    public int getMarbleAtSpace(String space) {
        return board.get(space);
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
        board.put(space, 0);
        setChanged();
    }

    public void setMarble(String space, int player) {
        board.put(space, player);
        setChanged();
    }
}
