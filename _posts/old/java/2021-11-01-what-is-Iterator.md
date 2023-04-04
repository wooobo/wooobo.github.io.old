---
title: "Iterator?"  
date: 2021-11-02
---

#이터레이터(Iterator) 란?
> 반복자(iterator)는 객체 지향적 프로그래밍에서 배열이나 그와 유사한 자료 구조의 내부의 요소를 순회(traversing)하는 객체이다.
> (위키백과)
>
Iterator 는 컬렉션 프레임워크에 속하는 인터페이스입니다. 컬렉션을 탐색하고 데이터 요소에 액세스하며 컬렉션의 데이터 요소를 제거할 수 있습니다.
## Iterator 메소드
Iterator.hasNext() : 다음 요소가 있으면 true 를 반환  
Iterator.next() : 다음 요소를 반환  
Iterator.remove() : 현재 요소를 제거

### example code
```java
  # ArrayList
  ArrayList<String> cars = new ArrayList<String>();
  cars.add("Volvo");
  cars.add("BMW");
  cars.add("Ford");
  cars.add("Mazda");
  
  Iterator<String> iter = cars.iterator();
  while (iter.hasNext()) {
      Object obj = iter.next();
      System.out.println("ArrayList : " + obj);
  }
  
  # Set
  Set<String> setCars = new HashSet<>();
  setCars.add("Volvo");
  setCars.add("BMW");
  setCars.add("Ford");
  setCars.add("Mazda");
  
  
  Iterator<String> iter2 = setCars.iterator();
  while (iter2.hasNext()) {
    System.out.println("set : " + iter2.next());
  }
```

Iterator 를 잘 활용하면 코드를 단순화하고 일반화 할 수 있을 것 같다.
