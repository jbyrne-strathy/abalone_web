package abalone.database.repository;

import abalone.database.entity.Player;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface PlayerRepository extends CrudRepository<Player, String>{
    // Will be implemented by Spring-boot
    @Query("SELECT COUNT(p) FROM Player p WHERE p.username=:username")
    Integer count(@Param("username") String username);
}
