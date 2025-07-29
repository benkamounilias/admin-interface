import { APP_CONFIG } from '@/config/environment';

export interface EmailData {
  to: string[];
  subject: string;
  content: string;
  from?: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
  failedRecipients?: string[];
}

class EmailService {
  private baseURL: string;

  constructor() {
    this.baseURL = APP_CONFIG.API_BASE_URL || 'http://localhost:8080';
  }

  /**
   * Test de connexion email
   */
  async testEmailConnection(): Promise<EmailResponse> {
    try {
      const token = localStorage.getItem(APP_CONFIG.AUTH_TOKEN_KEY);
      
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch(`${this.baseURL}/api/email/test`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const message = await response.text();
      return {
        success: true,
        message: message
      };
    } catch (error: any) {
      console.error('Erreur lors du test email:', error);
      return {
        success: false,
        message: error.message || 'Erreur lors du test email'
      };
    }
  }

  /**
   * Envoie un email simple
   */
  async sendSimpleEmail(to: string, subject: string, message: string): Promise<EmailResponse> {
    try {
      const token = localStorage.getItem(APP_CONFIG.AUTH_TOKEN_KEY);
      
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch(`${this.baseURL}/api/email/send-simple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          to,
          subject,
          message
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
      }

      const responseMessage = await response.text();
      return {
        success: true,
        message: responseMessage
      };
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      return {
        success: false,
        message: error.message || 'Erreur lors de l\'envoi de l\'email'
      };
    }
  }
  async sendEmail(emailData: EmailData): Promise<EmailResponse> {
    try {
      const token = localStorage.getItem(APP_CONFIG.AUTH_TOKEN_KEY);
      
      if (!token) {
        console.error('❌ Token d\'authentification manquant');
        throw new Error('Token d\'authentification manquant');
      }

      console.log('📧 Tentative d\'envoi email vers:', emailData.to[0]);
      console.log('📧 Sujet:', emailData.subject);
      console.log('📧 URL:', `${this.baseURL}/api/email/send-simple`);

      // Utiliser l'endpoint backend existant
      const response = await fetch(`${this.baseURL}/api/email/send-simple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          to: emailData.to[0], // Backend attend un seul destinataire
          subject: emailData.subject,
          message: emailData.content
        })
      });

      console.log('📧 Statut de réponse:', response.status);

      if (!response.ok) {
        // Si l'endpoint n'existe pas encore
        if (response.status === 404) {
          console.error('❌ Endpoint email non configuré sur le backend');
          return {
            success: false,
            message: 'Service email non configuré sur le backend. Consultez EMAIL_BACKEND_SETUP.md pour l\'implémentation.'
          };
        }
        
        let errorText = '';
        try {
          errorText = await response.text();
          console.error('❌ Erreur réponse backend:', errorText);
        } catch (e) {
          console.error('❌ Impossible de lire la réponse d\'erreur');
        }
        
        throw new Error(`Erreur HTTP ${response.status}: ${errorText || response.statusText}`);
      }

      let result;
      try {
        const responseText = await response.text();
        console.log('✅ Réponse backend:', responseText);
        
        // Essayer de parser comme JSON, sinon utiliser comme message texte
        try {
          result = JSON.parse(responseText);
        } catch (e) {
          result = { message: responseText };
        }
      } catch (e) {
        console.error('❌ Erreur lecture réponse:', e);
        result = { message: 'Email envoyé avec succès' };
      }

