package ma.ppam.userservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(List<String> to, String subject, String content) throws Exception {
        SimpleMailMessage message = new SimpleMailMessage();
        
        message.setFrom("binet.maroc@gmail.com");
        message.setTo(to.toArray(new String[0]));
        message.setSubject(subject);
        message.setText(content);
        
        mailSender.send(message);
    }
}
