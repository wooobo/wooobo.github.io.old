---
title: "kafka 와 debezium 살펴보기"  
date: 2022-01-11
---

개발 하던중 이벤트 발생 서버와 처리하는 서버가 다를 경우 이벤트 전달에 대해서 고민을 한적이 있습니다.  
그때에, "마이크로서비스 이렇게 한다"책을 보게 되었는데 책에서 `CDC`라는 기술이 있다는것을 알게 되었습니다.  

이후 `CDC`기술에 대해 관심을 가지게 되었고, `CDC`를 활용한다면 서버간의 유연함을 유지하면서 이벤트 기반 아키텍쳐를 구현 할 수 있을것 같았습니다.  
이번 글에서는 Kafka와 CDC 를 위한 분산 플랫폼 Debezium 의 세팅하고 기본 사용하는 부분에 대해서 알아보겠습니다.

# 카프카란?  
> Kafka는 실시간 이벤트 기반 애플리케이션 개발을 가능하게하는 오픈 소스 분산 스트리밍 플랫폼이다.  

# debezium 이란?
> Debezium 이란 CDC 를 위한 오픈 소스 분산 플랫폼입니다.   
> 데이터베이스 커밋으로 발생하는 삽입,업데이트,삭제를 감지하고 인벤트를 발생 시킵니다.  
> Apache Kafka 를 기반으로 구축 되었습니다.  

# CDC 란?
> CDC 는 Change Data Capture 의 약자입니다.  
> 데이터베이스에서 변경 데이터 캡처(change data capture, CDC)는 변경된 데이터를 사용하여 동작을 취할 수 있도록 데이터를 결정하고 추적하기 위해 사용되는 여러 소프트웨어 디자인 패턴들의 모임입니다.

# 시작하기
---

## 카프카 실행하기
```shell

# 카프카를 다운
wget https://www.apache.org/dyn/closer.cgi?path=/kafka/3.0.0/kafka_2.13-3.0.0.tgz

# 압축 해제
tar -xzf kafka_2.13-3.0.0.tgz

# zookeeper 실행
bin/zookeeper-server-start.sh config/zookeeper.properties

# kafka 실행
bin/kafka-server-start.sh config/server.properties

# topic list 확인
bin/kafka-topics.sh --bootstrap-server localhost:9092  --list
> __consumer_offsets
```

주키퍼와 카프카 실행커멘드까지 살펴보았습니다.

debezium 을 설치 해보겠습니다.

```shell
# mysql connect 라이브러리를 다운받습니다
# 이외에도  Postgres, MonggoDB 등등도 가능하므로, 링크 참고(https://debezium.io/documentation/reference/1.8/install.html) 
wget https://repo1.maven.org/maven2/io/debezium/debezium-connector-mysql/1.8.0.Final/debezium-connector-mysql-1.8.0.Final-plugin.tar.gz

# 압축 해제
tar -xzf debezium-connector-mysql-1.8.0.Final-plugin.tar.gz
# debezium 폴더 파일
CHANGELOG.md   LICENSE-3rd-PARTIES.txt  README_JA.md            debezium-api-1.8.0.Final.jar              debezium-ddl-parser-1.8.0.Final.jar  mysql-binlog-connector-java-0.25.4.jar
CONTRIBUTE.md  LICENSE.txt              README_ZH.md            debezium-connector-mysql-1.8.0.Final.jar  failureaccess-1.0.1.jar              mysql-connector-java-8.0.27.jar
COPYRIGHT.txt  README.md                antlr4-runtime-4.8.jar  debezium-core-1.8.0.Final.jar             guava-30.0-jre.jar
---
```

해당 폴더를 kafka/libs 폴더안으로 이동시켜줍니다.(다른 폴더에 있을때, mysql-connector 를 찾지 못하더라구요)
```shell
# 이렇게 이동 시켰습니다.
kafka_2.13-3.0.0/libs/debezium-connector-mysql
```

그리고 kafka-connect 설정을 해줘야합니다.  
카프카 프로젝트 안에 `config/connect-distributed.properties` 파일에서 

```shell
# config/connect-distributed.properties 파일을 열고 최하단있는 "plugin.path" 설정을 수정해야됩니다.
# debezium 라이브러리 위치와 카프카 libs 경로를 지정해줍니다.
plugin.path=/home/kafka_2.13-3.0.0/libs, /kafka_2.13-3.0.0/libs/debezium-connector-mysql,
```

그리고 kafka connect 를 실행하면 되는데요,  
커맨드는 `bin/connect-distributed.sh config/connect-distributed.properties` 입니다.
해당 커멘드를 치고

