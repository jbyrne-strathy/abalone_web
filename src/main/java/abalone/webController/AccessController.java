package abalone.webController;

import abalone.database.repository.PlayerRepository;
import abalone.database.entity.Player;
import abalone.dto.CreatePlayerDto;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
@AllArgsConstructor
public class AccessController {
    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping(value = "/createAccount")
    public String processAccount(CreatePlayerDto playerBean, ModelMap model) {
        int count = playerRepository.count( playerBean.getUsername() );
        System.out.println("Count: " + count);
        if ( count > 0 ) {
            return "redirect:/createAccount?error";
        }
        Player newPlayer = new Player( playerBean.getUsername(), passwordEncoder.encode( playerBean.getPassword() ) );
        System.out.println(newPlayer.getId());
        System.out.println(newPlayer.getUsername());
        System.out.println(newPlayer.getPassword());
        System.out.println(newPlayer.getEnabled());
        System.out.println(newPlayer.getRole());

        playerRepository.save( newPlayer );
        return "redirect:/access/login";
    }

    @GetMapping(value = "/createAccount")
    public String createAccount(Model model) {
        return "/access/createAccount";
    }

    @GetMapping(value = "/login")
    public String login(Model model) {
        return "/access/login";
    }
}
