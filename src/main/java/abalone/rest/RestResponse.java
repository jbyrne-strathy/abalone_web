package abalone.rest;

/**
 * Created by james on 20/06/17.
 */
public class RestResponse {
    private final long id;
    private final String content;

    RestResponse(long id, String content) {
        this.id = id;
        this.content = content;
    }

    public long getId() {
        return id;
    }

    public String getContent() {
        return content;
    }
}
