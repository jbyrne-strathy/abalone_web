package abalone.security;

import abalone.database.entity.Player;
import abalone.database.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import static java.util.Collections.emptyList;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    private PlayerRepository playerRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Player player = playerRepository.findOne(username);
        if (player == null) {
            throw new UsernameNotFoundException(username);
        }
        return new User(player.getUsername(), player.getPassword(), emptyList());
    }
}