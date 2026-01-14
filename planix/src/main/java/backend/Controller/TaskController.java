package backend.Controller;

import backend.DTO.CreateTaskRequest;
import backend.DTO.TaskDTO;
import backend.DTO.UpdateTaskRequest;
import backend.Service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskDTO> createTask(
            @RequestBody CreateTaskRequest request,
            Authentication authentication) {

        String userEmail = authentication.getName();
        TaskDTO createdTask = taskService.createTask(userEmail, request);
        return ResponseEntity.ok(createdTask);
    }

    @GetMapping("/filter")
    public ResponseEntity<List<TaskDTO>> getTasksWithFilters(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            Authentication authentication) {

        String userEmail = authentication.getName();
        List<TaskDTO> tasks;

        if (date != null && category != null) {
            tasks = taskService.getTasksByDateAndCategory(userEmail, date, category);
        } else if (date != null) {
            tasks = taskService.getTasksByDate(userEmail, date);
        } else if (category != null) {
            tasks = taskService.getUserTasksByCategory(userEmail, category);
        } else {
            tasks = taskService.getUserTasks(userEmail);
        }

        return ResponseEntity.ok(tasks);
    }

    @GetMapping
    public ResponseEntity<List<TaskDTO>> getUserTasks(Authentication authentication) {
        String userEmail = authentication.getName();
        List<TaskDTO> tasks = taskService.getUserTasks(userEmail);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<TaskDTO>> getUserTasksByCategory(
            @PathVariable String category,
            Authentication authentication) {

        String userEmail = authentication.getName();
        List<TaskDTO> tasks = taskService.getUserTasksByCategory(userEmail, category);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<TaskDTO>> getTasksByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            Authentication authentication) {

        String userEmail = authentication.getName();
        List<TaskDTO> tasks = taskService.getTasksByDate(userEmail, date);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/date/{date}/category/{category}")
    public ResponseEntity<List<TaskDTO>> getTasksByDateAndCategory(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @PathVariable String category,
            Authentication authentication) {

        String userEmail = authentication.getName();
        List<TaskDTO> tasks = taskService.getTasksByDateAndCategory(userEmail, date, category);
        return ResponseEntity.ok(tasks);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<?> deleteTask(
            @PathVariable Long taskId,
            Authentication authentication) {

        String userEmail = authentication.getName();
        taskService.deleteTask(userEmail, taskId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{taskId}/complete")
    public ResponseEntity<TaskDTO> completeTask(
            @PathVariable Long taskId,
            Authentication authentication) {

        String userEmail = authentication.getName();
        TaskDTO completedTask = taskService.completeTask(userEmail, taskId);
        return ResponseEntity.ok(completedTask);
    }

    @PutMapping("/{taskId}/toggle")
    public ResponseEntity<TaskDTO> toggleTask(
            @PathVariable Long taskId,
            Authentication authentication) {

        String userEmail = authentication.getName();
        TaskDTO toggledTask = taskService.toggleTask(userEmail, taskId);
        return ResponseEntity.ok(toggledTask);
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<TaskDTO> updateTask(
            @PathVariable Long taskId,
            @RequestBody UpdateTaskRequest updateRequest,
            Authentication authentication) {

        String userEmail = authentication.getName();
        try {
            TaskDTO updatedTask = taskService.updateTask(userEmail, taskId, updateRequest);
            return ResponseEntity.ok(updatedTask);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).build();
        }
    }
}