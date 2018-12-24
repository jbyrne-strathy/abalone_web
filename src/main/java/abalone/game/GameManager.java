package abalone.game;

import abalone.dto.BoardDto;
import abalone.dto.ChallengeDto;
import abalone.dto.GameStateDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collections;
import java.util.SortedMap;
import java.util.TreeMap;
import java.util.UUID;

@Component
public class GameManager {
    private SortedMap<UUID, GameStateDto> games = Collections.synchronizedSortedMap(new TreeMap<>());

    @Value("${abalone.layouts.default}")
    private String defaultLayout;

    public UUID createGame(ChallengeDto challengeDto) {
        try {
            GameStateDto newGame = new GameStateDto();
            newGame.setPlayer1(challengeDto.getChallenger());
            newGame.setPlayer2(challengeDto.getChallenged());
            newGame.setBoard(new ObjectMapper().readValue(defaultLayout, BoardDto.class));

            games.put(newGame.getId(), newGame);

            return newGame.getId();
        } catch (IOException e) {
            return null;
        }
    }

    public GameStateDto removeGame(GameStateDto game) {
        return games.remove(game.getId());
    }

    public GameStateDto getGame(UUID id) {
        return games.get(id);
    }
}