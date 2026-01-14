// backend/Repository/NoteRepository.java
package backend.Repository;

import backend.Model.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUserIdOrderByUpdatedAtDesc(Long userId);
    List<Note> findByUserIdAndCategoryOrderByUpdatedAtDesc(Long userId, String category);
    List<Note> findByUserIdAndIsFavoriteTrueOrderByUpdatedAtDesc(Long userId);
    List<Note> findByUserIdAndCategoryAndIsFavoriteOrderByUpdatedAtDesc(Long userId, String category, boolean isFavorite);
    Optional<Note> findByIdAndUserId(Long id, Long userId);
}
