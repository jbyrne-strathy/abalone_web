package abalone.webController;

import abalone.dto.CreatePlayerDto;
import abalone.database.repository.PlayerRepository;
import abalone.database.table.Player;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.social.connect.ConnectionRepository;
import org.springframework.social.facebook.api.Facebook;
import org.springframework.social.facebook.api.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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

    @GetMapping(value = "/createAccount")
    public String createAccount(Model model) {
        return "/createAccount";
    }

    @Autowired
    private PlayerRepository playerRepository;

    @PostMapping(value = "/createAccount")
    public String processAccount(CreatePlayerDto playerBean, ModelMap model) {
        int count = playerRepository.count( playerBean.getUsername() );
        System.out.println("Count: " + count);
        if ( count > 0 ) {
            return "redirect:/createAccount?error";
        }
        Player newPlayer = new Player( playerBean.getUsername(), playerBean.getPassword() );
        System.out.println(newPlayer.getId());
        System.out.println(newPlayer.getUsername());
        System.out.println(newPlayer.getPassword());
        System.out.println(newPlayer.getEnabled());
        System.out.println(newPlayer.getRole());

        playerRepository.save( newPlayer );
        return "redirect:/login";
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
