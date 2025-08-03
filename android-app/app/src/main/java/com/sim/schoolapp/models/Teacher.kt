package com.sim.schoolapp.models

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Teacher(
    val _id: String,
    val user: User,
    val employeeId: String,
    val subjects: List<String> = emptyList(),
    val classes: List<String> = emptyList(),
    val qualification: String? = null,
    val experience: Int = 0,
    val joinDate: String? = null,
    val specialization: String? = null,
    val isActive: Boolean = true,
    val createdAt: String? = null,
    val updatedAt: String? = null
) : Parcelable
