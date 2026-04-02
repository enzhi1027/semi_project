package kr.co.iei.attraction.model.vo;

import lombok.Data;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.annotation.Nulls;

@Data
public class GreenTourResponse<T> { // <T> 추가
	private Response<T> response;

	@Data
	public static class Response<T> {
		private Header header;
		private Body<T> body;
	}

	@Data
	public static class Header {
		private String resultCode;
		private String resultMsg;
	}

	@Data
	public static class Body<T> {
		private Items<T> items;
		private int numOfRows;
		private int pageNo;
		private int totalCount;

		@JsonSetter("items")
		public void setItems(Object itemsValue) {
			if (itemsValue instanceof String && ((String) itemsValue).isEmpty()) {
				this.items = null;
			} else if (itemsValue instanceof java.util.Map) {
				com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
				this.items = mapper.convertValue(itemsValue, Items.class);
			}
		}
	}

	@Data
	public static class Items<T> {
		private List<T> item;
	}
}