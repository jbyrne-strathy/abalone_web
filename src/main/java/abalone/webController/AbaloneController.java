package abalone.webController;

import lombok.AllArgsConstructor;
import org.springframework.social.connect.ConnectionRepository;
import org.springframework.social.facebook.api.Facebook;
import org.springframework.social.facebook.api.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/")
@AllArgsConstructor
public class AbaloneController {

    private Facebook facebook;
    private ConnectionRepository connectionRepository;

    @GetMapping(value = "/")
    public String home(Model model) {
        return "redirect:/lobby";
    }

    @GetMapping(value="/lobby")
    public String lobby(Model model) {
//        if ( isFacebookNotConnected() ) {
//            return "redirect:/connect/facebook";
//        }
//        model.addAttribute("userName", facebook.userOperations().getUserProfile().getName());
//        model.addAttribute("friends", facebook.friendOperations().getFriendIds());
//        model.addAttribute("lang", facebook.userOperations().getUserProfile().getLocale());
        List<User> players = new ArrayList<>(); // TODO Get list of available opponents
        model.addAttribute("players", players);
        return "/lobby";
    }

    @GetMapping(value = "/login")
    public String login(Model model) {
        return "/login";
    }

    @GetMapping(value = "/game")
    public String game(Model model) {
//        if ( isFacebookNotConnected() ) {
//            return "redirect:/connect/facebook";
//        }
        return "/game";
    }

    @GetMapping(value = "/leaderboard")
    public String leaderboard(Model model) {
        model.addAttribute("leaderboard", "TODO"); //TODO Get the leaderboard
        return "/leaderboard";
    }

    private boolean isFacebookNotConnected() {
        return connectionRepository.findPrimaryConnection(Facebook.class) == null;
    }

}
