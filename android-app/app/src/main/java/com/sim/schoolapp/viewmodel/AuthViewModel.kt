package com.sim.schoolapp.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.sim.schoolapp.models.AuthResponse
import com.sim.schoolapp.models.User
import com.sim.schoolapp.repository.AuthRepository
import com.sim.schoolapp.utils.NetworkResult
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

class AuthViewModel(private val repository: AuthRepository) : ViewModel() {
    
    private val _loginState = MutableStateFlow<NetworkResult<AuthResponse>?>(null)
    val loginState: StateFlow<NetworkResult<AuthResponse>?> = _loginState.asStateFlow()
    
    private val _registerState = MutableStateFlow<NetworkResult<AuthResponse>?>(null)
    val registerState: StateFlow<NetworkResult<AuthResponse>?> = _registerState.asStateFlow()
    
    private val _userState = MutableStateFlow<NetworkResult<User>?>(null)
    val userState: StateFlow<NetworkResult<User>?> = _userState.asStateFlow()
    
    private val _profileUpdateState = MutableStateFlow<NetworkResult<User>?>(null)
    val profileUpdateState: StateFlow<NetworkResult<User>?> = _profileUpdateState.asStateFlow()
    
    private val _passwordChangeState = MutableStateFlow<NetworkResult<String>?>(null)
    val passwordChangeState: StateFlow<NetworkResult<String>?> = _passwordChangeState.asStateFlow()
    
    private val _logoutState = MutableStateFlow<NetworkResult<String>?>(null)
    val logoutState: StateFlow<NetworkResult<String>?> = _logoutState.asStateFlow()
    
    fun login(username: String, password: String) {
        viewModelScope.launch {
            repository.login(username, password).collect {
                _loginState.value = it
            }
        }
    }
    
    fun register(
        username: String,
        email: String,
        password: String,
        role: String,
        firstName: String,
        lastName: String,
        phoneNumber: String? = null,
        address: String? = null
    ) {
        viewModelScope.launch {
            repository.register(
                username, email, password, role,
                firstName, lastName, phoneNumber, address
            ).collect {
                _registerState.value = it
            }
        }
    }
    
    fun getCurrentUser() {
        viewModelScope.launch {
            repository.getCurrentUser().collect {
                _userState.value = it
            }
        }
    }
    
    fun updateProfile(
        firstName: String,
        lastName: String,
        phoneNumber: String?,
        address: String?
    ) {
        viewModelScope.launch {
            repository.updateProfile(firstName, lastName, phoneNumber, address).collect {
                _profileUpdateState.value = it
            }
        }
    }
    
    fun changePassword(currentPassword: String, newPassword: String) {
        viewModelScope.launch {
            repository.changePassword(currentPassword, newPassword).collect {
                _passwordChangeState.value = it
            }
        }
    }
    
    fun logout() {
        viewModelScope.launch {
            repository.logout().collect {
                _logoutState.value = it
            }
        }
    }
    
    fun isLoggedIn(): Boolean = repository.isLoggedIn()
    
    fun getCurrentUserLocal(): User? = repository.getCurrentUserLocal()
    
    fun getUserRole(): String? = repository.getUserRole()
    
    fun clearLoginState() {
        _loginState.value = null
    }
    
    fun clearRegisterState() {
        _registerState.value = null
    }
    
    fun clearUserState() {
        _userState.value = null
    }
    
    fun clearProfileUpdateState() {
        _profileUpdateState.value = null
    }
    
    fun clearPasswordChangeState() {
        _passwordChangeState.value = null
    }
    
    fun clearLogoutState() {
        _logoutState.value = null
    }
}
