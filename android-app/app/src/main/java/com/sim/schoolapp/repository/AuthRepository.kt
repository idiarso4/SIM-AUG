package com.sim.schoolapp.repository

import com.sim.schoolapp.models.*
import com.sim.schoolapp.network.NetworkClient
import com.sim.schoolapp.utils.NetworkResult
import com.sim.schoolapp.utils.PreferenceManager
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import retrofit2.Response

class AuthRepository(private val preferenceManager: PreferenceManager) {
    
    private val apiService = NetworkClient.apiService
    
    suspend fun login(username: String, password: String): Flow<NetworkResult<AuthResponse>> = flow {
        emit(NetworkResult.Loading())
        try {
            val request = LoginRequest(username, password)
            val response = apiService.login(request)
            if (response.isSuccessful && response.body() != null) {
                val authResponse = response.body()!!
                // Save token and user data
                preferenceManager.saveToken(authResponse.token)
                preferenceManager.saveUser(authResponse.user)
                emit(NetworkResult.Success(authResponse))
            } else {
                emit(NetworkResult.Error("Login failed: ${response.message()}"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error("Network error: ${e.message}"))
        }
    }
    
    suspend fun register(
        username: String,
        email: String,
        password: String,
        role: String,
        firstName: String,
        lastName: String,
        phoneNumber: String? = null,
        address: String? = null
    ): Flow<NetworkResult<AuthResponse>> = flow {
        emit(NetworkResult.Loading())
        try {
            val request = RegisterRequest(
                username, email, password, role, 
                firstName, lastName, phoneNumber, address
            )
            val response = apiService.register(request)
            if (response.isSuccessful && response.body() != null) {
                val authResponse = response.body()!!
                // Save token and user data
                preferenceManager.saveToken(authResponse.token)
                preferenceManager.saveUser(authResponse.user)
                emit(NetworkResult.Success(authResponse))
            } else {
                emit(NetworkResult.Error("Registration failed: ${response.message()}"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error("Network error: ${e.message}"))
        }
    }
    
    suspend fun getCurrentUser(): Flow<NetworkResult<User>> = flow {
        emit(NetworkResult.Loading())
        try {
            val response = apiService.getCurrentUser()
            if (response.isSuccessful && response.body() != null) {
                val user = response.body()!!.user
                preferenceManager.saveUser(user)
                emit(NetworkResult.Success(user))
            } else {
                emit(NetworkResult.Error("Failed to get user: ${response.message()}"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error("Network error: ${e.message}"))
        }
    }
    
    suspend fun updateProfile(
        firstName: String,
        lastName: String,
        phoneNumber: String?,
        address: String?
    ): Flow<NetworkResult<User>> = flow {
        emit(NetworkResult.Loading())
        try {
            val request = UpdateProfileRequest(firstName, lastName, phoneNumber, address)
            val response = apiService.updateProfile(request)
            if (response.isSuccessful && response.body() != null) {
                val updatedUser = response.body()!!.data!!
                preferenceManager.saveUser(updatedUser)
                emit(NetworkResult.Success(updatedUser))
            } else {
                emit(NetworkResult.Error("Profile update failed: ${response.message()}"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error("Network error: ${e.message}"))
        }
    }
    
    suspend fun changePassword(
        currentPassword: String,
        newPassword: String
    ): Flow<NetworkResult<String>> = flow {
        emit(NetworkResult.Loading())
        try {
            val request = ChangePasswordRequest(currentPassword, newPassword)
            val response = apiService.changePassword(request)
            if (response.isSuccessful && response.body() != null) {
                emit(NetworkResult.Success(response.body()!!.message))
            } else {
                emit(NetworkResult.Error("Password change failed: ${response.message()}"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error("Network error: ${e.message}"))
        }
    }
    
    suspend fun logout(): Flow<NetworkResult<String>> = flow {
        emit(NetworkResult.Loading())
        try {
            val response = apiService.logout()
            preferenceManager.logout()
            if (response.isSuccessful) {
                emit(NetworkResult.Success("Logout successful"))
            } else {
                emit(NetworkResult.Success("Logout successful")) // Still clear local data
            }
        } catch (e: Exception) {
            preferenceManager.logout() // Clear local data even if network fails
            emit(NetworkResult.Success("Logout successful"))
        }
    }
    
    fun isLoggedIn(): Boolean = preferenceManager.isLoggedIn()
    
    fun getCurrentUserLocal(): User? = preferenceManager.getUser()
    
    fun getUserRole(): String? = preferenceManager.getUserRole()
}
