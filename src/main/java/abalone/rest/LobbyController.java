package abalone.rest;

import abalone.dto.ChallengeDto;
import abalone.dto.LobbyUpdateDto;
import abalone.dto.PlayerDto;
import abalone.game.GameManager;
import abalone.game.LobbyManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.async.DeferredResult;

import java.util.Collection;
import java.util.LinkedList;
import java.util.UUID;

/**
 * Created by james on 20/06/17.
 */
@RestController
@RequestMapping("/lobby")
public class LobbyController {
    @Autowired
    private LobbyManager lobbyManager;

    @Autowired
    private GameManager gameManager;

    private String getCurrentPlayerName() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping("/joinLobby")
    public LobbyUpdateDto joinLobby() {
        lobbyManager.addPlayer( new PlayerDto(SecurityContextHolder.getContext().getAuthentication().getName()) );
        return lobbyManager.getLobby();
    }

    @GetMapping("/getLobbyUpdates")
    public DeferredResult<LobbyUpdateDto> getLobbyUpdates() {
        DeferredResult<LobbyUpdateDto> result = new DeferredResult<>(Long.MAX_VALUE);
        lobbyManager.addObserver( (lobby, lobbyUpdate) -> result.setResult((LobbyUpdateDto)lobbyUpdate) );
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
        lobbyManager.removePlayers(toDelete);
    }

    @PostMapping("/sendChallenge")
    public void sendChallenge(String challengedPlayer) {
        ChallengeDto challenge = new ChallengeDto();
        challenge.setChallenged(lobbyManager.getPlayer(challengedPlayer));
        challenge.setChallenger(lobbyManager.getPlayer(getCurrentPlayerName()));
        lobbyManager.addChallenge(challenge);
    }

    @PostMapping("/answerChallenge")
    public UUID answerChallenge(Boolean isAccepted) {
        ChallengeDto challenge = lobbyManager.getChallenge(getCurrentPlayerName());
        if (isAccepted) {
            UUID gameId = gameManager.createGame(challenge);
            if (gameId != null) {
                challenge.setGameID(gameId);
                lobbyManager.updateChallenge(challenge);
            } else {
                lobbyManager.returnPlayersToLobby(challenge);
            }
            return gameId;
        } else {
            lobbyManager.returnPlayersToLobby(challenge);
            return null;
        }
    }
}
