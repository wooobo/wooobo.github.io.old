---
title: "객체지향 생활 체조(모든 원시값과 문자열을 포장한다.)"  
layout: archive  
date: 2021-11-01  
---

```java
public class Balls {
    private static final int MIN = 1;
    private static final int MAX = 9;

    private final List<Integer> balls = new ArrayList<>();

    public void add(int ball) {
        validBall(ball);
        this.balls.add(ball);
    }


    private void validBall(int number) {
        if (number < MIN || number > MAX) {
            throw new InvalidParamException();
        }
    }
}
```
Balls 는 ball 리스트를 가집니다. ball 은 최소(MIN), 최대(MAX) 조건이 있는 타입입니다.  

```java
    private void validBall(int number) {
        if (number < MIN || number > MAX) {
            throw new InvalidParamException();
        }
    }
```
balls 는 특정한 조건을 가지기 때문에 위 코드 처럼 별도의 검증처리를 해줍니다.  

`List<Integer> balls` 단순히 변수의 이름 "balls" 로 정의 된것이 아닌 좀더 객체지향의 관점에서 본다면 어떨까요?  
`List<Ball> balls` 이렇게 말입니다.  
`List<Integer> ball` 에서  `List<Ball> balls`정의 했을 뿐인데, 편안함이 느껴지지 않나요? ^^?;;;;;  
`List<Integer> ball`는 단순히 Integer 를 가진 변수일까? 어떤 조건이 있는 것 일까? 코드를 처음 보는 사람은 고민을 하게 됩니다.   
만약에 `Balls`객체가 1000줄 짜리 코드이고 거기에 `List<Integer> ball` 인스턴스 변수였다면, 수정하거나 값을 추가하기 부담스러울 것입니다.   
validation 하는 부분을 찾기 힘들거나 찾았다 하더라도 정말 그것만으로 다 인가? 하는 의구심이 들기 때문입니다.  

어떠한 객체가 있는데 그 객체가 최소(MIN), 최대(MAX) 조건이 있는 타입의 객체라면 어떨까요?    

Ball.class 로 원시 값 포장을 해보았습니다.
```java 
public class Ball {
    private static final int MIN = 1;
    private static final int MAX = 9;

    private final int number;

    public Ball(int number) {
        validBallNumber(number);
        this.number = number;
    }

    public int getNumber() {
        return number;
    }

    private void validBallNumber(int number) {
        if (number < MIN || number > MAX) {
            throw new InvalidParamException();
        }
    }
}
```

Balls 는 이렇게 변경 됩니다.  
```java 
public class Balls {
    private List<Ball> balls = new ArrayList<>();

    public void addBall(Ball ball) {
        this.balls.add(ball);
    }
}
```

Balls 는 더이상 ball 의 검증을 책임지지 않고, Ball 이 자신의 조건을 스스로 관리 할 수 있게 분리되었습니다.  
이처럼 원시 값 포장 객체의 명확성을 확보 할 수 있습니다. 이는 추후 유지보수때 도움이 됩니다.  

## 참조

[객체지향 생활 체조 총정리](https://developerfarm.wordpress.com/2012/02/03/object_calisthenics_summary/)


