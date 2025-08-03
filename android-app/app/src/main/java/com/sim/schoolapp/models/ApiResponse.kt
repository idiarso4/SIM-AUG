package com.sim.schoolapp.models

// Generic API Response
data class ApiResponse<T>(
    val message: String,
    val data: T? = null,
    val errors: List<ValidationError>? = null
)

// Auth Response
data class AuthResponse(
    val message: String,
    val token: String,
    val user: User
)

// Students Response
data class StudentsResponse(
    val students: List<Student>
)

// Single Student Response
data class StudentResponse(
    val student: Student
)

// Teachers Response
data class TeachersResponse(
    val teachers: List<Teacher>
)

// Single Teacher Response
data class TeacherResponse(
    val teacher: Teacher
)

// User Response
data class UserResponse(
    val user: User
)

// Validation Error
data class ValidationError(
    val field: String,
    val message: String
)

// Login Request
data class LoginRequest(
    val username: String,
    val password: String
)

// Register Request
data class RegisterRequest(
    val username: String,
    val email: String,
    val password: String,
    val role: String,
    val firstName: String,
    val lastName: String,
    val phoneNumber: String? = null,
    val address: String? = null
)

// Update Profile Request
data class UpdateProfileRequest(
    val firstName: String,
    val lastName: String,
    val phoneNumber: String? = null,
    val address: String? = null
)

// Change Password Request
data class ChangePasswordRequest(
    val currentPassword: String,
    val newPassword: String
)
