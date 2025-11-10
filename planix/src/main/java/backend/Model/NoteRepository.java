package backend.Model;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByCategory(String category);
    List<Note> findByIsFavoriteTrue();
    List<Note> findByCategoryAndIsFavorite(String category, boolean isFavorite);
}
