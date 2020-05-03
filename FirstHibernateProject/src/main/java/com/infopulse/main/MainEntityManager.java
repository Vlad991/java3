package com.infopulse.main;

import com.infopulse.entity.Adress;
import com.infopulse.entity.Client;
import org.hibernate.SessionFactory;

import javax.persistence.EntityManager;
import javax.persistence.Persistence;

public class MainEntityManager {
    public static void main(String[] args){
        SessionFactory sessionFactory = (SessionFactory)
                Persistence.createEntityManagerFactory( "org.hibernate.tutorial.jpa" );
        EntityManager entityManager = sessionFactory.createEntityManager();
        entityManager.getTransaction().begin();
        Client client = new Client();
        client.setName("Kolya");
        client.setSurename("Pupkin");
        entityManager.persist(client);
        entityManager.getTransaction().commit();
        sessionFactory.close();

    }
}
