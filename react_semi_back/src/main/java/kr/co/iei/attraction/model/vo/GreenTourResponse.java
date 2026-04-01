package kr.co.iei.attraction.model.vo;

import lombok.Data;
import java.util.List;

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
    }

    @Data
    public static class Items<T> {
        private List<T> item; // List<Area> 등이 동적으로 들어옴
    }
}