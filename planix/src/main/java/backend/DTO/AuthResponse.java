package backend.DTO;

public class AuthResponse {
    private String token;
    private Long id;
    private String email;
    private String name;
    private String surname;
    private String nickname;
    private Integer profilePictureId;

    public AuthResponse(String token, Long id, String email, String name, String surname, String nickname, Integer profilePictureId) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.name = name;
        this.surname = surname;
        this.nickname = nickname;
        this.profilePictureId = profilePictureId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public Integer getProfilePictureId() {
        return profilePictureId;
    }

    public void setProfilePictureId(Integer profilePictureId) {
        this.profilePictureId = profilePictureId;
    }
}