---
title: "JUnit - Parameterized Test"  
date: 2021-11-05
---

<br>

#  `@ParameterizedTest` 로 다양하게 테스트 해보기

`@ParameterizedTest` 다양한 파라미터로 테스트 할때 유용하게 사용됩니다.


## 5보다 작은 숫자 테스트

```java
@Test
void isLessThan_5() {
    assertThat(1).isLessThan(6);
    assertThat(2).isLessThan(6);
    assertThat(3).isLessThan(6);
    assertThat(4).isLessThan(6);
    assertThat(5).isLessThan(6);
}
```

위 코드 처럼 6이하의 케이스를 테스트 하고싶다고 할때, 중복된 코드가 많이 발생하게 됩니다.  

이러한 부분을 `@ParameterizedTest` 을 사용해서 리팩토링 해보겠습니다.

```java
@ParameterizedTest
@ValueSource(ints = {1, 2, 3, 4, 5})
@DisplayName("5보다 작은 숫자 테스트")
void ValueSource_test(int expected) {
    assertThat(expected).isLessThan(6);
}
```

`@ValueSource` 를 활용해서 테스트가 진행될때 숫차적으로 `(int expected)` 인자로 부여되면서 진행됩니다.  
`ints` 이 외에도 `strings = {"1", "2", "3", "4", "5"}` 등 다른타입도 적용가능합니다.  

## 한개 이상의 인자를 사용하고 싶을때?

위 예제는 5보다 작은 숫자 테스트 였습니다.  
그런데 {숫자}보다 작은 숫자 테스트 하고싶을때는 아래와 같은 방법을 사용 할 수 있습니다.  
```java 
@ParameterizedTest
@CsvSource(value = {
    "1,2", // number, expected
    "20,30"
})
void csvSource(int number, int expected) {
    assertThat(number).isLessThan(expected);
}
```

`@CsvSource` 의 기본 구분자는 `","`입니다. 
만약 다른 구분자를 사용하고 싶을때는

```java 
  @ParameterizedTest
  @CsvSource(value = {
      "1:2",
      "20:30"
  }, delimiter = ':')
```

`delimiter = ':'` 를 통해 다른 구분자를 사용해서 분리 시킬수 있습니다. 


## Primitive type 타입 외 객체 부여하기

`@MethodSource("{메소드 이름}")` 을 사용하면 다양하게 인자를 사용할 수 있습니다.  


```java 
class TestNumber {
    private int number;

    public TestNumber(int number) {
        this.number = number;
    }

    public int getNumber() {
        return number;
    }
}

// TestNumber 를 인자로 사용해보겠습니다.
```

```java 
    @ParameterizedTest
    @MethodSource("이것은_주입인자_메소드")
    void MethodSource_test(TestNumber testNumber, int number) {
        assertThat(testNumber.getNumber()).isEqualTo(number);
    }

    private static Stream<Arguments> 이것은_주입인자_메소드() {
        return Stream.of(
            Arguments.of(new TestNumber(1), 1),
            Arguments.of(new TestNumber(2), 2),
            Arguments.of(new TestNumber(3), 3)
        );
    }
```

`private static Stream<Arguments> 이것은_주입인자_메소드() {` 메소드처럼 인자를 정의하고  
`@MethodSource("이것은_주입인자_메소드")` 를 통해 메소드 이름을 정의하면,
Primitive type 말고도 다양하게 테스트 할 수 있습니다~


