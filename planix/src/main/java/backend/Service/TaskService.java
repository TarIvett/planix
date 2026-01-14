package backend.Service;

import backend.DTO.CreateTaskRequest;
import backend.DTO.TaskDTO;
import backend.DTO.UpdateTaskRequest;
import backend.Model.Task;
import backend.Model.User;
import backend.Repository.TaskRepository;
import backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    public TaskDTO createTask(String userEmail, CreateTaskRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = new Task(
                request.getTitle(),
                request.getDescription(),
                request.getCategory(),
                request.getColor(),
                request.getStartTime(),
                request.getEndTime(),
                user
        );

        Task savedTask = taskRepository.save(task);
        return convertToDTO(savedTask);
    }

    public List<TaskDTO> getUserTasks(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Task> tasks = taskRepository.findByUserOrderByStartTimeAsc(user);
        return tasks.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TaskDTO> getUserTasksByCategory(String userEmail, String category) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Task> tasks = taskRepository.findByUserAndCategoryOrderByStartTimeAsc(user, category);
        return tasks.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void deleteTask(String userEmail, Long taskId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to delete this task");
        }

        taskRepository.delete(task);
    }

    public TaskDTO completeTask(String userEmail, Long taskId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to complete this task");
        }

        task.setCompleted(true);
        Task updatedTask = taskRepository.save(task);

        return convertToDTO(updatedTask);
    }

    public TaskDTO toggleTask(String userEmail, Long taskId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to toggle this task");
        }
        task.setCompleted(!task.isCompleted());
        Task updatedTask = taskRepository.save(task);

        return convertToDTO(updatedTask);
    }

    public TaskDTO updateTask(String userEmail, Long taskId, UpdateTaskRequest updateRequest) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to edit this task");
        }

        if (updateRequest.getTitle() != null) {
            task.setTitle(updateRequest.getTitle());
        }

        if (updateRequest.getDescription() != null) {
            task.setDescription(updateRequest.getDescription());
        }

        if (updateRequest.getCategory() != null) {
            task.setCategory(updateRequest.getCategory());
        }

        if (updateRequest.getColor() != null) {
            task.setColor(updateRequest.getColor());
        }

        if (updateRequest.getStartTime() != null) {
            task.setStartTime(updateRequest.getStartTime());
        }

        if (updateRequest.getEndTime() != null) {
            task.setEndTime(updateRequest.getEndTime());
        }

        if (updateRequest.getCompleted() != null) {
            task.setCompleted(updateRequest.getCompleted());
        }

        Task updatedTask = taskRepository.save(task);
        return convertToDTO(updatedTask);
    }

    public List<TaskDTO> getTasksByDate(String userEmail, LocalDate date) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);

        List<Task> tasks = taskRepository.findByUserAndStartTimeBetweenOrderByStartTimeAsc(
                user, startOfDay, endOfDay
        );

        return tasks.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TaskDTO> getTasksByDateAndCategory(String userEmail, LocalDate date, String category) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);

        List<Task> tasks = taskRepository.findByUserAndCategoryAndStartTimeBetweenOrderByStartTimeAsc(
                user, category, startOfDay, endOfDay
        );

        return tasks.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private TaskDTO convertToDTO(Task task) {
        return new TaskDTO(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getCategory(),
                task.getColor(),
                task.getStartTime(),
                task.getEndTime(),
                task.getCreatedAt(),
                task.isCompleted()
        );
    }
}