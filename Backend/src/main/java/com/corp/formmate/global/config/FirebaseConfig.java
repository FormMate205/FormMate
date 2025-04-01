package com.corp.formmate.global.config;

import java.io.IOException;
import java.io.InputStream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import jakarta.annotation.PostConstruct;

@Configuration
public class FirebaseConfig {

	@Value("${firebase.config-path}")
	private String firebaseKeyPath;

	@PostConstruct
	public void initializeFirebase() throws IOException {
		if (FirebaseApp.getApps().isEmpty()) {
			InputStream serviceAccount =
				new ClassPathResource(firebaseKeyPath).getInputStream();

			FirebaseOptions options = FirebaseOptions.builder()
				.setCredentials(GoogleCredentials.fromStream(serviceAccount))
				.build();

			FirebaseApp.initializeApp(options);
			System.out.println("✅ Firebase Admin SDK 초기화 완료");
		}
	}
}
