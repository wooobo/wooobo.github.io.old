---
title: "도대체 카프카 zookeeper.properties?"
layout: archive
date: 2020-12-23
---

-------------------------------------------------

# zookeeper.properties 알아보기

주키퍼를 실행 컨맨드는   
<code>bin/zookeeper-server-start.sh config/zookeeper.properties</code> 입니다.

"config/zookeeper.properties"는 주키퍼 실행시 설정 파일입니다.

```shell
# the location to store the in-memory database snapshots and, unless specified otherwise, the transaction log of updates to the database.
dataDir=/data/zookeeper # ZooKeeper가 데이터의 메모리 내 스냅 샷과 데이터베이스 업데이트의 트랜잭션 로그를 저장할 절대 경로입니다
# the port at which the clients will connect
clientPort=2181 # 클라이언트 연결 감지 포트
# disable the per-ip limit on the number of connections since this is a non-production config
maxClientCnxns=0 # 동시 접속 가능한 클라이언트 갯수입니다. 0은 무제한입니다.
# the basic time unit in milliseconds used by ZooKeeper. It is used to do heartbeats and the minimum session timeout will be twice the tickTime.
tickTime=2000 # 단일 틱의 길이 (밀리 초). ZooKeeper는 틱을 기본 시간 단위로 사용하여 시간 제한을 조절합니다. 기본값은 2000입니다.
# The number of ticks that the initial synchronization phase can take
initLimit=10 # 동기화 프로세스 동안 ZooKeeper 서버가 시간 초과되는 틱 수입니다. 기본값은 10입니다.
# The number of ticks that can pass between
# sending a request and getting an acknowledgement
syncLimit=5 # 팔로어가 시간 초과되기 전에 리더와 동기화하기 위해 기다리는 최대 틱 수입니다. 기본값은 5입니다.
# zoo servers
# these hostnames such as `zookeeper-1` come from the /etc/hosts file
server.1=zookeeper1:2888:3888 # 주키퍼 클러스터 구성시 1번서버 주키퍼
server.2=zookeeper2:2888:3888 # 2번서버 주키퍼
server.3=zookeeper3:2888:3888 # 3번서버 주키퍼
```
