package snappy.example.snappy.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;
import snappy.example.snappy.model.Discussion;

public interface DiscussionRepository extends ReactiveCrudRepository<Discussion, Long> {
    Mono<Discussion> findByContactId(Long contactId);
}