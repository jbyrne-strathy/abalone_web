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
import java.util.concurrent.ForkJoinPool;

@RestController
@RequestMapping("/game")
public class GameController {
    private final GameManager gameManager;

    @Autowired
    public GameController(GameManager gameManager) {
        this.gameManager = gameManager;
    }

    @GetMapping("/loadGame")
    public DeferredResult<GameStateDto> loadGame(@PathParam("id") String id) {
        DeferredResult<GameStateDto> result = new DeferredResult<>();

        ForkJoinPool.commonPool().execute(() -> result.setResult(gameManager.getGame(UUID.fromString(id))));

        return result;
    }
}
