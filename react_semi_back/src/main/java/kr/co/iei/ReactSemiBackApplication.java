package kr.co.iei;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;


@EnableScheduling
@SpringBootApplication
public class ReactSemiBackApplication {

	public static void main(String[] args) {
		SpringApplication.run(ReactSemiBackApplication.class, args);
	}

}
