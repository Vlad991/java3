package com.infopulse.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;


@Setter
@Getter
@NoArgsConstructor
@Entity
@Table(name="clients")
public class Client {
    @Id
    @GenericGenerator(name="increment", strategy = "increment")
    @GeneratedValue(generator="increment")
    @Basic
    private Long id;

    @Column(name = "cname", unique = false, nullable = false, length = 255)
    @Basic
    private String name;

    @Column(name = "surename", nullable = false)
    private String surename;
}
