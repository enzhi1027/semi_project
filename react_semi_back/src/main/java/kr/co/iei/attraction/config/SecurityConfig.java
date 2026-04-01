package kr.co.iei.attraction.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // 외부 API 호출 테스트 시 편리함
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/attractions/**").permitAll() // 본인이 만든 호출 경로 허용
                .anyRequest().permitAll() // 테스트 단계라면 일단 모두 허용
            );
        return http.build();
    }
}