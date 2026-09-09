package com.example.screenmirror.airplay

import android.util.Base64
import android.util.Log
import org.bouncycastle.jce.provider.BouncyCastleProvider
import java.security.KeyPair
import java.security.KeyPairGenerator
import java.security.Security

object PairingManager {
    private const val TAG = "PairingManager"

    init {
        Security.addProvider(BouncyCastleProvider())
    }

    fun generateRSAKeyPair(): KeyPair {
        val keyPairGenerator = KeyPairGenerator.getInstance("RSA", "BC")
        keyPairGenerator.initialize(2048)
        return keyPairGenerator.generateKeyPair()
    }

    fun getPublicKeyBase64(keyPair: KeyPair): String {
        return Base64.encodeToString(keyPair.public.encoded, Base64.NO_WRAP)
    }

    fun verifySignature(
        publicKeyBytes: ByteArray,
        data: ByteArray,
        signature: ByteArray
    ): Boolean {
        return try {
            val signatureVerifier = java.security.Signature.getInstance("SHA256withRSA", "BC")
            val publicKey = java.security.KeyFactory.getInstance("RSA", "BC")
                .generatePublic(java.security.spec.X509EncodedKeySpec(publicKeyBytes))
            signatureVerifier.initVerify(publicKey)
            signatureVerifier.update(data)
            signatureVerifier.verify(signature)
        } catch (e: Exception) {
            Log.e(TAG, "Ошибка проверки подписи", e)
            false
        }
    }
}
