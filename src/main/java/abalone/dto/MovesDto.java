package abalone.dto;

import lombok.Value;

import java.util.List;
import java.util.UUID;

@Value
public class MovesDto {
    private UUID gameId;
    private List<MoveDto> moves;
}
