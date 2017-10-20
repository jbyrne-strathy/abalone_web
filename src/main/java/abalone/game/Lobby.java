package abalone.game;

import abalone.dto.PlayerDto;
import lombok.Synchronized;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class Lobby {
    private Set<PlayerDto> players = new HashSet<>();

    @Synchronized
    public void addPlayer(PlayerDto player) {
        players.add(player);
    }

    @Synchronized
    public void removePlayer(PlayerDto player) {
        players.remove(player);
    }

    @Synchronized
    public Iterable<PlayerDto> getLobby() {
        return players;
    }
}
