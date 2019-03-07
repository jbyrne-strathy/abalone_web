package abalone.manager;

import abalone.entity.Challenge;
import abalone.entity.GameState;
import abalone.entity.Move;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.MapType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.*;

@Component
public class GameManager {
    private final SortedMap<UUID, GameState> games;

    @Value("${abalone.layouts.default}")
    private String defaultLayout;

    public GameManager() {
        this.games = Collections.synchronizedSortedMap(new TreeMap<>());
    }

    public UUID createGame(Challenge challenge) {
        try {
            GameState newGame = new GameState();
            newGame.setPlayer1(challenge.getChallenger());
            newGame.setPlayer2(challenge.getChallenged());

            ObjectMapper mapper = new ObjectMapper();
            MapType mapType = mapper.getTypeFactory().constructMapType(SortedMap.class, String.class, Integer.class);
            newGame.setBoard(mapper.readValue(defaultLayout, mapType));

            games.put(newGame.getId(), newGame);

            return newGame.getId();
        } catch (IOException e) {
            return null;
        }
    }

    public GameState removeGame(GameState game) {
        return games.remove(game.getId());
    }

    public GameState getGame(UUID id) {
        return games.get(id);
    }

    public GameState makeMove(UUID gameId, Iterable<Move> moves) {
        GameState gameState = getGame(gameId);
        moves.forEach(move -> move.setPlayer(gameState.getMarbleAtSpace(move.getFrom())));
        moves.forEach(move -> gameState.setMarble(move.getFrom(), 0));
        moves.forEach(move -> gameState.setMarble(move.getTo(), move.getPlayer()));
        return gameState;
    }
}
