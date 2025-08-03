package com.sim.schoolapp

import android.app.Application
import com.sim.schoolapp.network.NetworkClient
import com.sim.schoolapp.utils.PreferenceManager

class SchoolApplication : Application() {
    
    lateinit var preferenceManager: PreferenceManager
        private set
    
    override fun onCreate() {
        super.onCreate()
        
        // Initialize PreferenceManager
        preferenceManager = PreferenceManager(this)
        
        // Initialize Network Client
        NetworkClient.initialize(preferenceManager)
    }
}
