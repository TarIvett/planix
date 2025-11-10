package backend.Controller;

import backend.Model.Note;
import backend.Service.NoteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteService service;

    public NoteController(NoteService service) { this.service = service; }

    // GET /api/notes?category=Personal&favorite=true
    @GetMapping
    public List<Note> all(
            @RequestParam Optional<String> category,
            @RequestParam Optional<Boolean> favorite
    ) {
        return service.getAll(category, favorite);
    }

    @GetMapping("/{id}")
    public Note one(@PathVariable Long id) { return service.getById(id); }

    @PostMapping
    public Note create(@RequestBody Note note) { return service.create(note); }

    @PutMapping("/{id}")
    public Note update(@PathVariable Long id, @RequestBody Note note) { return service.update(id, note); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}
