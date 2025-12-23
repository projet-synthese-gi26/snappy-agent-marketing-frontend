package snappy.example.snappy.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import snappy.example.snappy.model.Contact;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactRepository extends ReactiveCrudRepository<Contact, Long> {
}