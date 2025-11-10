package backend.Service;

import backend.Model.Note;
import backend.Model.NoteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NoteService {

    private final NoteRepository repo;

    public NoteService(NoteRepository repo) {
        this.repo = repo;
    }

    public List<Note> getAll(Optional<String> category, Optional<Boolean> favorite) {
        if (category.isPresent() && favorite.isPresent()) {
            return repo.findByCategoryAndIsFavorite(category.get(), favorite.get());
        }
        if (category.isPresent()) {
            return repo.findByCategory(category.get());
        }
        if (favorite.orElse(false)) {
            return repo.findByIsFavoriteTrue();
        }
        return repo.findAll();
    }

    public Note getById(Long id) {
        return repo.findById(id).orElseThrow();
    }

    public Note create(Note n) {
        // createdAt/updatedAt se setează automat
        return repo.save(n);
    }

    public Note update(Long id, Note n) {
        // asigură-te că actualizezi rândul corect
        n.setId(id);
        return repo.save(n);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
