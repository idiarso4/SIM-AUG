package com.sim.schoolapp.models

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Student(
    val _id: String,
    val user: User,
    val studentId: String,
    val classId: String? = null,
    val enrollmentDate: String,
    val parentName: String? = null,
    val parentPhone: String? = null,
    val parentEmail: String? = null,
    val dateOfBirth: String? = null,
    val bloodType: String? = null,
    val emergencyContact: String? = null,
    val medicalInfo: String? = null,
    val isActive: Boolean = true,
    val createdAt: String? = null,
    val updatedAt: String? = null
) : Parcelable
