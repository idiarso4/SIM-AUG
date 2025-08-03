package com.sim.schoolapp.models

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class User(
    val id: String,
    val username: String,
    val email: String,
    val role: String,
    val firstName: String,
    val lastName: String,
    val fullName: String,
    val phoneNumber: String? = null,
    val address: String? = null,
    val lastLogin: String? = null,
    val isActive: Boolean = true,
    val createdAt: String? = null,
    val updatedAt: String? = null
) : Parcelable
