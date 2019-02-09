package abalone.rest;

import abalone.dto.GameStateDto;
import abalone.dto.LobbyUpdateDto;
import abalone.dto.PlayerDto;
import abalone.entity.Challenge;
import abalone.entity.GameState;
import abalone.entity.LobbyUpdate;
import abalone.entity.Player;
import abalone.manager.GameManager;
import abalone.manager.LobbyManager;
import abalone.mapper.EntityDtoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.async.DeferredResult;

import javax.websocket.server.PathParam;
import java.util.Collections;
import java.util.LinkedList;
import java.util.UUID;
import java.util.concurrent.ForkJoinPool;

/**
 * Created by james on 20/06/17.
 */
@RestController
@RequestMapping("/game")
public class GameController {
    private final LobbyManager lobbyManager;
    private final GameManager gameManager;
    private final EntityDtoMapper entityDtoMapper;

    @Autowired
    public GameController(LobbyManager lobbyManager, GameManager gameManager, EntityDtoMapper entityDtoMapper) {
        this.lobbyManager = lobbyManager;
        this.gameManager = gameManager;
        this.entityDtoMapper = entityDtoMapper;
    }

    private String getCurrentPlayerName() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping("/joinLobby")
    public DeferredResult<LobbyUpdateDto> joinLobby() {
        DeferredResult<LobbyUpdateDto> result = new DeferredResult<>();

        String myName = getCurrentPlayerName();

        Player thisPlayer = new Player();
        thisPlayer.setName(myName);
        ForkJoinPool.commonPool().execute(() -> {
            LobbyUpdate lobbyUpdate = lobbyManager.addPlayer(thisPlayer);

            LobbyUpdateDto dto = entityDtoMapper.entityToDto(lobbyUpdate);
            result.setResult(dto);
        });

        return result;
    }

    @GetMapping("/getLobbyUpdates")
    public DeferredResult<LobbyUpdateDto> getLobbyUpdates() {
        DeferredResult<LobbyUpdateDto> result = new DeferredResult<>(Long.MAX_VALUE);

        lobbyManager.addObserver( (lobby, lobbyUpdate) -> {
            LobbyUpdate update = (LobbyUpdate)lobbyUpdate;

            result.setResult(entityDtoMapper.entityToDto(update));
        });

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
    public DeferredResult<Boolean> leaveLobby() {
        DeferredResult<Boolean> result = new DeferredResult<>();

        ForkJoinPool.commonPool().execute(() -> {
            String myName = getCurrentPlayerName();

            Iterable<String> toDelete = Collections.singletonList(myName);
            result.setResult(lobbyManager.removePlayers(toDelete));
        });

        return result;
    }

    @PostMapping("/sendChallenge")
    public DeferredResult<Boolean> sendChallenge(String challengedPlayer) {
        DeferredResult<Boolean> result = new DeferredResult<>();

        String myName = getCurrentPlayerName();
        ForkJoinPool.commonPool().execute(() -> result.setResult(lobbyManager.addChallenge(myName, challengedPlayer)));

        return result;
    }

    @PostMapping("/answerChallenge")
    public DeferredResult<UUID> answerChallenge(Boolean isAccepted) {
        DeferredResult<UUID> result = new DeferredResult<>();

        String myName = getCurrentPlayerName();
        ForkJoinPool.commonPool().execute(() -> {
            UUID gameId = null;
            Challenge challenge = lobbyManager.getChallenge(myName);
            if (isAccepted) {
                gameId = gameManager.createGame(challenge);
                if (gameId != null) {
                    challenge.setGameID(gameId);
                    lobbyManager.updateChallenge(challenge);
                } else {
                    lobbyManager.returnPlayersToLobby(challenge);
                }
            } else {
                lobbyManager.returnPlayersToLobby(challenge);
            }
            result.setResult(gameId);
        });

        return result;
    }

    @GetMapping("/loadGame")
    public DeferredResult<GameStateDto> loadGame(@PathParam("id") String id) {
        DeferredResult<GameStateDto> result = new DeferredResult<>();

        ForkJoinPool.commonPool().execute(() -> {
            GameState game = gameManager.getGame(UUID.fromString(id));
            lobbyManager.removeChallenge(game.getPlayer2().getName());

            result.setResult(entityDtoMapper.entityToDto(game));
        });

        return result;
    }
}
