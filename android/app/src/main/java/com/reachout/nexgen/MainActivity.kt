package com.reachout.nexgen
 
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import android.os.Bundle
import com.zoontek.rnbootsplash.RNBootSplash
import android.content.Intent;
import android.content.res.Configuration;
import android.view.View
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.updatePadding
 
// Extension function to handle window insets for API 35+
fun View.applyViewInsets() {
    ViewCompat.setOnApplyWindowInsetsListener(this) { view, insets ->
        val statusBars = insets.getInsets(WindowInsetsCompat.Type.statusBars())
        val navBars = insets.getInsets(WindowInsetsCompat.Type.navigationBars())
        val ime = insets.getInsets(WindowInsetsCompat.Type.ime())

        view.updatePadding(
            left = statusBars.left + navBars.left,
            top = statusBars.top,
            right = statusBars.right + navBars.right,
            bottom = maxOf(navBars.bottom, ime.bottom)
        )

        insets
    }
}

class MainActivity : ReactActivity() {
 
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "RocketChatRN"
 
  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

	override fun onCreate(savedInstanceState: Bundle?) {
    RNBootSplash.init(this)
    super.onCreate(null)
    
    // Apply window insets handling for API 35+ keyboard behavior
    findViewById<View>(android.R.id.content).applyViewInsets()
  }

  override fun invokeDefaultOnBackPressed() {
    moveTaskToBack(true)
  }
}
