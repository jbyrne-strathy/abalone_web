package abalone.repository;

import abalone.entity.Player;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface PlayerRepository extends CrudRepository<Player, String>{
    // Will be implemented by Spring-boot
    @Query("SELECT COUNT(p) FROM Player p WHERE p.name=:name")
    Integer count(@Param("name") String name);
}