      return {
        success: true,
        message: result.message || 'Email envoyé avec succès',
        failedRecipients: result.failedRecipients || []
      };

    } catch (error: any) {
      console.error('❌ Erreur lors de l\'envoi d\'email:', error);
      
      // Messages d'erreur plus informatifs
      let errorMessage = error.message;
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Impossible de contacter le serveur backend. Vérifiez que le serveur est démarré.';
      } else if (error.message.includes('400')) {
        errorMessage = 'Données email invalides. Vérifiez les destinataires et le contenu.';
      } else if (error.message.includes('401')) {
        errorMessage = 'Non autorisé. Reconnectez-vous à l\'application.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Erreur serveur lors de l\'envoi. Vérifiez la configuration SMTP.';
      }
      
      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Envoie des emails en lot (un par un pour être compatible avec le backend)
   */
  async sendBulkEmails(emailData: EmailData): Promise<EmailResponse> {
    const { to, subject, content } = emailData;
    const failedRecipients: string[] = [];
    const failureReasons: string[] = [];
    let successCount = 0;

    console.log('📧 Début envoi en lot vers', to.length, 'destinataires');

    try {
      // Envoyer un email à chaque destinataire individuellement
      for (const recipient of to) {
        console.log(`📧 Envoi vers: ${recipient}`);
        try {
          const result = await this.sendEmail({
            to: [recipient],
            subject,
            content
          });

          if (result.success) {
            successCount++;
            console.log(`✅ Succès pour: ${recipient}`);
          } else {
            failedRecipients.push(recipient);
            failureReasons.push(`${recipient}: ${result.message}`);
            console.log(`❌ Échec pour: ${recipient} - ${result.message}`);
          }
        } catch (error: any) {
          console.error(`❌ Erreur pour ${recipient}:`, error);
          failedRecipients.push(recipient);
          failureReasons.push(`${recipient}: ${error.message}`);
        }

        // Petite pause entre les envois pour éviter de surcharger le serveur
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const totalRecipients = to.length;
      const failedCount = failedRecipients.length;

      // Journalisation détaillée des échecs
      if (failedCount > 0) {
        console.error('❌ Échecs d\'envoi détaillés:', failureReasons);
      }

      const resultMessage = failedCount === 0 
        ? `Tous les emails ont été envoyés avec succès (${successCount}/${totalRecipients})`
        : `${successCount}/${totalRecipients} emails envoyés. ${failedCount} échecs.`;

      console.log('📊 Résultat final:', resultMessage);

      return {
        success: failedCount < totalRecipients,
        message: resultMessage,
        failedRecipients
      };

    } catch (error: any) {
      console.error('❌ Erreur globale lors de l\'envoi des emails en lot:', error);
      return {
        success: false,
        message: error.message || 'Erreur lors de l\'envoi des emails en lot'
      };
    }
  }

  /**
   * Teste la configuration email
   */
  async testEmailConfiguration(): Promise<EmailResponse> {
    try {
      const token = localStorage.getItem(APP_CONFIG.AUTH_TOKEN_KEY);
      
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      // Utiliser l'endpoint backend existant
      const response = await fetch(`${this.baseURL}/api/email/test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        // Si l'endpoint n'existe pas encore, on informe l'utilisateur
        if (response.status === 404) {
          return {
            success: false,
            message: 'Endpoint email non configuré sur le backend. Consultez EMAIL_BACKEND_SETUP.md pour l\'implémentation.'
          };
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur HTTP: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        message: result.message || 'Configuration email testée avec succès'
      };

    } catch (error: any) {
      console.error('Erreur test configuration email:', error);
      
      // Messages d'erreur plus informatifs
      let errorMessage = error.message;
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Impossible de contacter le serveur backend. Vérifiez que le serveur est démarré.';
      } else if (error.message.includes('400')) {
        errorMessage = 'Requête invalide. Vérifiez la configuration de l\'endpoint /api/emails/test dans le backend.';
      } else if (error.message.includes('401')) {
        errorMessage = 'Non autorisé. Vérifiez votre authentification.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Erreur serveur. Vérifiez la configuration SMTP dans le backend.';
      }
      
      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Mode simulation pour le développement (quand le backend n'est pas configuré)
   */
  async simulateEmailSend(emailData: EmailData): Promise<EmailResponse> {
    console.log('🔧 MODE SIMULATION - Email qui serait envoyé:', {
      from: 'binet.maroc@gmail.com',
      to: emailData.to,
      subject: emailData.subject,
      content: emailData.content.substring(0, 100) + '...'
    });

    // Simuler un délai d'envoi
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      success: true,
      message: `📧 SIMULATION: ${emailData.to.length} email(s) simulé(s) avec succès. Configurez le backend pour un envoi réel.`
    };
  }

  /**
   * Envoie des emails avec fallback en mode simulation
   */
  async sendEmailWithFallback(emailData: EmailData): Promise<EmailResponse> {
    try {
      // Essayer d'abord l'envoi réel
      const result = await this.sendEmail(emailData);
      
      // Si échec à cause d'un endpoint manquant, utiliser la simulation
      if (!result.success && result.message.includes('non configuré')) {
        return await this.simulateEmailSend(emailData);
      }
      
      return result;
    } catch (error) {
      // En cas d'erreur réseau, utiliser la simulation
      console.warn('Fallback vers simulation email:', error);
      return await this.simulateEmailSend(emailData);
    }
  }

  /**
   * Divise un tableau en chunks de taille spécifiée
   */
  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * Fonction de test rapide pour le debugging
   */
  async testQuickEmail(to: string = 'test@example.com'): Promise<EmailResponse> {
    console.log('🧪 Test rapide d\'envoi email vers:', to);
    
    return await this.sendEmail({
      to: [to],
      subject: 'Test Email - ' + new Date().toISOString(),
      content: 'Ceci est un email de test envoyé depuis l\'interface d\'administration.'
    });
  }
}

// Instance singleton du service email
export const emailService = new EmailService();

// Fonctions de debug globales pour la console
(window as any).testEmail = async (to: string = 'test@example.com') => {
  console.log('🧪 Test email depuis console...');
  const result = await emailService.testQuickEmail(to);
  console.log('📧 Résultat:', result);
  return result;
};

(window as any).testEmailConnection = async () => {
  console.log('🔗 Test connexion email...');
  const result = await emailService.testEmailConnection();
  console.log('📧 Connexion:', result);
  return result;
};

(window as any).checkAuth = () => {
  const token = localStorage.getItem(APP_CONFIG.AUTH_TOKEN_KEY);
  const user = localStorage.getItem(APP_CONFIG.AUTH_USER_KEY);
  console.log('🔐 Token présent:', !!token);
  console.log('👤 Utilisateur:', user);
  if (token) {
    console.log('🎫 Token (10 premiers caractères):', token.substring(0, 10) + '...');
  }
  return { hasToken: !!token, user };
};

console.log('📧 Fonctions de debug email disponibles:');
console.log('- testEmail("votre@email.com") : tester l\'envoi d\'un email');
console.log('- testEmailConnection() : tester la connexion au service email');
console.log('- checkAuth() : vérifier l\'authentification');
