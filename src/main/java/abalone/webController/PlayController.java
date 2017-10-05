package abalone.webController;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
@AllArgsConstructor
public class PlayController {
    /*private Facebook facebook;
    private ConnectionRepository connectionRepository;*/

    @GetMapping(value = "/game")
    public String game(Model model) {
//        if ( isFacebookNotConnected() ) {
//            return "redirect:/connect/facebook";
//        }
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
