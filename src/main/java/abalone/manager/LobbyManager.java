package abalone.manager;

import abalone.entity.Challenge;
import abalone.entity.LobbyUpdate;
import abalone.entity.Player;
import lombok.Synchronized;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class LobbyManager extends Observable {
    private final Set<Player> players;
    private final SortedMap<String, Challenge> challenges;

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

    private Player getPlayer(String name) {
        Optional<Player> player = players.stream().filter(p -> p.getName().equals(name)).findFirst();
        return player.orElse(null);
    }

    private LobbyUpdate getLobby() {
        LobbyUpdate lobbyUpdate = new LobbyUpdate();
        lobbyUpdate.setPlayers(players);
        lobbyUpdate.setChallenges(challenges.values());
        return lobbyUpdate;
    }

    public void returnPlayersToLobby(Challenge challenge) {
        players.add(challenge.getChallenger());
        players.add(challenge.getChallenged());
        removeChallenge(challenge.getChallenged().getName());
    }

    public Challenge getChallenge (String challenged) {
        return challenges.get(challenged);
    }

    public LobbyUpdate addPlayer(Player player) {
        if ( players.add(player) ) {
            sendUpdates();
        }
        return getLobby();
    }

    public boolean addChallenge(String challenger, String challenged) {
        Challenge challenge = new Challenge();
        challenge.setChallenger(getPlayer(challenger));
        challenge.setChallenged(getPlayer(challenged));
        challenges.put(challenge.getChallenged().getName(), challenge);

        Iterable<String> challengePlayers = players.stream().filter(player ->
            player.getName().equals(challenge.getChallenger().getName())
                    || player.getName().equals(challenge.getChallenged().getName())
        ).map(Player::getName).collect(Collectors.toList());

        removePlayers(challengePlayers);

        return true;
    }

    public void updateChallenge (Challenge challenge){
        challenges.put(challenge.getChallenged().getName(), challenge);
        sendUpdates();
    }

    public void removeChallenge (String challenged) {
        challenges.remove(challenged);
        sendUpdates();
    }

    public boolean removePlayers(Iterable<String> playersToRemove) {
        playersToRemove.forEach(p -> players.removeIf(q -> q.getName().equals(p)));
        sendUpdates();

        return true;
    }
}
