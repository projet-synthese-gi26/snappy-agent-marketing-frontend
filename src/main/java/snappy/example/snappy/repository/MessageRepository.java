package snappy.example.snappy.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import snappy.example.snappy.model.Message;

public interface MessageRepository extends ReactiveCrudRepository<Message, Long> {
    Flux<Message> findAllByDiscussionIdOrderByTimestampAsc(Long discussionId);
}