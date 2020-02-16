package com.workfront.quiz.security.jwt;

import com.workfront.quiz.api.impl.ExceptionHandlerController;
import com.workfront.quiz.config.ExceptionHandlerControllerConfig.ExceptionHandlerControllerProvider;
import com.workfront.quiz.entity.UserEntity;
import com.workfront.quiz.repository.UserRepository;
import com.workfront.quiz.service.util.exception.InactiveUserException;
import com.workfront.quiz.service.util.exception.UserNotFoundException;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class JwtTokenFilter extends GenericFilterBean {
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;


    private ExceptionHandlerController exceptionHandlerController = new ExceptionHandlerControllerProvider().provide();


    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        try {

            Optional<String> optionalJwtToken = jwtTokenProvider
                    .resolveToken((HttpServletRequest) servletRequest);

            if (optionalJwtToken.isPresent()) {
                if (isUserActive(optionalJwtToken.get())) {

                    optionalJwtToken.map(jwtTokenProvider::getAuthentication)
                            .ifPresent(SecurityContextHolder.getContext()::setAuthentication);
                    filterChain.doFilter(servletRequest, servletResponse);

                } else {
                    throw new InactiveUserException(jwtTokenProvider.getUsername(optionalJwtToken.get()));
                }
            }

        } catch (JwtAuthenticationException jwtException) {
            exceptionHandlerController.handleFilterExceptions(jwtException, (HttpServletResponse) servletResponse);
        }
    }

    private boolean isUserActive(String token) {
        String email = jwtTokenProvider.getUsername(token);
        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email));
        return userEntity.getActive();
    }
}
