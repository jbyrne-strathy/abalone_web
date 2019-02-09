package abalone.entity;

import lombok.Data;

@Data
public class LobbyUpdate {
    private Iterable<Player> players;
    private Iterable<Challenge> challenges;
}
