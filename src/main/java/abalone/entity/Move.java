package abalone.entity;

import lombok.Data;

@Data
public class Move {
    private String from;
    private String to;
    private int player;
}
