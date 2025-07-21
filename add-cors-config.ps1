# Script PowerShell pour ajouter la configuration CORS au backend

$backendPath = "C:\Users\hp\IdeaProjects\demo\src\main\java\ma\ppam\userservice\config"
$corsConfigFile = "$backendPath\CorsConfig.java"

# Créer le dossier config s'il n'existe pas
if (!(Test-Path $backendPath)) {
    New-Item -ItemType Directory -Path $backendPath -Force
    Write-Host "Dossier config créé : $backendPath" -ForegroundColor Green
}

# Contenu du fichier CorsConfig.java
$corsConfigContent = @"
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
"@

# Créer le fichier CorsConfig.java
Set-Content -Path $corsConfigFile -Value $corsConfigContent -Encoding UTF8
Write-Host "Fichier CorsConfig.java créé : $corsConfigFile" -ForegroundColor Green

Write-Host "`n✅ Configuration CORS ajoutée au backend !" -ForegroundColor Green
Write-Host "📋 Étapes suivantes :" -ForegroundColor Yellow
Write-Host "1. Arrêter le backend Spring Boot (Ctrl+C)" -ForegroundColor White
Write-Host "2. Redémarrer le backend : mvn spring-boot:run" -ForegroundColor White
Write-Host "3. Tester votre application sur http://localhost:3002" -ForegroundColor White
