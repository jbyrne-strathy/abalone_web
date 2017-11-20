package abalone.security;

import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class AccessKeyHandler {
    private class Key implements Comparable<UUID> {
        public UUID key;
        public Date expiry;
        public String userName;

        @Override
        public int compareTo(UUID other) {
            return key.toString().compareTo(other.toString());
        }
    }
    private List<Key> keys = new ArrayList<>();

    public boolean validate(UUID key)
    {
        int index = Collections.binarySearch(keys, key);
        return ( index >= 0 && keys.get(index).expiry.getTime() < System.currentTimeMillis() );
    }
}
