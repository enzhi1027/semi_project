package kr.co.iei.attraction.controller;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.attraction.model.vo.Area;
import kr.co.iei.attraction.model.vo.GreenTourResponse;
import kr.co.iei.attraction.model.vo.Sigungu;
import kr.co.iei.attraction.service.AttractionService;
import tools.jackson.databind.JavaType;
import tools.jackson.databind.ObjectMapper;

@CrossOrigin(value = "*")
@RestController
@RequestMapping(value = "/attractions")
public class AttractionController {

	@Autowired
	private AttractionService service;

	@GetMapping(value = "test")
	public void test() {
		String serviceKey = "mk3QzvdjY94ri5cguFYhSxkkDKHzw2HkMmqwxcPWSPsAXEFunDA%2BQSGC9MZO12wzdxjRkzilt14xj8Rh7Jsk%2BQ%3D%3D";
		testArea(serviceKey);
	}

	public void testArea(String serviceKey) {
		try {
			StringBuilder urlBuilder = new StringBuilder("https://apis.data.go.kr/B551011/GreenTourService1/areaCode1");
			urlBuilder.append("?serviceKey=").append(serviceKey);
			urlBuilder.append("&").append(URLEncoder.encode("numOfRows", "UTF-8")).append("=")
					.append(URLEncoder.encode("20", "UTF-8"));
			urlBuilder.append("&").append(URLEncoder.encode("pageNo", "UTF-8")).append("=")
					.append(URLEncoder.encode("1", "UTF-8"));
			urlBuilder.append("&").append(URLEncoder.encode("MobileOS", "UTF-8")).append("=")
					.append(URLEncoder.encode("ETC", "UTF-8"));
			urlBuilder.append("&").append(URLEncoder.encode("MobileApp", "UTF-8")).append("=")
					.append(URLEncoder.encode("AppTest", "UTF-8"));

			urlBuilder.append("&").append(URLEncoder.encode("_type", "UTF-8")).append("=")
					.append(URLEncoder.encode("json", "UTF-8"));

			URL url = new URL(urlBuilder.toString());
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("GET");
			conn.setRequestProperty("Accept", "application/json");

			BufferedReader rd;
			if (conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
				rd = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
			} else {
				rd = new BufferedReader(new InputStreamReader(conn.getErrorStream(), "UTF-8"));
			}

			StringBuilder sb = new StringBuilder();
			String line;
			while ((line = rd.readLine()) != null) {
				sb.append(line);
			}
			rd.close();
			conn.disconnect();

			String jsonString = sb.toString();
			ObjectMapper objectMapper = new ObjectMapper();

			JavaType targetType = objectMapper.getTypeFactory().constructParametricType(GreenTourResponse.class,
					Area.class);
			GreenTourResponse<Area> root = objectMapper.readValue(jsonString, targetType);

			if (root.getResponse().getBody().getItems() != null) {
				List<Area> list = root.getResponse().getBody().getItems().getItem();
				for (Area a : list) {
					System.out.println("코드: " + a.getAreaCode() + ", 명칭: " + a.getAreaName());
					testSigungu(serviceKey, a.getAreaCode());
					System.out.println("\n------------------------------------------\n");
				}
				// service.saveAreaList(list);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void testSigungu(String serviceKey, String areaCode) {
		try {
			StringBuilder urlBuilder = new StringBuilder("https://apis.data.go.kr/B551011/GreenTourService1/areaCode1");
			urlBuilder.append("?serviceKey=").append(serviceKey);
			urlBuilder.append("&").append(URLEncoder.encode("numOfRows", "UTF-8")).append("=")
					.append(URLEncoder.encode("50", "UTF-8"));
			urlBuilder.append("&").append(URLEncoder.encode("pageNo", "UTF-8")).append("=")
					.append(URLEncoder.encode("1", "UTF-8"));
			urlBuilder.append("&").append(URLEncoder.encode("MobileOS", "UTF-8")).append("=")
					.append(URLEncoder.encode("ETC", "UTF-8"));
			urlBuilder.append("&").append(URLEncoder.encode("MobileApp", "UTF-8")).append("=")
					.append(URLEncoder.encode("AppTest", "UTF-8"));
			urlBuilder.append("&").append(URLEncoder.encode("areaCode", "UTF-8")).append("=")
					.append(URLEncoder.encode(areaCode, "UTF-8"));
			urlBuilder.append("&").append(URLEncoder.encode("_type", "UTF-8")).append("=")
					.append(URLEncoder.encode("json", "UTF-8"));

			URL url = new URL(urlBuilder.toString());
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("GET");
			conn.setRequestProperty("Accept", "application/json");

			BufferedReader rd;
			if (conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
				rd = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
			} else {
				rd = new BufferedReader(new InputStreamReader(conn.getErrorStream(), "UTF-8"));
			}

			StringBuilder sb = new StringBuilder();
			String line;
			while ((line = rd.readLine()) != null) {
				sb.append(line);
			}
			rd.close();
			conn.disconnect();

			String jsonString = sb.toString();
			ObjectMapper objectMapper = new ObjectMapper();

			JavaType targetType = objectMapper.getTypeFactory().constructParametricType(GreenTourResponse.class,
					Sigungu.class);
			GreenTourResponse<Sigungu> root = objectMapper.readValue(jsonString, targetType);

			if (root.getResponse().getBody().getItems() != null) {
				List<Sigungu> list = root.getResponse().getBody().getItems().getItem();
				for (Sigungu a : list) {
					System.out.println("코드: " + a.getSigunguCode() + ", 명칭: " + a.getSigunguName());
				}
				// service.saveAreaList(list);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void testAttractions(String serviceKey, String areaCode, String sigunguCode) {
		try {
			StringBuilder urlBuilder = new StringBuilder(
					"https://apis.data.go.kr/B551011/GreenTourService1/areaBasedList1");
			urlBuilder.append("?serviceKey=").append(serviceKey);
			urlBuilder.append("&").append(URLEncoder.encode("numOfRows", "UTF-8")).append("=")
					.append(URLEncoder.encode("50", "UTF-8"));
			urlBuilder.append("&").append(URLEncoder.encode("pageNo", "UTF-8")).append("=")
					.append(URLEncoder.encode("1", "UTF-8"));
			urlBuilder.append("&").append(URLEncoder.encode("MobileOS", "UTF-8")).append("=")
					.append(URLEncoder.encode("ETC", "UTF-8"));
			urlBuilder.append("&").append(URLEncoder.encode("MobileApp", "UTF-8")).append("=")
					.append(URLEncoder.encode("AppTest", "UTF-8"));
			urlBuilder.append("&").append(URLEncoder.encode("areaCode", "UTF-8")).append("=")
					.append(URLEncoder.encode(areaCode, "UTF-8"));
			urlBuilder.append("&").append(URLEncoder.encode("_type", "UTF-8")).append("=")
					.append(URLEncoder.encode("json", "UTF-8"));
			urlBuilder.append("&").append(URLEncoder.encode("arrange", "UTF-8")).append("=")
					.append(URLEncoder.encode("C", "UTF-8"));

			URL url = new URL(urlBuilder.toString());
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("GET");
			conn.setRequestProperty("Accept", "application/json");

			BufferedReader rd;
			if (conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
				rd = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
			} else {
				rd = new BufferedReader(new InputStreamReader(conn.getErrorStream(), "UTF-8"));
			}

			StringBuilder sb = new StringBuilder();
			String line;
			while ((line = rd.readLine()) != null) {
				sb.append(line);
			}
			rd.close();
			conn.disconnect();

			String jsonString = sb.toString();
			ObjectMapper objectMapper = new ObjectMapper();

			JavaType targetType = objectMapper.getTypeFactory().constructParametricType(GreenTourResponse.class,
					Sigungu.class);
			GreenTourResponse<Sigungu> root = objectMapper.readValue(jsonString, targetType);

			if (root.getResponse().getBody().getItems() != null) {
				List<Sigungu> list = root.getResponse().getBody().getItems().getItem();
				for (Sigungu a : list) {
					System.out.println("코드: " + a.getSigunguCode() + ", 명칭: " + a.getSigunguName());
				}
				// service.saveAreaList(list);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}