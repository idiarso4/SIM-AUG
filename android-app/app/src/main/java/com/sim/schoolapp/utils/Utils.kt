package com.sim.schoolapp.utils

import android.content.Context
import android.widget.Toast
import androidx.fragment.app.Fragment

// Extension functions
fun Context.showToast(message: String, duration: Int = Toast.LENGTH_SHORT) {
    Toast.makeText(this, message, duration).show()
}

fun Fragment.showToast(message: String, duration: Int = Toast.LENGTH_SHORT) {
    requireContext().showToast(message, duration)
}

// Resource handling
sealed class Resource<T> {
    class Loading<T> : Resource<T>()
    data class Success<T>(val data: T) : Resource<T>()
    data class Error<T>(val message: String, val data: T? = null) : Resource<T>()
}

// Network result wrapper
sealed class NetworkResult<T> {
    data class Success<T>(val data: T) : NetworkResult<T>()
    data class Error<T>(val message: String) : NetworkResult<T>()
    data class Loading<T>(val isLoading: Boolean = true) : NetworkResult<T>()
}

// Constants
object Constants {
    const val ROLE_ADMIN = "admin"
    const val ROLE_TEACHER = "teacher"
    const val ROLE_STUDENT = "student"
    
    const val REQUEST_CODE_CAMERA = 100
    const val REQUEST_CODE_GALLERY = 101
    
    const val EXTRA_USER = "extra_user"
    const val EXTRA_STUDENT = "extra_student"
    const val EXTRA_TEACHER = "extra_teacher"
}
