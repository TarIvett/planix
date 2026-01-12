// backend/DTO/UpdateTaskRequest.java
package backend.DTO;

import java.time.LocalDateTime;

public class UpdateTaskRequest {
    private String title;
    private String description;
    private String category;
    private String color;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Boolean completed;

    public UpdateTaskRequest() {}

    public UpdateTaskRequest(String title, String description, String category, String color,
                             LocalDateTime startTime, LocalDateTime endTime, Boolean completed) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.color = color;
        this.startTime = startTime;
        this.endTime = endTime;
        this.completed = completed;
    }

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

    public Boolean getCompleted() { return completed; }
    public void setCompleted(Boolean completed) { this.completed = completed; }
}