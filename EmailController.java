package ma.ppam.userservice.controller;

import ma.ppam.userservice.dto.EmailRequest;
import ma.ppam.userservice.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/emails")
@CrossOrigin(origins = "http://localhost:3000")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    public ResponseEntity<?> sendEmail(@RequestBody EmailRequest request) {
        try {
            emailService.sendEmail(request.getTo(), request.getSubject(), request.getContent());
            return ResponseEntity.ok(Map.of("message", "Email envoyé avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Erreur lors de l'envoi: " + e.getMessage()));
        }
    }

    @PostMapping("/test")
    public ResponseEntity<?> testEmailConfig() {
        try {
            emailService.sendEmail(
                List.of("test@example.com"), 
                "Test Configuration BINET", 
                "Test de configuration email depuis l'interface d'administration BINET.\n\nCe message confirme que la configuration email fonctionne correctement."
            );
            return ResponseEntity.ok(Map.of("message", "Configuration email testée avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Erreur de configuration: " + e.getMessage()));
        }
    }
}
