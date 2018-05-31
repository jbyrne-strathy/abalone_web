package abalone.game;

import abalone.dto.ChallengeDto;
import abalone.dto.LobbyUpdateDto;
import abalone.dto.PlayerDto;
import lombok.Synchronized;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Observable;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicBoolean;

@Component
public class Lobby extends Observable {
    private Set<PlayerDto> players = Collections.synchronizedSet(new HashSet<>());
    private List<ChallengeDto> challenges = Collections.synchronizedList(new ArrayList<>());

    @Synchronized
    private void sendUpdates() {
        setChanged();
        notifyObservers(getLobby());
        deleteObservers();
    }

    @Synchronized
    public LobbyUpdateDto getLobby() {
        LobbyUpdateDto lobbyUpdateDto = new LobbyUpdateDto();
        lobbyUpdateDto.setPlayers(players);
        lobbyUpdateDto.setChallenges(challenges);
        return lobbyUpdateDto;
    }

    public void addPlayer(PlayerDto player) {
        if ( players.add(player) ) {
            sendUpdates();
        }
    }

    public void addChallenge(ChallengeDto challenge) {
        if ( challenges.add(challenge) ) {
            players.forEach(player -> {
                if ( player.getName().equals(challenge.getChallenger().getName())
                        || player.getName().equals(challenge.getChallenged().getName()) ) {
                    players.remove(player);
                }
            });
            sendUpdates();
        }
    }

    public ChallengeDto getChallenge (String challenged) {
        for (ChallengeDto challenge : challenges) {
            if (challenge.getChallenged().getName().equals(challenged)) {
                return challenge;
            }
        }
        return null;
    }

    public void returnPlayersToLobby(ChallengeDto challenge) {
        challenges.remove(challenge);
        players.add(challenge.getChallenger());
        players.add(challenge.getChallenged());
        sendUpdates();
    }

    public void removePlayers(Iterable<PlayerDto> players) {
        AtomicBoolean isUpdated = new AtomicBoolean(false);
        players.forEach(playerDto -> {
            if ( this.players.remove(playerDto) ) {
                isUpdated.set(true);
            }
        });
        if (isUpdated.get()) {
            sendUpdates();
        }
    }

    public PlayerDto getPlayer(String name) {
        Optional<PlayerDto> player = players.stream().filter(p -> p.getName().equals(name)).findFirst();
        return player.orElse(null);
    }

}
