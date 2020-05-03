package com.tutorials.entity;

import lombok.*;

import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@XmlRootElement
public class User {
    @Size(min = 6, message = "{name.size.error")
    private String name;

    @Size(min = 5, max = 10, message = "{password.size.error}")
    private String password;

    private boolean admin;

    public User(String name) {
        super();
        this.name = name;
    }
}
