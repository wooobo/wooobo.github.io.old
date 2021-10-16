---
title: "VueJs 기본편 - Vue CLI 알아보기"  
description: 
layout: archive  
date: 2021-10-15  
---
<br>  

# Vue CLI란 뭘까?
Vue CLI는 VueJs를 설치 및 빌드를 간편하게 도와주는 도구 입니다.    
`$ npm install -g @vue/cli` 커맨드로 시스템 전역적으로 사용 할 수 있도록 설치 할 수 있습니다.  
vue-cli를 설치 하고나면, `$ vue create {앱이름}` 커맨드를 통해 VUE 프로젝트를 빠르게 시작 할 수 있습니다.  
## vue create my-app 
vue 프로젝트를 생성 해보겠습니다.

```shell
vue create my-app
```
대화 형태로 설치를 진행 하게 됩니다.  
![img.png]({{ "assets/images/vue-cli1.png" | relative_url }})    

{% highlight html%}
Vue CLI v4.5.14
? Please pick a preset: (Use arrow keys)  
  # vue2에 해당하는 가장 기본적인 스캐폴딩 구조로 생성됩니다.
❯ Default ([Vue 2] babel, eslint)          
  # vue3로 설치
  Default (Vue 3) ([Vue 3] babel, eslint)
  # 모듈을 좀 더 추가 하고 싶을때(vue-route,vuex,sass 등등)
  Manually select features                 
{% endhighlight %}  


`Manually select features 선택`귀찮으니까 다 선택 해줍니다...ㅎ
> - 타입스크립트 설정
> - Vue-router 모듈 설치
> - Vuex 모듈 설치  
> - CSS Pre-processors (Sass)
> - 등등
{% highlight html%}
Vue CLI v4.5.14
? Please pick a preset: Manually select features
? Check the features needed for your project: (Press <space> to select, <a> to t
oggle all, <i> to invert selection)
❯◉ Choose Vue version
◉ Babel 
◉ TypeScript
◉ Progressive Web App (PWA) Support
◉ Router
◉ Vuex
◉ CSS Pre-processors
◉ Linter / Formatter
◯ Unit Testing
◯ E2E Testing
{% endhighlight %}

vue create 후 프로젝트 구조 어떻게 생겼는지만 보고 넘어갑니다~  
![img.png]({{ "assets/images/vue-Frame-1.png" | relative_url }})

## vue-cli-service 사용하기
기본 적으로 3개의 커맨드 스크립트가 생성됩니다.  
package.js 에서 확인 할 수 있습니다.
{% highlight html%}
"scripts": {
  "serve": "vue-cli-service serve",  # 쉽게 서버를 구동 시킬수 있습니다. 
  "build": "vue-cli-service build",  # 배포시 빌드 커맨드
  "lint": "vue-cli-service lint"    
},
{% endhighlight %}

바로 서버 띄워 보겠습니다.

{% highlight html%}
yarn serve 
or
npm run serve
{% endhighlight %}
터미널 화면  
![img.png]({{ "assets/images/yarn-vue-serve.png" | relative_url }})

localhost:8080 접속해보기
![img.png]({{ "assets/images/vue-serve-page.png" | relative_url }})


> 빠르게 vue-cli 를 통해 vue 스캐폴딩 구조로 설치해보고 서버를 띄워 보았습니다.