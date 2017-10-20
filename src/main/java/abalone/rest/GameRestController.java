package abalone.rest;

import abalone.dto.PlayerDto;
import abalone.game.Lobby;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by james on 20/06/17.
 */
@RestController
@RequestMapping("/rest")
public class GameRestController {

    @Autowired
    private Lobby lobby;

    @RequestMapping("/getLobby")
    public Iterable<PlayerDto> response() {
        return lobby.getLobby();
    }
}
