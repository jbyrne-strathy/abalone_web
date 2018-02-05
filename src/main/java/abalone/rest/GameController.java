package abalone.rest;

import abalone.dto.PlayerDto;
import abalone.game.Lobby;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.async.DeferredResult;

import java.util.LinkedList;

/**
 * Created by james on 20/06/17.
 */
@RestController
@RequestMapping("/rest")
public class GameController {
    @Autowired
    private Lobby lobby;

    @GetMapping("/joinLobby")
    public Iterable<PlayerDto> joinLobby() {
        lobby.addPlayer( new PlayerDto(SecurityContextHolder.getContext().getAuthentication().getName()) );
        return lobby.getLobby();
    }

    @GetMapping("/getLobbyUpdates")
    public DeferredResult<Iterable<PlayerDto>> getLobbyUpdates() {
        DeferredResult<Iterable<PlayerDto>> result = new DeferredResult<>(Long.MAX_VALUE);
        lobby.addObserver( (lobby, lobbyUpdate) -> result.setResult((Iterable<PlayerDto>)lobbyUpdate) );
        return result;
    }

    @GetMapping("/getLeaderboard")
    public DeferredResult<Iterable<PlayerDto>> getLeaderboard() {
        leaveLobby();
        DeferredResult<Iterable<PlayerDto>> result = new DeferredResult<>(Long.MAX_VALUE);
        // TODO Replace this with proper leaderboard-dto getter
        result.setResult(new LinkedList<>());
        return  result;
    }

    @PostMapping("/leaveLobby")
    public void leaveLobby() {
        lobby.removePlayer( new PlayerDto(SecurityContextHolder.getContext().getAuthentication().getName()) );
    }
}
