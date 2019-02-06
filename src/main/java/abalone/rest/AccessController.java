package abalone.rest;

import abalone.entity.Player;
import abalone.repository.PlayerRepository;
import abalone.dto.CreatePlayerDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.async.DeferredResult;

import java.util.concurrent.ForkJoinPool;

/**
 * Created by james on 20/06/17.
 */
@RestController
@RequestMapping("/")
public class AccessController {
    private final PlayerRepository playerRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AccessController(PlayerRepository playerRepository, PasswordEncoder passwordEncoder) {
        this.playerRepository = playerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/createAccount")
    public DeferredResult<Boolean> createAccount(CreatePlayerDto createPlayerDto) {
        DeferredResult<Boolean> result = new DeferredResult<>();

        ForkJoinPool.commonPool().execute(() -> createAccountDeferred(createPlayerDto, result));

        return result;
    }

    private void createAccountDeferred(CreatePlayerDto createPlayerDto, DeferredResult<Boolean> result) {
        int count = playerRepository.count( createPlayerDto.getUsername() );
        System.out.println("Count: " + count);
        if ( count == 0 ) {
            Player newPlayer = new Player();
            newPlayer.setUsername(createPlayerDto.getUsername());
            newPlayer.setPassword(passwordEncoder.encode(createPlayerDto.getPassword()));

            playerRepository.save(newPlayer);
            result.setResult(true);
        }
        result.setResult(false);
    }

}
