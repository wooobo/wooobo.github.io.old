---
title: "스프링 MVC 핵심 구성 요소 "  
layout: archive  
date: 2022-01-13
---

> 해당 글은 "스프링 5 프로그래밍 입문(최범균 저)" 책를 보고 학습하여 정리한 내용입니다. 

# 1. 스프링 MVC 핵심 구성 요소  
![img.png]({{ "assets/images/spring-dispatcherServlet.jpg" | relative_url }})
   *스프링 MVC 핵심 구성요소*

DispatcherServlet 은 모든 연결을 담당합니다.  
웹 요청이 들어오면 HandlerMapping 에서 빈객체에게 컨트롤러 검색을 요청하고 요청 경로에 컨트롤러가 있으면 컨트롤러를 리턴한다.  
전달 받은 컨트롤러는 DispatcherServlet 가 받은후 @Controller, Controller 인터페이스, HttpRequestHandler 인터페이스를 동일한 방식으로 
처리하기 위해 중간에 사용되는 것이 바로 HandlerAdapter 빈이다.

HandlerAdapter 로부터 컨트롤러의 요청 처리 결과를 ModelAndView 로 받으면 DispatcherServlet 은 결과를 보여줄 뷰를 찾기 위해 ViewResolver 
사용한다. ModelAndView 가 담고 있는 뷰 이름에 해당하는 View 객체를 찾거나 생성해서 리턴한다. 응답을 생성하기 위해 JSP 를 사용하는 ViewResolver 
는 매번 새로운 View 객체를 생성해서 DispatcherServlet 에 리턴한다.
DispatcherServlet 은 ViewResolver 가 리턴한 View 객체에게 응답 결과 생성을 요청한다. JSP 를 사용하는 경우 View 객체는 
JSP 를 실행함으로써 웹 브로우저에 전송할 응답 결과를 생성하고 이로써 모든 과장이 끝이 난다.

- 정리
  - DispatcherServlet 를 중심으로 HandlerMapping, HandlerAdapter, Controller, ViewResolver, View 각자 역할을 수행해서 큰라이언트의 요청을 수행한다.
    이중 하나라도 어긋나면 처리할 수 없으므로 구성요소를 올바르게 설정하는 것이 중요하다.


# 2. WebMvcConfigurer 인터페이스와 설정
@EnableWebMvc 애노테이션을 사용하면 @Controller 애노테이션을 붙인 컨트롤러를 위한 설정을 생성한다. 또한, @EnableWebMvc 
애노테이션을 사용하면 WebMvcConfigurer 타입의 빈을 이용해서 MVC 설정을 추가로 생성한다.

# 3. JSP 를 위한 ViewResolver
컨트롤러 처리 결과를 JSP 로 사용하기 위한 설정.
```java
@Configuration
@EnableWebMvc
public class MvcConfig implements WebMvcConfigurer {
  
  @Override
  public void configureViewResolvers(ViewResolverRegistry registry) {
    registry.jsp("/WEB-INF/view/",".jsp");
  }
}
```
위 설정은 InternalResourceViewResolver 클래스를 이용해서 다음 설정과 같은 빈을 등록한다.

```java
@Bean
public ViewResolver viewResolver() {
  InternalResourceViewResolver vr = new InternalResourceViewResolver();
  vr.setPrefix("/WEB-INF/view/");
  vr.setSuffix(".jsp");
  return vr;
}
```

# 4. 디폴트 핸들러와 HandlerMapping 우선순위
매핑 경로가 "/"인 경우 .jsp 로 끝나는 요청을 제외한 모든 요청을 DispatcherServlet 이 처리한다. 
index.html 아니 *.css 같은 .jsp 가 아닌 모든 요청을 DispatcherServlet 이 처리하게 되는 것이다.

컨트롤러가 객체를 찾지못해 404가 발생하는 경우가 발생하는데, 이럴경우 configureDefaultServletHandling() 메서드를 
사용하는 것이 편리하다.
```java
@Configuration
@EnableWebMvc
public class MvcConfig implements WebMvcConfigurer {
  
  @Override
  public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
    configurer.enable();
  }
}
```

위 설정을 하게되면,
- DefaultServletHttpRequestHandler
- SimpleUrlHandlerMapping

두개의 빈 객체가 추가된다.  

RequestMappingHandlerMapping 의 적용우선 순위가 SimpleUrlHandlerMapping 의 우선순위보다 높다.  
요청이 들어오면, 
1. RequestMappingHandlerMapping 를 사용해서 컨트롤러를 찾는다.
2. 존재하지 않으면 SimpleUrlHandlerMapping 을 사용해서 처리할 핸들러를 검색한다. 
  - SimpleUrlHandlerMapping 은 "/**" 모든 경로에 대해 DefaultServletHttpRequestHandler 를 리턴한다.

만약 "index.html" 요청이 들어오면 1번에서 컨트롤러를 찾지 못하고 2번을 통해 디폴트 서블릿이 /index.html 요청을 처리하게 된다.  
DefaultServletHandlerConfigurer.enable() 을 설정하면 별도 설정이 없는 모든 요청 경로를 디폴트 서블릿이 처리하게 된다.



> 해당 글은 "스프링 5 프로그래밍 입문(최범균 저)" 책를 보고 학습하여 정리한 내용입니다.
