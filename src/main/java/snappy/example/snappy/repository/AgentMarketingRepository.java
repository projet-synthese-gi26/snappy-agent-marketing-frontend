package snappy.example.snappy.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import snappy.example.snappy.model.AgentMarketing;

public interface AgentMarketingRepository extends ReactiveCrudRepository<AgentMarketing, Long> {}