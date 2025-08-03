package com.sim.schoolapp.repository

import com.sim.schoolapp.models.*
import com.sim.schoolapp.network.NetworkClient
import com.sim.schoolapp.utils.NetworkResult
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

class TeacherRepository {
    
    private val apiService = NetworkClient.apiService
    
    suspend fun getAllTeachers(): Flow<NetworkResult<List<Teacher>>> = flow {
        emit(NetworkResult.Loading())
        try {
            val response = apiService.getAllTeachers()
            if (response.isSuccessful && response.body() != null) {
                emit(NetworkResult.Success(response.body()!!.teachers))
            } else {
                emit(NetworkResult.Error("Failed to get teachers: ${response.message()}"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error("Network error: ${e.message}"))
        }
    }
    
    suspend fun getTeacherById(id: String): Flow<NetworkResult<Teacher>> = flow {
        emit(NetworkResult.Loading())
        try {
            val response = apiService.getTeacherById(id)
            if (response.isSuccessful && response.body() != null) {
                emit(NetworkResult.Success(response.body()!!.teacher))
            } else {
                emit(NetworkResult.Error("Failed to get teacher: ${response.message()}"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error("Network error: ${e.message}"))
        }
    }
    
    suspend fun createTeacher(teacher: Teacher): Flow<NetworkResult<Teacher>> = flow {
        emit(NetworkResult.Loading())
        try {
            val response = apiService.createTeacher(teacher)
            if (response.isSuccessful && response.body() != null) {
                emit(NetworkResult.Success(response.body()!!.data!!))
            } else {
                emit(NetworkResult.Error("Failed to create teacher: ${response.message()}"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error("Network error: ${e.message}"))
        }
    }
    
    suspend fun updateTeacher(id: String, teacher: Teacher): Flow<NetworkResult<Teacher>> = flow {
        emit(NetworkResult.Loading())
        try {
            val response = apiService.updateTeacher(id, teacher)
            if (response.isSuccessful && response.body() != null) {
                emit(NetworkResult.Success(response.body()!!.data!!))
            } else {
                emit(NetworkResult.Error("Failed to update teacher: ${response.message()}"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error("Network error: ${e.message}"))
        }
    }
    
    suspend fun deleteTeacher(id: String): Flow<NetworkResult<String>> = flow {
        emit(NetworkResult.Loading())
        try {
            val response = apiService.deleteTeacher(id)
            if (response.isSuccessful && response.body() != null) {
                emit(NetworkResult.Success(response.body()!!.message))
            } else {
                emit(NetworkResult.Error("Failed to delete teacher: ${response.message()}"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error("Network error: ${e.message}"))
        }
    }
}
