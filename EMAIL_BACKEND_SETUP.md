# Configuration Email Backend - BINET

## Vue d'ensemble

Ce document décrit l'implémentation nécessaire côté backend pour l'envoi d'emails via binet.maroc@gmail.com.

## Endpoints API Requis

### 1. POST /api/emails/send
Envoie un email ou un lot d'emails

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Body:**
```json
{
  "to": ["destinataire1@email.com", "destinataire2@email.com"],
  "subject": "Objet du message",
  "content": "Contenu du message avec signature",
  "from": "binet.maroc@gmail.com"
}
```

**Réponse Success (200):**
```json
{
  "message": "Email envoyé avec succès",
  "failedRecipients": []
}
```

**Réponse Error (400/500):**
```json
{
  "message": "Message d'erreur détaillé"
}
```

### 2. POST /api/emails/test
Teste la configuration email

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Réponse Success (200):**
```json
{
  "message": "Configuration email testée avec succès"
}
```

## Configuration Gmail SMTP

Pour envoyer des emails via binet.maroc@gmail.com, utilisez les paramètres SMTP suivants :

```
Host: smtp.gmail.com
Port: 587 (TLS) ou 465 (SSL)
Username: binet.maroc@gmail.com
Password: [Mot de passe d'application Gmail]
```

### Configuration des mots de passe d'application Gmail

1. Connectez-vous au compte binet.maroc@gmail.com
2. Allez dans "Gérer votre compte Google"
3. Section "Sécurité" → "Validation en deux étapes" (doit être activée)
4. "Mots de passe des applications"
5. Générez un mot de passe pour "Application personnalisée"
6. Utilisez ce mot de passe (16 caractères) dans votre configuration SMTP

## Exemple d'implémentation Spring Boot

### 1. Dépendances Maven

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

### 2. Configuration application.yml

```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: binet.maroc@gmail.com
    password: ${GMAIL_APP_PASSWORD} # Mot de passe d'application
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
          ssl:
            trust: smtp.gmail.com
```

### 3. Service Email

```java
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(List<String> to, String subject, String content) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom("binet.maroc@gmail.com");
            helper.setTo(to.toArray(new String[0]));
            helper.setSubject(subject);
            helper.setText(content, false); // false = plain text, true = HTML
            
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'envoi d'email", e);
        }
    }
}
```

### 4. Controller

```java
@RestController
@RequestMapping("/api/emails")
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
                "Test Configuration", 
                "Test de configuration email"
            );
            return ResponseEntity.ok(Map.of("message", "Configuration testée avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Erreur de configuration: " + e.getMessage()));
        }
    }
}
```

## Variables d'environnement

Créez un fichier `.env` ou configurez les variables système :

```
GMAIL_APP_PASSWORD=votre_mot_de_passe_application_16_caracteres
```

## Sécurité

1. **Ne jamais** commiter le mot de passe d'application dans le code
2. Utiliser des variables d'environnement
3. Limiter les permissions du compte Gmail
4. Implémenter une limitation du taux d'envoi (rate limiting)
5. Valider les adresses email avant envoi
6. Logger les tentatives d'envoi pour audit

## Limitation du taux d'envoi

Gmail limite les envois à :
- 500 emails par jour pour les comptes gratuits
- 2000 emails par jour pour Google Workspace

Implémentez une limitation côté serveur pour respecter ces quotas.

## Monitoring et Logs

Ajoutez des logs pour :
- Tentatives d'envoi
- Succès/Échecs
- Adresses email invalides
- Quotas atteints

```java
@Slf4j
@Service
public class EmailService {
    
    public void sendEmail(List<String> to, String subject, String content) {
        log.info("Tentative d'envoi email à {} destinataires", to.size());
        try {
            // ... logique d'envoi
            log.info("Email envoyé avec succès à: {}", to);
        } catch (Exception e) {
            log.error("Échec envoi email à {}: {}", to, e.getMessage());
            throw e;
        }
    }
}
```
