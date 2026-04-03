package kr.co.iei.attraction.controller;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.attraction.model.vo.Area;
import kr.co.iei.attraction.model.vo.Attraction;
import kr.co.iei.attraction.model.vo.AttractionListItem;
import kr.co.iei.attraction.model.vo.AttractionListResponse;
import kr.co.iei.attraction.model.vo.GreenTourAttractionResponse;
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
	
	@GetMapping
	public ResponseEntity<?> selectAttractionList(@ModelAttribute AttractionListItem request) {
		AttractionListResponse response = service.selectAttractionList(request);

		return ResponseEntity.ok(response);
	}
	
	@GetMapping(value = "/areaList")
	public ResponseEntity<?> selectAreaList() {
		List<Area> list = service.selectAreaList();
		return ResponseEntity.ok(list);
	}
	
	@GetMapping(value = "/sigunguList/{areaCode}")
	public ResponseEntity<?> selectSigunguList(@PathVariable String areaCode) {
		List<Sigungu> list = service.selectSigunguList(areaCode);
		return ResponseEntity.ok(list);
	}

	@GetMapping(value = "test")
	public void test() { 
		String serviceKey = "fb331309e5dfe9890ebfccd656fe364f5a15f230f4c2551afe1a083b86151329";
		// testArea(serviceKey);
		/*
		 * for (String areaCode : areaCodeList) { testSigungu(serviceKey, areaCode); }
		 */

		List<String> areaCodeList = service.selectAreaCode();

		for (String areaCode : areaCodeList) {
			List<String> sigunguCodeList = service.selectSigunguCode(areaCode);
			testAttractions(serviceKey, areaCode);
		}
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
				int result = service.insertArea(list);
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
				int result = service.insertSigungu(areaCode, list);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void testAttractions(String serviceKey, String areaCode) {
		HttpURLConnection conn = null;
		try {
			StringBuilder urlBuilder = new StringBuilder(
					"https://apis.data.go.kr/B551011/GreenTourService1/areaBasedSyncList1");
			urlBuilder.append("?serviceKey=").append(serviceKey);
			urlBuilder.append("&").append(URLEncoder.encode("numOfRows", "UTF-8")).append("=")
					.append(URLEncoder.encode("50", "UTF-8"));
			urlBuilder.append("&").append(URLEncoder.encode("pageNo", "UTF-8")).append("=")
					.append(URLEncoder.encode("1", "UTF-8"));
			urlBuilder.append("&").append(URLEncoder.encode("MobileOS", "UTF-8")).append("=")
					.append(URLEncoder.encode("ETC", "UTF-8"));
			urlBuilder.append("&").append(URLEncoder.encode("MobileApp", "UTF-8")).append("=")
					.append(URLEncoder.encode("AppTest", "UTF-8"));
			urlBuilder.append("&").append(URLEncoder.encode("_type", "UTF-8")).append("=")
					.append(URLEncoder.encode("json", "UTF-8"));
			urlBuilder.append("&").append(URLEncoder.encode("areaCode", "UTF-8")).append("=")
					.append(URLEncoder.encode(areaCode, "UTF-8"));
			urlBuilder.append("&").append(URLEncoder.encode("arrange", "UTF-8")).append("=")
					.append(URLEncoder.encode("C", "UTF-8"));

			URL url = new URL(urlBuilder.toString());
			conn = (HttpURLConnection) url.openConnection();
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

			String jsonString = sb.toString();
			
			if (jsonString.startsWith("<")) {
				System.out.println("API 호출 에러 발생: " + jsonString);
				return;
			}

			if (jsonString.contains("\"items\":\"\"")) {
				jsonString = jsonString.replace("\"items\":\"\"", "\"items\":null");
			}

			ObjectMapper objectMapper = new ObjectMapper();

			GreenTourAttractionResponse root = objectMapper.readValue(jsonString, GreenTourAttractionResponse.class);

			if (root.getResponse() != null && root.getResponse().getBody() != null
					&& root.getResponse().getBody().getItems() != null) {
				List<Attraction> list = root.getResponse().getBody().getItems().getItem();
				if (list != null) {
					for (Attraction a : list) {
						String[] targets = { "휴무일", "지정현황", "이용요금", "화장실", "장애인 편의시설", "주차시설" };

						for (String target : targets) {
							Pattern pattern = Pattern.compile(target + "\\s*:\\s*([^<\\n]+)");
							Matcher matcher = pattern.matcher(a.getAttractionSummary());

							if (matcher.find()) {
								String value = matcher.group(1).trim();
								switch (target) {
									case "휴무일" -> a.setAttractionHoliday(value);
									case "지정현황" -> a.setAttractionDesignation(value);
									case "이용요금" -> a.setAttractionFee(value);
									case "화장실" -> a.setAttractionRestroom(value);
									case "장애인 편의시설" -> a.setAttractionAccessible(value);
									case "주차시설" -> a.setAttractionParking(value);
								}
							} else {
								switch (target) {
								case "휴무일" -> a.setAttractionHoliday("");
								case "지정현황" -> a.setAttractionDesignation("");
								case "이용요금" -> a.setAttractionFee("");
								case "화장실" -> a.setAttractionRestroom("");
								case "장애인 편의시설" -> a.setAttractionAccessible("");
								case "주차시설" -> a.setAttractionParking("");
							}
							}
						}
						
						/*
						String origin = a.getAttractionSummary();
						String summary = "";

						if (origin != null) {
							if (origin.contains("* 문의")) {
								String[] parts = origin.split("\\* 문의");
								summary = parts[0].trim();
							} else if (origin.contains("◎이용안내")) {
								String[] parts = origin.split("◎이용안내");
								summary = parts[0].trim();
							} else {
								summary = origin.trim();
							}

							a.setAttractionSummary(summary);
						}
						*/
					}
				}
				
				int result = service.insertAttraction(list);
				System.out.println(result);
			} else {
				System.out.println(areaCode + " 지역에 데이터가 없습니다.");
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (conn != null)
				conn.disconnect();
		}
	}
}