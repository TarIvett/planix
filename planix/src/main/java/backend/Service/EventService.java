package backend.Service;

import backend.DTO.EventRequestDTO;
import backend.Model.Event;
import backend.Model.User;
import backend.Repository.EventRepository;
import backend.Repository.UserRepository;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;

import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public EventService(EventRepository eventRepository, UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    public Event createEvent(EventRequestDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + dto.getUserId()));

        if (dto.getStartTime().isAfter(dto.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        Event event = new Event();
        event.setTitle(dto.getTitle());
        event.setDate(dto.getDate());
        event.setStartTime(dto.getStartTime());
        event.setEndTime(dto.getEndTime());
        event.setDescription(dto.getDescription());
        event.setColor(dto.getColor());
        event.setUserId(dto.getUserId());

        return eventRepository.save(event);
    }

    public Event updateEvent(Long eventId, Long userId, EventRequestDTO dto) {
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new EntityNotFoundException("Event not found"));

        if (!event.getUserId().equals(userId)) {
            throw new SecurityException("You are not allowed to edit this event");
        }

        if (dto.getStartTime().isAfter(dto.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        event.setTitle(dto.getTitle());
        event.setDate(dto.getDate());
        event.setStartTime(dto.getStartTime());
        event.setEndTime(dto.getEndTime());
        event.setDescription(dto.getDescription());
        event.setColor(dto.getColor());

        return eventRepository.save(event);
    }


    public void deleteEvent(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new EntityNotFoundException("Event not found"));

        eventRepository.delete(event);
    }

    public List<Event> getEventsByUser(Long userId) {
        return eventRepository.findByUserId(userId);
    }
}
