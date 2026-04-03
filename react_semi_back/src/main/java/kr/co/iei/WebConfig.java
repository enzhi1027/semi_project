package kr.co.iei;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer{
	@Value("${file.root}")
	private String root;


	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry
			.addResourceHandler("/editer/**")
			//요청 패턴 ** = 뒤에 뭐가 오든 상관없다는 뜻
			.addResourceLocations("file:///"+root+"editer/");
			//실제 경로.(중요)
		
		registry
		.addResourceHandler("/member/thumb/**")				//요청 경로
		.addResourceLocations("file:///"+root+"member/");	//실제 경로
	}
}