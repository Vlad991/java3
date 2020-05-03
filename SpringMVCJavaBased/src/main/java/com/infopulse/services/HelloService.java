package com.infopulse.services;

import com.infopulse.entity.User;
import com.infopulse.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HelloService {

    private UserRepository userRepository;

    public HelloService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Transactional
    public void save(String username){
        User user = new User();
        user.setName(username);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public List<String> getUsers(){
        return userRepository.findAll().stream()
                .map(entity -> entity.getName())
                .collect(Collectors.toList());
    }

}