package com.infopulse.controllers;

import com.infopulse.services.HelloService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class HelloController {

    private HelloService helloService;

    public HelloController(HelloService helloService){
        this.helloService = helloService;
    }

    // @RequestMapping(value = "/hello", method = RequestMethod.POST)
    @PostMapping(value = "/hello")
    public ModelAndView getHello(@RequestParam("username") String username){
        helloService.save(username);
        ModelAndView mv = new ModelAndView();
        mv.setViewName("list");
        return mv;
    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ModelAndView index(){
        ModelAndView mv = new ModelAndView();
        mv.setViewName("index");
        return mv;
    }

    @GetMapping(value = "/list")
    public ModelAndView getListUsername(){
        ModelAndView mv = new ModelAndView();
        mv.setViewName("usernames");
        mv.addObject("list", helloService.getUsers());
        return mv;
    }


}