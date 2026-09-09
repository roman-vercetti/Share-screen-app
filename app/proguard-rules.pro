# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Keep Netty classes
-keep class io.netty.** { *; }
-dontwarn io.netty.**
-dontwarn sun.misc.Unsafe
-dontwarn com.sun.**
-dontwarn org.bouncycastle.**

# Keep JMDNS classes
-keep class javax.jmdns.** { *; }
-dontwarn javax.jmdns.**

# Keep BouncyCastle
-keep class org.bouncycastle.** { *; }
-dontwarn org.bouncycastle.**

# Keep Kotlin metadata
-keep class kotlin.Metadata { *; }

# Keep model classes
-keep class com.example.screenmirror.network.RTPPacket { *; }
-keep class com.example.screenmirror.airplay.MirrorConfig { *; }
