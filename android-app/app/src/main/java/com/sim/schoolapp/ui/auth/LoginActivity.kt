package com.sim.schoolapp.ui.auth

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.sim.schoolapp.R
import com.sim.schoolapp.databinding.ActivityLoginBinding
import com.sim.schoolapp.ui.main.MainActivity
import com.sim.schoolapp.utils.PreferenceManager
import com.sim.schoolapp.utils.showToast
import com.sim.schoolapp.viewmodel.AuthViewModel
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding
    private val viewModel: AuthViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupObservers()
        setupListeners()
    }

    private fun setupObservers() {
        viewModel.loginState.observe(this) { result ->
            binding.progressBar.visibility = View.GONE
            when (result) {
                is NetworkResult.Loading -> {
                    binding.progressBar.visibility = View.VISIBLE
                }
                is NetworkResult.Success -> {
                    showToast(getString(R.string.login_success))
                    startActivity(Intent(this, MainActivity::class.java))
                    finish()
                }
                is NetworkResult.Error -> {
                    showToast(result.message)
                }
            }
        }
    }

    private fun setupListeners() {
        binding.btnLogin.setOnClickListener {
            val username = binding.etUsername.text.toString().trim()
            val password = binding.etPassword.text.toString().trim()
            if (username.isNotEmpty() && password.isNotEmpty()) {
                viewModel.login(username, password)
            } else {
                showToast(getString(R.string.field_required))
            }
        }

        binding.tvRegisterPrompt.setOnClickListener {
            // Navigate to Register Activity
        }
    }
}
