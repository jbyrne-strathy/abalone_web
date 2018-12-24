package abalone.rest;

import abalone.dto.GameStateDto;
import abalone.game.GameManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.async.DeferredResult;

import javax.websocket.server.PathParam;
import java.util.UUID;

@RestController
@RequestMapping("/game")
public class GameController {
    @Autowired
    private GameManager gameManager;

    @GetMapping("/loadGame")
    public DeferredResult<GameStateDto> loadGame(@PathParam("id") String id) {
        DeferredResult<GameStateDto> result = new DeferredResult<>();
        new Thread(() -> result.setResult(gameManager.getGame(UUID.fromString(id)))).start();
        return result;
    }
}
