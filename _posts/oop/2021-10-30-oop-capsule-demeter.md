---
title: "객체지향 - 캡슐화 , 디미터법칙"
layout: archive
date: 2021-10-30
---

# 캡슐화
> 객체의 속성(data fields)와 행위(메서드)를 하나로 묶고,  
> 실제 구현 내용 일부를 외부에 감추어 은닉한다.  
> (위키피디아)

# 디미터 법칙(Law of Demeter)
>각 유닛은 다른 유닛에 대한 제한된 지식만 가지고 있어야 합니다. 현재 유닛과 "밀접하게" 관련된 유닛만 있어야 합니다.  
각 유닛은 친구들과만 대화해야 합니다. 낯선 사람과 이야기하지 마십시오.  
가까운 친구에게만 이야기하십시오.  
> (위키피디아)


캡슐화는 외부로부터 내부 로직을 감춤으로써(은닉), 객체의 내부 데이터와 메소드의 응집도가 생깁니다. 이러한 부분은 스스로 자율적인 객체가 되는 이점이있습니다. 
프로젝트가 커지거나 유지보수를 해야할때 추가 또는 수정되는 코드의 비용을 줄일 수 있습니다.
또한, 데이터와 메소드의 응집도가 생기므로 팀단위 개발 또는 규모가 커질때 파편화된 코드를 줄일 수 있고 중복된 코드를 방지 할 수있습니다.

## 캡슐화를 적용하지 않은 코드 예시
```java
# Member.java

public class Member {
    private final String role;
    private final String userName;

    public Member(String userName, String role) {
        this.userName = userName;
        this.role = role;
    }

    public String getRole() {
        return role;
    }
}

```
```java
# TEST 코드
public class MemberTest {

    @Test
    void memberRoleTest() {
        Member member = new Member("myname", "ADMIN");
        if (member.getRole().equals("ADMIN")) {
            System.out.println("ADMIN 입니다.");
        }
    }
```

<code>MemberTest</code> 에서 ```member.getRole()```으로 Role 에 대한 정보를 가져오고 있습니다. 그리고 member 외부의 코드에서 
```ADMIN```을 비교하고 있습니다. Role 을 비교해야하는 부분이 많아 진다면 중복된 코드와 상수화되지 않은 "ADMIN" 이라는 문자열은 유지보수와 사이트 이펙트를 발생 시킬것입니다.  
```member```객체 스스로에게 ADMIN 이냐고 확인질문을 한다면 어떻게 될까요? 아래의 코드에서 확인 해보겠습니다.  


```java

public class Member {
    private final String role;
    private final String userName;

    public Member(String userName, String role) {
        this.userName = userName;
        this.role = role;
    }

    public boolean hasAdmin() {
        return role.equals("ADMIN");
    }
}
```
```java
    @Test
    void memberRoleTest() {
        Member member = new Member("myname", "ADMIN");
        if (member.hasAdmin()) {
            System.out.println("ADMIN 입니다.");
        }
    }

```

```Member```를 사용하는 곳에서 더이상 "ADMIN"이라는 문자로 비교 하지않습니다. 이로인해서 ADMIN 을 판단하는 로직은 Member 에게 묻게되고 
Member 객체는 Role 을 식별하는 메소드를 가짐으로써 캡슐화와 은닉화를 통해 객체의 응집도를 증가 시킬 수 있습니다.  

"ADMIN" 이라는 ROLE 이 외부에서 String 으로 주입받는 것은 문제가 될 수 있습니다. 상수화되지 않은 "ADMIN" 이라는 변수를 계속해서 관리해줘야 하기 때문입니다.  
ROLE 은 많은 부분에서 
인증기능과 관련이 될 수 있는 부분인데 이러한 데이터가 어떠한 지정된 타입으로 되어 있지않다면 개발을 진행함에 있어서 불안한 요소가 됩니다.  

```java
# MemberROLE
public enum MemberROLE {
    ADMIN, USER;

    public static boolean isAdmin(MemberROLE role) {
        return role.equals(ADMIN);
    }
}
```

```java
# Member
public class Member {
    private final MemberROLE role;
    private final String userName;

    public Member(String userName, MemberROLE role) {
        this.userName = userName;
        this.role = role;
    }

    public boolean hasAdmin() {
        return MemberROLE.isAdmin(role);
    }
}
```

기본 타입(primitive type)을 사용하지 않고 ```MemberROLE```타입을 정의 함으로써 좀 더 객체지향 관점으로 코드를 작성 할 수 있지않나 생각이 듭니다.   
```MemberROLE.isAdmin(role)```와 같이 객체에게 질문을 던짐으로써 객체단위의 책임이 명확히 분리 시킬 수 있습니다. 이로인해 코드의 유연함, 재사용성 증가, 확장성을
증가 시킬수  있다고 생각합니다.
  



### 참조
[캡슐화 위키피디아](https://ko.wikipedia.org/wiki/%EC%BA%A1%EC%8A%90%ED%99%94)  
[Law of Demeter 위키피디아](https://en.wikipedia.org/wiki/Law_of_Demeter)