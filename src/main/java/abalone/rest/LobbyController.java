package abalone.rest;

import abalone.dto.ChallengeDto;
import abalone.dto.LobbyUpdateDto;
import abalone.dto.PlayerDto;
import abalone.game.Lobby;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.async.DeferredResult;

import java.util.Collection;
import java.util.LinkedList;

/**
 * Created by james on 20/06/17.
 */
@RestController
@RequestMapping("/lobby")
public class LobbyController {
    @Autowired
    private Lobby lobby;

    private String getCurrentPlayerName() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping("/joinLobby")
    public LobbyUpdateDto joinLobby() {
        lobby.addPlayer( new PlayerDto(SecurityContextHolder.getContext().getAuthentication().getName()) );
        return lobby.getLobby();
    }

    @GetMapping("/getLobbyUpdates")
    public DeferredResult<LobbyUpdateDto> getLobbyUpdates() {
        DeferredResult<LobbyUpdateDto> result = new DeferredResult<>(Long.MAX_VALUE);
        lobby.addObserver( (lobby, lobbyUpdate) -> result.setResult((LobbyUpdateDto)lobbyUpdate) );
        return result;
    }

    @GetMapping("/getLeaderboard")
    public DeferredResult<Iterable<PlayerDto>> getLeaderboard() {
        DeferredResult<Iterable<PlayerDto>> result = new DeferredResult<>(Long.MAX_VALUE);
        // TODO Replace this with proper leaderboard-dto getter
        result.setResult(new LinkedList<>());
        return  result;
    }

    @PostMapping("/leaveLobby")
    public void leaveLobby() {
        Collection<PlayerDto> toDelete = new LinkedList<>();
        toDelete.add(new PlayerDto(getCurrentPlayerName()));
        lobby.removePlayers(toDelete);
    }

    @PostMapping("/sendChallenge")
    public void sendChallenge(String challengedPlayer) {
        ChallengeDto challenge = new ChallengeDto();
        challenge.setChallenged(lobby.getPlayer(challengedPlayer));
        challenge.setChallenger(lobby.getPlayer(getCurrentPlayerName()));
        lobby.addChallenge(challenge);
    }

    @PostMapping("/answerChallenge")
    public void answerChallenge(Boolean isAccepted) {
        ChallengeDto challenge = lobby.getChallenge(getCurrentPlayerName());
        challenge.setIsAccepted(isAccepted);
        if (isAccepted) {
            // TODO Create new game with both players
        } else {
            lobby.returnPlayersToLobby(challenge);
        }
    }
}
