package kr.co.iei.touritem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.touritem.model.service.TourItemService;

@CrossOrigin(value = "*")
@RestController
@RequestMapping(value = "tourItems")
public class TourItemController {
	@Autowired
	private TourItemService tourItemService;
	
}
