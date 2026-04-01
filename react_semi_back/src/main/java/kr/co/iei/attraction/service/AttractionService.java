package kr.co.iei.attraction.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.iei.attraction.model.dao.AttractionDao;

@Service
public class AttractionService {
	@Autowired
	private AttractionDao dao;
}
