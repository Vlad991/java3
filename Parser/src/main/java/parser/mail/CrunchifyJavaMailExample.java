package parser.mail;

import parser.main.MainProgram;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

public class CrunchifyJavaMailExample {

    static Properties mailServerProperties;
    static Session getMailSession;
    static MimeMessage generateMailMessage;

//    static parser.MainTest t = new parser.MainTest();

    public static void main(String text1) throws AddressException, MessagingException {
        generateAndSendEmail(text1);
        System.out.println("\n\n ===> Your Java Program has just sent an Email successfully. Check your email..");
    }

    public static void generateAndSendEmail(String text2) throws AddressException, MessagingException {

        // Step1
        System.out.println("\n 1st ===> setup Mail Server Properties..");
        mailServerProperties = System.getProperties();
        mailServerProperties.put("mail.smtp.port", "587");
        mailServerProperties.put("mail.smtp.auth", "true");
        mailServerProperties.put("mail.smtp.starttls.enable", "true");
        System.out.println("Mail Server Properties have been setup successfully..");

        // Step2
        System.out.println("\n\n 2nd ===> get Mail Session..");
        getMailSession = Session.getDefaultInstance(mailServerProperties, null);
        generateMailMessage = new MimeMessage(getMailSession);
        String[] s = MainProgram.mailReceiver.split(" ");

        for (int i =0; i<s.length; i++){
            System.out.println("s" + i + ": "+s[i]);
            generateMailMessage.addRecipient(Message.RecipientType.TO, new InternetAddress(s[i]));
        }
//        generateMailMessage.addRecipient(Message.RecipientType.CC, new InternetAddress("test2@crunchify.com"));
        generateMailMessage.setSubject("Результаты по запросу: " + MainProgram.subject);
//        String emailBody = "Test email by Crunchify.com JavaMail API example. " + "<br><br> Regards, <br>Crunchify Admin";
        String emailBody = text2;
//        System.out.println("text2: " + text2);
//        System.out.println("emailBody: " + emailBody);
        generateMailMessage.setContent(emailBody, "text/html; charset=utf-8");
        System.out.println("Mail Session has been created successfully..");

        // Step3
        System.out.println("\n\n 3rd ===> Get Session and Send mail");
        Transport transport = getMailSession.getTransport("smtp");

        // Enter your correct gmail UserID and Password
        // if you have 2FA enabled then provide App Specific Password

//        transport.connect("smtp.gmail.com", "johnlarson405@gmail.com ", "sigmacomfort50");
//        System.out.println("****Перед отправкой: " + parser.main.MainProgram.mailSenderLogin + " " + parser.main.MainProgram.mailSenderPassword);
        transport.connect("smtp.gmail.com", MainProgram.mailSenderLogin, MainProgram.mailSenderPassword);
        transport.sendMessage(generateMailMessage, generateMailMessage.getAllRecipients());
        transport.close();
    }
}
