package abalone.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.atomic.AtomicLong;

/**
 * Created by james on 20/06/17.
 */
@RestController
public class RestHandler {
    private static final String template = "Hello, %s!";
    private final AtomicLong counter = new AtomicLong();

    @RequestMapping("/restRequest")
    public RestResponse response(@RequestParam(value="name", defaultValue="World") String name) {
        return new RestResponse(counter.incrementAndGet(),
                String.format(template, name));
    }
}
