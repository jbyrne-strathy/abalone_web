package abalone.manager;

import abalone.dto.ChallengeDto;
import abalone.dto.LobbyUpdateDto;
import abalone.dto.PlayerDto;
import lombok.Synchronized;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.HashSet;
import java.util.Observable;
import java.util.Optional;
import java.util.Set;
import java.util.SortedMap;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Component
public class LobbyManager extends Observable {
    private final Set<PlayerDto> players;
    private final SortedMap<String, ChallengeDto> challenges;

    public LobbyManager() {
        this.players = Collections.synchronizedSet(new HashSet<>());
        this.challenges = Collections.synchronizedSortedMap(new TreeMap<>());
    }

    @Synchronized
    private void sendUpdates() {
        setChanged();
        notifyObservers(getLobby());
        deleteObservers();
    }

    private PlayerDto getPlayer(String name) {
        Optional<PlayerDto> player = players.stream().filter(p -> p.getName().equals(name)).findFirst();
        return player.orElse(null);
    }

    private LobbyUpdateDto getLobby() {
        LobbyUpdateDto lobbyUpdateDto = new LobbyUpdateDto();
        lobbyUpdateDto.setPlayers(players);
        lobbyUpdateDto.setChallenges(challenges.values());
        return lobbyUpdateDto;
    }

    public void returnPlayersToLobby(ChallengeDto challenge) {
        players.add(challenge.getChallenger());
        players.add(challenge.getChallenged());
        removeChallenge(challenge.getChallenged().getName());
    }

    public ChallengeDto getChallenge (String challenged) {
        return challenges.get(challenged);
    }

    public LobbyUpdateDto addPlayer(PlayerDto player) {
        if ( players.add(player) ) {
            sendUpdates();
        }
        return getLobby();
    }

    public boolean addChallenge(String challenger, String challenged) {
        ChallengeDto challenge = new ChallengeDto();
        challenge.setChallenger(getPlayer(challenger));
        challenge.setChallenged(getPlayer(challenged));
        challenges.put(challenge.getChallenged().getName(), challenge);

        Iterable<PlayerDto> challengePlayers = players.stream().filter(player ->
            player.getName().equals(challenge.getChallenger().getName())
                    || player.getName().equals(challenge.getChallenged().getName())
        ).collect(Collectors.toList());

        removePlayers(challengePlayers);

        return true;
    }

    public void updateChallenge (ChallengeDto challenge){
        challenges.put(challenge.getChallenged().getName(), challenge);
        sendUpdates();
    }

    public void removeChallenge (String challenged) {
        challenges.remove(challenged);
        sendUpdates();
    }

    public boolean removePlayers(Iterable<PlayerDto> playersToRemove) {
        for (PlayerDto playerDto : playersToRemove) {
            players.remove(playerDto);
        }
        sendUpdates();

        return true;
    }
}