```shell
[2022-01-11 22:12:05,041] INFO [test-db-connectabc|task-0] Connected to MySQL binlog at localhost:3306, starting at MySqlOffsetContext [sourceInfoSchema=Schema{io.debezium.connector.mysql.Source:STRUCT}, sourceInfo=SourceInfo [currentGtid=null, currentBinlogFilename=binlog.000002, currentBinlogPosition=2655, currentRowNumber=0, serverId=0, sourceTime=null, threadId=-1, currentQuery=null, tableIds=[], databaseName=null], snapshotCompleted=false, transactionContext=TransactionContext [currentTransactionId=null, perTableEventCount={}, totalEventCount=0], restartGtidSet=null, currentGtidSet=null, restartBinlogFilename=binlog.000002, restartBinlogPosition=2655, restartRowsToSkip=1, restartEventsToSkip=2, currentEventLengthInBytes=0, inTransaction=false, transactionId=null, incrementalSnapshotContext =IncrementalSnapshotContext [windowOpened=false, chunkEndPosition=null, dataCollectionsToSnapshot=[], lastEventKeySent=null, maximumKey=null]] (io.debezium.connector.mysql.MySqlStreamingChangeEventSource:1203)
[2022-01-11 22:12:05,042] INFO [test-db-connectabc|task-0] Waiting for keepalive thread to start (io.debezium.connector.mysql.MySqlStreamingChangeEventSource:935)
[2022-01-11 22:12:05,043] INFO [test-db-connectabc|task-0] Creating thread debezium-mysqlconnector-serverName-binlog-client (io.debezium.util.Threads:287)
[2022-01-11 22:12:05,145] INFO [test-db-connectabc|task-0] Keepalive thread is running (io.debezium.connector.mysql.MySqlStreamingChangeEventSource:942)
이렇게 되면 연결 성공입니다.
```

debezium 은 rest api 를 지원하는데요,  
잘 실행 됬는지 호출해봅니다.  
```shell
curl -H "Accept:application/json" localhost:8083/
> {"version":"3.0.0","commit":"8cb0a5e9d3441962","kafka_cluster_id":"XwZqiJE3QhytA2hnnleoJw"}

대충 이렇게 나오면 정상 실행중입니다.
```

저는 mysql connector 를 사용 할것이므로,
로컬 mysql 서봐 커넥터를 생성 해보겠습니다. 

```shell
curl -i -X POST -H "Accept:application/json" -H "Content-Type:application/json" localhost:8083/connectors -d '{
  "name": "test-db-connect-test",  <--- 커넥션 이름
  "config": {  
    "connector.class": "io.debezium.connector.mysql.MySqlConnector", <--- 컨넥션 라이브러리 
    "tasks.max": "1",  
    "database.hostname": "localhost",   <--- DB 접속 주소
    "database.port": "3306",            <--- DB 접속 포트 
    "database.user": "debezium",        <--- DB 접속 아이디
    "database.password": "password",    <--- DB 접속 패스워드
    "database.server.id": "1",  
    "database.server.name": "serverName-test", 
    "table.include.list": "debezium_db.users", <--- 감시하고자 하는 테이블, 포맷은 {데이터베이스 이름}.{테이블이름} 입니다 
    "database.history.kafka.bootstrap.servers": "localhost:9092",  <--- 카프카 주소( 클러스터 구성시 콤마로 붙여주면 됩니다.)
    "database.history.kafka.topic": "schema-changes.users"   
  }
}'

> HTTP/1.1 201 Created
> Date: Tue, 11 Jan 2022 13:17:36 GMT
> Location: http://localhost:8083/connectors/test-db-connect-test
> Content-Type: application/json
> Content-Length: 512
> Server: Jetty(9.4.43.v20210629)

>  {"name":"test-db-connect-test","config":{"connector.class":"io.debezium.connector.mysql.MySqlConnector","tasks.max":"1","database.hostname":"localhost","database.port":"3306","database.user":"debezium","database.password":"password","database.server.id":"1","database.server.name":"serverName-test","table.include.list":"debezium_db.users","database.history.kafka.bootstrap.servers":"localhost:9092","database.history.kafka.topic":"schema-changes.users","name":"test-db-connect-test"},"tasks":[],"type":"source"}

정상 생성 되었습니다.  
```

이제 부터 users 테이블에서 변경이 발견하면 topic에 저장 되게됩니다.  
그렇다면 어떠한 토픽이 생성되었는지 확인해보겠습니다.  

