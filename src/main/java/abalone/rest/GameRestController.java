package abalone.rest;

import abalone.dto.PlayerDto;
import abalone.game.Lobby;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.async.DeferredResult;

/**
 * Created by james on 20/06/17.
 */
@RestController
@RequestMapping("/rest")
public class GameRestController {

    @Autowired
    private Lobby lobby;

    @GetMapping("/getLobby")
    public Iterable<PlayerDto> getLobby() {
        return lobby.getLobby();
    }

    @GetMapping("/getLobbyUpdates")
    public DeferredResult<Iterable<PlayerDto>> getLobbyUpdates() {
        DeferredResult<Iterable<PlayerDto>> result = new DeferredResult<>(Long.MAX_VALUE);
        lobby.addObserver((lobby, lobbyUpdate) -> {result.setResult((Iterable<PlayerDto>)lobbyUpdate);});
        return result;
    }
}
