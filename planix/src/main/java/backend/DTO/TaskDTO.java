package backend.DTO;

import java.time.LocalDateTime;

public class TaskDTO {
    private Long id;
    private String title;
    private String description;
    private String category;
    private String color;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime createdAt;
    private boolean completed;

    public TaskDTO() {}

    public TaskDTO(Long id, String title, String description, String category, String color,
                   LocalDateTime startTime, LocalDateTime endTime, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.color = color;
        this.startTime = startTime;
        this.endTime = endTime;
        this.createdAt = createdAt;
        this.completed = false;
    }

    public TaskDTO(Long id, String title, String description, String category, String color,
                   LocalDateTime startTime, LocalDateTime endTime, LocalDateTime createdAt,
                   boolean completed) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.color = color;
        this.startTime = startTime;
        this.endTime = endTime;
        this.createdAt = createdAt;
        this.completed = completed;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
}