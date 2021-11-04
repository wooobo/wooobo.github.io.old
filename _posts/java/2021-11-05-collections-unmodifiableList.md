---
title: "Java - Collections.unmodifiableList 알아보기"  
layout: archive  
date: 2021-11-05  
---

<br>
Java 에서 Collection 의 불변성을 보장해주는 Collections.unmodifiableList 이 있습니다.  
Collections.unmodifiableList(list) 로 반환된 객체는 수정삭제가 불가능합니다.

```java
 @Test
void test() {
    List<Integer> list = new ArrayList<>();
    list.add(1);
    System.out.println(list); // 출력 결과 :[1]

    List<Integer> list2 = Collections.unmodifiableList(list);
    System.out.println(list.equals(list2)); // 출력 결과 : true

    list.add(2);
    System.out.println(list); // 출력 결과 : [1, 2]
    System.out.println(list2); // 출력 결과 : [1, 2]

    list2.remove(1); // 출력 결과 : java.lang.UnsupportedOperationException 에러 발생
    list2.add(1); // 출력 결과 : java.lang.UnsupportedOperationException 에러 발생
}
```

위 코드 출력 결과 
```java
[1]
true
[1, 2]
[1, 2]

java.lang.UnsupportedOperationException
```
`list.equals(list2)` 는 `true` 입니다. Collections.unmodifiableList 으로 반환된 객체는 결국 원본객체의 참조입니다.  
 그러므로 원본 객체가 수정되면 `Collections.unmodifiableList` 으로 반횐된 `list2`도 동일한 값을 가집니다.  
그러나, `list2`는 불변객체 이므로 수정 삭제가 불가능합니다.