package abalone.game;

import abalone.dto.PlayerDto;
import lombok.Synchronized;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Observable;
import java.util.Set;

@Component
public class Lobby extends Observable {
    private Set<PlayerDto> players = new HashSet<>();

    @Synchronized
    public void addPlayer(PlayerDto player) {
        if ( players.add(player) ) {
            sendUpdates();
        }
    }

    @Synchronized
    public void removePlayer(PlayerDto player) {
        if ( players.remove(player) ) {
            sendUpdates();
        }
    }

    private void sendUpdates() {
        setChanged();
        notifyObservers(getLobby());
        deleteObservers();
    }

    public Iterable<PlayerDto> getLobby() {
        return players;
    }
}
