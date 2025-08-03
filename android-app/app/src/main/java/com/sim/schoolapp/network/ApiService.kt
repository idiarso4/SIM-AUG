package com.sim.schoolapp.network

import com.sim.schoolapp.models.*
import retrofit2.Response
import retrofit2.http.*

interface ApiService {
    
    // Auth endpoints
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>
    
    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<AuthResponse>
    
    @GET("auth/me")
    suspend fun getCurrentUser(): Response<UserResponse>
    
    @PUT("auth/profile")
    suspend fun updateProfile(@Body request: UpdateProfileRequest): Response<ApiResponse<User>>
    
    @PUT("auth/change-password")
    suspend fun changePassword(@Body request: ChangePasswordRequest): Response<ApiResponse<String>>
    
    @POST("auth/logout")
    suspend fun logout(): Response<ApiResponse<String>>
    
    // Students endpoints
    @GET("students")
    suspend fun getAllStudents(): Response<StudentsResponse>
    
    @GET("students/{id}")
    suspend fun getStudentById(@Path("id") id: String): Response<StudentResponse>
    
    @POST("students")
    suspend fun createStudent(@Body student: Student): Response<ApiResponse<Student>>
    
    @PUT("students/{id}")
    suspend fun updateStudent(@Path("id") id: String, @Body student: Student): Response<ApiResponse<Student>>
    
    @DELETE("students/{id}")
    suspend fun deleteStudent(@Path("id") id: String): Response<ApiResponse<String>>
    
    // Teachers endpoints
    @GET("teachers")
    suspend fun getAllTeachers(): Response<TeachersResponse>
    
    @GET("teachers/{id}")
    suspend fun getTeacherById(@Path("id") id: String): Response<TeacherResponse>
    
    @POST("teachers")
    suspend fun createTeacher(@Body teacher: Teacher): Response<ApiResponse<Teacher>>
    
    @PUT("teachers/{id}")
    suspend fun updateTeacher(@Path("id") id: String, @Body teacher: Teacher): Response<ApiResponse<Teacher>>
    
    @DELETE("teachers/{id}")
    suspend fun deleteTeacher(@Path("id") id: String): Response<ApiResponse<String>>
}
