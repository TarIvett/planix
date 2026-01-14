// backend/Service/NoteService.java
package backend.Service;

import backend.Model.Note;
import backend.Model.User;
import backend.Repository.NoteRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NoteService {

    private final NoteRepository repo;
    private final AuthUserProvider auth;

    @PersistenceContext
    private EntityManager em;

    public NoteService(NoteRepository repo, AuthUserProvider auth) {
        this.repo = repo;
        this.auth = auth;
    }

    public List<Note> getAll(Optional<String> category, Optional<Boolean> favorite) {
        Long uid = auth.currentUser().getId();

        if (category.isPresent() && favorite.isPresent()) {
            return repo.findByUserIdAndCategoryAndIsFavoriteOrderByUpdatedAtDesc(uid, category.get(), favorite.get());
        }
        if (category.isPresent()) {
            return repo.findByUserIdAndCategoryOrderByUpdatedAtDesc(uid, category.get());
        }
        if (favorite.orElse(false)) {
            return repo.findByUserIdAndIsFavoriteTrueOrderByUpdatedAtDesc(uid);
        }
        return repo.findByUserIdOrderByUpdatedAtDesc(uid);
    }

    public Note getById(Long id) {
        Long uid = auth.currentUser().getId();
        return repo.findByIdAndUserId(id, uid).orElseThrow();
    }

    public Note create(Note n) {
        Long uid = auth.currentUser().getId();
        User ref = em.getReference(User.class, uid);
        n.setUser(ref);

        n.setTitle(n.getTitle() == null ? "" : n.getTitle().trim());
        n.setCategory(normalizeCategory(n.getCategory()));
        n.setContent(n.getContent() == null ? "" : n.getContent()); // NU folosim jsoup

        return repo.save(n);
    }

    public Note update(Long id, Note n) {
        Note existing = getById(id); // 404 dacă nu aparține userului

        existing.setTitle(n.getTitle() == null ? "" : n.getTitle().trim());
        existing.setCategory(normalizeCategory(n.getCategory()));
        existing.setFavorite(n.isFavorite());
        existing.setContent(n.getContent() == null ? "" : n.getContent());

        return repo.save(existing);
    }

    public void delete(Long id) {
        Note existing = getById(id);
        repo.delete(existing);
    }

    private String normalizeCategory(String category) {
        if (category == null || category.isBlank()) return "Personal";
        return switch (category) {
            case "Study", "Work", "Travel", "Personal" -> category;
            default -> "Personal";
        };
    }
}
