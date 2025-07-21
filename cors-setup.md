# Configuration CORS pour le Backend Spring Boot

## Problème
Le frontend (localhost:3002) ne peut pas accéder au backend (localhost:8080) à cause des politiques CORS.

## Solutions

### 1. Solution rapide - Ajouter au backend (CorsConfig.java)
Créer le fichier : `C:\Users\hp\IdeaProjects\demo\src\main\java\ma\ppam\userservice\config\CorsConfig.java`

```java
package ma.ppam.userservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.setAllowedOriginPatterns(Arrays.asList("*"));
        corsConfiguration.setAllowedHeaders(Arrays.asList("Origin", "Access-Control-Allow-Origin", "Content-Type",
                "Accept", "Authorization", "Origin, Accept", "X-Requested-With",
                "Access-Control-Request-Method", "Access-Control-Request-Headers"));
        corsConfiguration.setExposedHeaders(Arrays.asList("Origin", "Content-Type", "Accept", "Authorization",
                "Access-Control-Allow-Origin", "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"));
        corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);
        return new CorsFilter(urlBasedCorsConfigurationSource);
    }
}
```

### 2. Solution rapide - Modification application.properties
Ajouter dans `application.properties` :
```properties
# CORS Configuration
spring.web.cors.allowed-origins=http://localhost:3000,http://localhost:3001,http://localhost:3002
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
```

### 3. Redémarrer le backend après modification
```bash
cd C:\Users\hp\IdeaProjects\demo
mvn spring-boot:run
```

## État actuel
- ✅ Backend Spring Boot fonctionne sur localhost:8080
- ✅ Frontend Vite fonctionne sur localhost:3002
- ❌ Problème CORS bloque les requêtes
- ✅ Configuration proxy améliorée dans vite.config.ts

## Test après configuration
Une fois CORS configuré, tester :
1. Login page : http://localhost:3002
2. Messages page : http://localhost:3002/messages
3. Bouton "Test Email" pour vérifier l'API email
