// backend/Repository/TaskRepository.java
package backend.Repository;

import backend.Model.Task;
import backend.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUserOrderByStartTimeAsc(User user);
    List<Task> findByUserAndCategoryOrderByStartTimeAsc(User user, String category);

    List<Task> findByUserAndStartTimeBetweenOrderByStartTimeAsc(
            User user, LocalDateTime start, LocalDateTime end);

    List<Task> findByUserAndCategoryAndStartTimeBetweenOrderByStartTimeAsc(
            User user, String category, LocalDateTime start, LocalDateTime end);

    Optional<Task> findById(Long id);
}