package com.sim.schoolapp.repository

import com.sim.schoolapp.models.*
import com.sim.schoolapp.network.NetworkClient
import com.sim.schoolapp.utils.NetworkResult
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

class StudentRepository {
    
    private val apiService = NetworkClient.apiService
    
    suspend fun getAllStudents(): Flow<NetworkResult<List<Student>>> = flow {
        emit(NetworkResult.Loading())
        try {
            val response = apiService.getAllStudents()
            if (response.isSuccessful && response.body() != null) {
                emit(NetworkResult.Success(response.body()!!.students))
            } else {
                emit(NetworkResult.Error("Failed to get students: ${response.message()}"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error("Network error: ${e.message}"))
        }
    }
    
    suspend fun getStudentById(id: String): Flow<NetworkResult<Student>> = flow {
        emit(NetworkResult.Loading())
        try {
            val response = apiService.getStudentById(id)
            if (response.isSuccessful && response.body() != null) {
                emit(NetworkResult.Success(response.body()!!.student))
            } else {
                emit(NetworkResult.Error("Failed to get student: ${response.message()}"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error("Network error: ${e.message}"))
        }
    }
    
    suspend fun createStudent(student: Student): Flow<NetworkResult<Student>> = flow {
        emit(NetworkResult.Loading())
        try {
            val response = apiService.createStudent(student)
            if (response.isSuccessful && response.body() != null) {
                emit(NetworkResult.Success(response.body()!!.data!!))
            } else {
                emit(NetworkResult.Error("Failed to create student: ${response.message()}"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error("Network error: ${e.message}"))
        }
    }
    
    suspend fun updateStudent(id: String, student: Student): Flow<NetworkResult<Student>> = flow {
        emit(NetworkResult.Loading())
        try {
            val response = apiService.updateStudent(id, student)
            if (response.isSuccessful && response.body() != null) {
                emit(NetworkResult.Success(response.body()!!.data!!))
            } else {
                emit(NetworkResult.Error("Failed to update student: ${response.message()}"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error("Network error: ${e.message}"))
        }
    }
    
    suspend fun deleteStudent(id: String): Flow<NetworkResult<String>> = flow {
        emit(NetworkResult.Loading())
        try {
            val response = apiService.deleteStudent(id)
            if (response.isSuccessful && response.body() != null) {
                emit(NetworkResult.Success(response.body()!!.message))
            } else {
                emit(NetworkResult.Error("Failed to delete student: ${response.message()}"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error("Network error: ${e.message}"))
        }
    }
}
