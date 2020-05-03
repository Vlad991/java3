package com.infopulse.main;

import com.infopulse.entity.Client;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.boot.MetadataSources;
import org.hibernate.boot.registry.StandardServiceRegistry;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;

import java.io.File;

public class Main {

    public static void main(String[] args) {
        SessionFactory sessionFactory = null;
        final StandardServiceRegistry registry = new StandardServiceRegistryBuilder()
                .configure(new File("hibernate.cfg.xml")) // configures settings from hibernate.cfg.xml
                .build();
        try {
            sessionFactory = new MetadataSources(registry)
                    .buildMetadata()
                    .buildSessionFactory();


            Session session = sessionFactory.openSession();
            session.beginTransaction();
            Client client1 = new Client();
            client1.setName("Vasya");
            client1.setSurename("Vasilyev");
            session.save(client1);
            Client client2 = new Client();
            client2.setName("Petya");
            client2.setSurename("Petrov");
            session.save(client2);
            session.getTransaction().commit();
            session.close();
            sessionFactory.close();
        } catch (Exception e) {
            e.printStackTrace();
            StandardServiceRegistryBuilder.destroy(registry);
        }
    }
}
