package abalone.rest;

import abalone.database.entity.Player;
import abalone.database.repository.PlayerRepository;
import abalone.dto.CreatePlayerDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.async.DeferredResult;

/**
 * Created by james on 20/06/17.
 */
@RestController
@RequestMapping("/")
public class AccessController {
    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/createAccount")
    public DeferredResult<Boolean> createAccount(CreatePlayerDto createPlayerDto) {
        DeferredResult<Boolean> result = new DeferredResult<>();
        new Thread(() -> createAccountDeferred(createPlayerDto, result)).run();
        return result;
    }

    private void createAccountDeferred(CreatePlayerDto createPlayerDto, DeferredResult<Boolean> result) {
        int count = playerRepository.count( createPlayerDto.getUsername() );
        System.out.println("Count: " + count);
        if ( count == 0 ) {
            Player newPlayer = new Player(createPlayerDto.getUsername(), passwordEncoder.encode(createPlayerDto.getPassword()));
            System.out.println(newPlayer.getUsername());
            System.out.println(newPlayer.getPassword());

            playerRepository.save(newPlayer);
            result.setResult(true);
        }
        result.setResult(false);
    }

}