```shell
 bin/kafka-topics.sh --bootstrap-server localhost:9092  --list

__consumer_offsets
connect-configs
connect-offsets
connect-status
schema-changes.users
serverName-test
serverName-test.debezium_db.users

"serverName-test.debezium_db.users" 해당 토픽이 생성된 토픽입니다.   
```

컨슈밍 하면서 DB 변경을 잘 추적하는지 확인해보겠습니다.  
```shell
# 컨슈머를 실행 합니다. 
bin/kafka-console-consumer.sh --topic serverName-test.debezium_db.users --from-beginning --bootstrap-server localhost:9092

# 업데이트 쿼리를 날려보겠습니다. 
UPDATE debezium_db.users t SET t.age = 30 WHERE t.id = 1

# 컨슈머로 이벤트 데이터가 들어오는것을 확인할 수 있습니다. 
> {"schema":{"type":"struct","fields":[{"type":"struct","fields":[{"type":"int32","optional":false,"field":"id"},{"type":"string","optional":true,"field":"name"},{"type":"int32","optional":true,"field":"age"}],"optional":true,"name":"serverName_test.debezium_db.users.Value","field":"before"},{"type":"struct","fields":[{"type":"int32","optional":false,"field":"id"},{"type":"string","optional":true,"field":"name"},{"type":"int32","optional":true,"field":"age"}],"optional":true,"name":"serverName_test.debezium_db.users.Value","field":"after"},{"type":"struct","fields":[{"type":"string","optional":false,"field":"version"},{"type":"string","optional":false,"field":"connector"},{"type":"string","optional":false,"field":"name"},{"type":"int64","optional":false,"field":"ts_ms"},{"type":"string","optional":true,"name":"io.debezium.data.Enum","version":1,"parameters":{"allowed":"true,last,false,incremental"},"default":"false","field":"snapshot"},{"type":"string","optional":false,"field":"db"},{"type":"string","optional":true,"field":"sequence"},{"type":"string","optional":true,"field":"table"},{"type":"int64","optional":false,"field":"server_id"},{"type":"string","optional":true,"field":"gtid"},{"type":"string","optional":false,"field":"file"},{"type":"int64","optional":false,"field":"pos"},{"type":"int32","optional":false,"field":"row"},{"type":"int64","optional":true,"field":"thread"},{"type":"string","optional":true,"field":"query"}],"optional":false,"name":"io.debezium.connector.mysql.Source","field":"source"},{"type":"string","optional":false,"field":"op"},{"type":"int64","optional":true,"field":"ts_ms"},{"type":"struct","fields":[{"type":"string","optional":false,"field":"id"},{"type":"int64","optional":false,"field":"total_order"},{"type":"int64","optional":false,"field":"data_collection_order"}],"optional":true,"field":"transaction"}],"optional":false,"name":"serverName_test.debezium_db.users.Envelope"},"payload":{"before":{"id":1,"name":"홍길동","age":31},"after":{"id":1,"name":"홍길동","age":30},"source":{"version":"1.8.0.Final","connector":"mysql","name":"serverName-test","ts_ms":1641907335000,"snapshot":"false","db":"debezium_db","sequence":null,"table":"users","server_id":1,"gtid":null,"file":"binlog.000002","pos":3153,"row":0,"thread":null,"query":null},"op":"u","ts_ms":1641907335852,"transaction":null}}

변경된 데이터는 JSON 데이터에서 
`"payload":{"before":{"id":1,"name":"홍길동","age":31},"after":{"id":1,"name":"홍길동","age":30}`
"payload" key의 값으로 들어옵니다 
```

만약에 컬럼이 더블 타입일 경우 숫자가 들어올때 이상한 숫자로 들어 올수 있는데요,   
`"decimal.handling.mode": "double"` 해당 옵션을 커넥트 생성시 넣어주면 더블숫자 그대로 잘 들어 옵니다.

이외에도 공식문서에 다양한 옵션이 정말 많습니다. [공식 문서 참고](https://debezium.io/documentation/reference/1.7/connectors/mysql.html#mysql-property-decimal-handling-mode)  


---

# 참고
[디베지움 공식](https://debezium.io/documentation/reference/tutorial.html)  
[카프카 공식](https://kafka.apache.org/)  
[Debezium 쓸까? 말까?](https://www.sosconhistory.net/soscon2019/content/data/session/Day%202_1730_2.pdf)  
[cdc-change-data-capture](https://www.qlik.com/us/change-data-capture/cdc-change-data-capture)  
