package abalone.webController;

import abalone.database.entity.Player;
import abalone.database.repository.PlayerRepository;
import abalone.dto.PlayerDto;
import abalone.game.Lobby;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
@AllArgsConstructor
public class GameController {
    /*private Facebook facebook;
    private ConnectionRepository connectionRepository;*/

    @Autowired
    private Lobby lobby;

    @Autowired
    private PlayerRepository playerRepository;

    @GetMapping(value = "/game")
    public String game(Model model) {
//        if ( isFacebookNotConnected() ) {
//            return "redirect:/connect/facebook";
//        }
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Player currentPlayer = playerRepository.findOne(auth.getName());
        PlayerDto playerDto = new PlayerDto(currentPlayer.getUsername());
        lobby.addPlayer(playerDto);
        model.addAttribute("lobby", lobby.getLobby());
        return "/play/game";
    }

    @GetMapping(value = "/leaderboard")
    public String leaderboard(Model model) {
        model.addAttribute("leaderboard", "TODO"); //TODO Get the leaderboard
        return "/play/leaderboard";
    }

    /*private boolean isFacebookNotConnected() {
        return connectionRepository.findPrimaryConnection(Facebook.class) == null;
    }*/

}
