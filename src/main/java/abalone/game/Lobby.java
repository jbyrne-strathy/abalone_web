package abalone.game;

import abalone.dto.ChallengeDto;
import abalone.dto.LobbyUpdateDto;
import abalone.dto.PlayerDto;
import lombok.Synchronized;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Observable;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class Lobby extends Observable {
    private Set<PlayerDto> players = Collections.synchronizedSet(new HashSet<>());
    private Map<String, ChallengeDto> challenges = Collections.synchronizedMap(new HashMap<>());

    @Synchronized
    private void sendUpdates() {
        setChanged();
        notifyObservers(getLobby());
        deleteObservers();
    }

    public LobbyUpdateDto getLobby() {
        LobbyUpdateDto lobbyUpdateDto = new LobbyUpdateDto();
        lobbyUpdateDto.setPlayers(players);
        lobbyUpdateDto.setChallenges(challenges.values());
        return lobbyUpdateDto;
    }

    public void addPlayer(PlayerDto player) {
        if ( players.add(player) ) {
            sendUpdates();
        }
    }

    public void addChallenge(ChallengeDto challenge) {
        challenges.put(challenge.getChallenged().getName(), challenge);

        Iterable<PlayerDto> challengePlayers = players.stream().filter(player ->
            player.getName().equals(challenge.getChallenger().getName())
                    || player.getName().equals(challenge.getChallenged().getName())
        ).collect(Collectors.toList());

        removePlayers(challengePlayers);
    }

    public ChallengeDto getChallenge (String challenged) {
        return challenges.get(challenged);
    }

    public void returnPlayersToLobby(ChallengeDto challenge) {
        challenges.remove(challenge.getChallenged().getName());
        players.add(challenge.getChallenger());
        players.add(challenge.getChallenged());
        sendUpdates();
    }

    public void removePlayers(Iterable<PlayerDto> playersToRemove) {
        for (PlayerDto playerDto : playersToRemove) {
            players.remove(playerDto);
        }
        sendUpdates();
    }

    public PlayerDto getPlayer(String name) {
        Optional<PlayerDto> player = players.stream().filter(p -> p.getName().equals(name)).findFirst();
        return player.orElse(null);
    }

}
