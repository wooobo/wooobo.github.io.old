---
title: "버블정렬과 선택정렬"
date: 2021-10-19
---

# 1. 버블 정렬
>두 인접한 원소를 검사하여 정렬하는 방법이다. 시간 복잡도가 O(n<sup>2</sup>)로 상당히 느리다.
> 원소의 이동이 거품이 수면으로 올라오는 듯한 모습을 보이기 때문에 지어진 이름이다. 양방향으로 번갈아 수행하면 칵테일 정렬이 된다.

## 코드 (java)
```java
void bubbleSort(int[] arr) {
  int temp = 0;
  for(int i = 0; i < arr.length - 1; i++) {
    for(int j= 1 ; j < arr.length - i; j++) {
      if(arr[j]<arr[j-1]) {
        temp = arr[j-1];
        arr[j-1] = arr[j];
        arr[j] = temp;
      }
    }
  }
  System.out.println(Arrays.toString(arr));
}
```

버블정렬은 두 원소를 검사하며 정렬하는 알고리즘이다.  
구현로직은 굉장히 간단하다. 
인접한 2개의 원소를 오름/내림 조건에 따라 비교해서 swap 한다.    
버블정렬은 인접한 숫자를 비교하면서 조건에 해당할 경우 많은 swap 이 발생하므로, 효율이 좋지않다.    
평균적인 시간복잡도는 O(n<sup>2</sup>) 이다.  


# 2. 선택정렬
>선택 정렬(選擇整列, selection sort)은 제자리 정렬 알고리즘의 하나로, 다음과 같은 순서로 이루어진다.  
주어진 리스트 중에 최소값을 찾는다.  
그 값을 맨 앞에 위치한 값과 교체한다(패스(pass)).  
맨 처음 위치를 뺀 나머지 리스트를 같은 방법으로 교체한다.


## 코드 (java)
```java
void selectionSort(int[] list) {
  int indexMin, temp;
  
  for (int i = 0; i < list.length - 1; i++) {
    indexMin = i;
    for (int j = i + 1; j < list.length; j++) {
      if (list[j] < list[indexMin]) {
        indexMin = j;
      }
    }
    temp = list[indexMin];
    list[indexMin] = list[i];
    list[i] = temp;
  }
}

```

선택정렬은 swap 할 위치가 정해져 있고, 범위안에서 가장 작은 수를 찾아 해당위치에 넣는다.  
마지막 원소까지 반복하는 알고리즘.  
시간복잡도는 버블정렬과 같다. 성능은 버블정렬보다 swap 이 적게 일어나므로 버블정렬보다는 우수하다.  

> 2,1,5,4,5 같은 숫자가 있는 배열을 정렬한다고 했을때  버블정렬은 같은숫자(5)의 순서를 보장(안정)되지만,
> 선택정렬은 5의 순서를 보장되지 않는다(불안정)


### 참고
[버블정렬 위키백과](https://ko.wikipedia.org/wiki/%EA%B1%B0%ED%92%88_%EC%A0%95%EB%A0%AC)
[선택정렬 위키백과](https://ko.wikipedia.org/wiki/%EC%84%A0%ED%83%9D_%EC%A0%95%EB%A0%AC)
