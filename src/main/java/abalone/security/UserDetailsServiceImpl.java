package abalone.security;

import abalone.entity.Player;
import abalone.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import static java.util.Collections.emptyList;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final PlayerRepository playerRepository;

    @Autowired
    public UserDetailsServiceImpl (PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Player player = playerRepository.findOne(username);
        if (player == null) {
            throw new UsernameNotFoundException(username);
        }
        return new User(player.getName(), player.getPassword(), emptyList());
    }
}