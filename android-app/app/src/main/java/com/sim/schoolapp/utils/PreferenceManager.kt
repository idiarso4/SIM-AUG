package com.sim.schoolapp.utils

import android.content.Context
import android.content.SharedPreferences
import com.google.gson.Gson
import com.sim.schoolapp.models.User

class PreferenceManager(context: Context) {
    
    companion object {
        private const val PREF_NAME = "SchoolAppPrefs"
        private const val KEY_TOKEN = "auth_token"
        private const val KEY_USER = "current_user"
        private const val KEY_IS_LOGGED_IN = "is_logged_in"
        private const val KEY_USER_ROLE = "user_role"
    }
    
    private val sharedPreferences: SharedPreferences = 
        context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
    
    private val gson = Gson()
    
    fun saveToken(token: String) {
        sharedPreferences.edit()
            .putString(KEY_TOKEN, token)
            .apply()
    }
    
    fun getToken(): String? {
        return sharedPreferences.getString(KEY_TOKEN, null)
    }
    
    fun saveUser(user: User) {
        val userJson = gson.toJson(user)
        sharedPreferences.edit()
            .putString(KEY_USER, userJson)
            .putString(KEY_USER_ROLE, user.role)
            .putBoolean(KEY_IS_LOGGED_IN, true)
            .apply()
    }
    
    fun getUser(): User? {
        val userJson = sharedPreferences.getString(KEY_USER, null)
        return if (userJson != null) {
            gson.fromJson(userJson, User::class.java)
        } else {
            null
        }
    }
    
    fun getUserRole(): String? {
        return sharedPreferences.getString(KEY_USER_ROLE, null)
    }
    
    fun isLoggedIn(): Boolean {
        return sharedPreferences.getBoolean(KEY_IS_LOGGED_IN, false) && 
               getToken() != null
    }
    
    fun clearAll() {
        sharedPreferences.edit()
            .clear()
            .apply()
    }
    
    fun logout() {
        sharedPreferences.edit()
            .remove(KEY_TOKEN)
            .remove(KEY_USER)
            .remove(KEY_IS_LOGGED_IN)
            .remove(KEY_USER_ROLE)
            .apply()
    }
}
