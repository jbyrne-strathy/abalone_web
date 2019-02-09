package abalone.entity;

import lombok.Data;

import java.util.UUID;

@Data
public class Challenge {
    private Player challenger;
    private Player challenged;
    private UUID gameID;
}
