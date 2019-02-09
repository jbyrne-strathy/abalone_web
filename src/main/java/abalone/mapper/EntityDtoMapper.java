package abalone.mapper;

import abalone.dto.*;
import abalone.entity.Challenge;
import abalone.entity.GameState;
import abalone.entity.LobbyUpdate;
import abalone.entity.Player;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class EntityDtoMapper {
    public PlayerDto entityToDto(Player player) {
        return new PlayerDto(player.getName());
    }

    public Player dtoToEntity(CreatePlayerDto createPlayerDto) {
        Player player = new Player();

        player.setName(createPlayerDto.getUsername());
        player.setPassword(createPlayerDto.getPassword());

        return player;
    }

    public ChallengeDto entityToDto(Challenge challenge) {
        PlayerDto challenger = entityToDto(challenge.getChallenger());
        PlayerDto challenged = entityToDto(challenge.getChallenged());
        UUID gameId = challenge.getGameID();
        return new ChallengeDto(challenger, challenged, gameId);
    }

    public GameStateDto entityToDto(GameState gameState) {
        UUID gameId = gameState.getId();
        PlayerDto player1 = entityToDto(gameState.getPlayer1());
        PlayerDto player2 = entityToDto(gameState.getPlayer2());
        SortedMap<String, Integer> board = Collections.unmodifiableSortedMap(gameState.getBoard());
        int winner = gameState.getWinner();
        int currentPlayer = gameState.getCurrentPlayer();
        int player1Score = gameState.getPlayer1Score();
        int player2Score = gameState.getPlayer2Score();

        return new GameStateDto(gameId, player1, player2, board, winner, currentPlayer, player1Score, player2Score);
    }

    public LobbyUpdateDto entityToDto(LobbyUpdate lobbyUpdate) {
        List<PlayerDto> playerDtos = new ArrayList<>();
        lobbyUpdate.getPlayers().forEach(player -> playerDtos.add(entityToDto(player)));

        List<ChallengeDto> challengeDtos = new ArrayList<>();
        lobbyUpdate.getChallenges().forEach(challenge -> challengeDtos.add(entityToDto(challenge)));

        return new LobbyUpdateDto(playerDtos, challengeDtos);
    }
}
