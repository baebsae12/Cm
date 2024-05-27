#20240516 오늘 한 것 오늘은 데이터베이스 구성을 하고 express와 연결하려 했습니다 결과는 DB쿼리문은 문제없이 잘 작성되었습니다 CREATE TABLE messages ( id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, message TEXT NOT NULL, time TIMESTAMP DEFAULT CURRENT_TIMESTAMP );

CREATE TABLE users ( id INT AUTO_INCREMENT PRIMARY KEY, nickname VARCHAR(255) NOT NULL );

그리고 익스프레스와 연결하는 과정에서 문제가 생겼습니다 첫번째 오류 연결은 되지만 호스트를 찾을 수 없었습니다 이게 무슨 소리냐면 DB에 접속을 성공한 후 입력된 호스트 주소에 접속을 해야하는데 호스트 주소를 찾을 수 없다는 뜻 입니다. 이것으로 해결 방법을 찾아본 결과 로컬호스트에 연결하면 된다고 하여서 로컬호스트로 변경해보았지만 오류가 해결되지 않았습니다

두번째 오류는 호스트 이름을 IP주소로 변환하는 과정에서 생긴 오류였습니다 그래서 앞에 문제와 연결되는 오류라 생각하여 호스트 이름을 해결한 후에 시도를 다시 해보아야 한다 생각되어 앞선 문제를 해결하다 실패하여 이것도 해결하지 못했습니다.
------------------------------------------------------------
#20240517
오전
어제 해결하지 못한 익스프레스와 데이터베이스를 연결하는 과정을 해결하려했습니다
시도해본 것 들은

호스트 이름을 변환하고 커넥션 방식을 풀 커넥션 방식으로 바꾸어보았습니다. 그러니 핸드셰이킹 오류가 생겼습니다
핸드셰이킹 오류를 찾아보니 포트번호의 오타나 자잘한 MYSQL서버가 실행되어 있어야 한다하여 MYSQL 서버를 구성하였습니다
하지만 그럼에도 오류가 해결되지 않았습니다

오후
오후에는 어떤것이 문제인지 확인했습니다
제 코드에 문제였던것은 도커에 올리지 않고 서버를 자체에서 구동하려 했던것이 가장 큰 문제였습니다
위의 시도하려 했던 방식은 도커에 올리고 컨테이너 구성만 해주면 간단히 해결되는 문제였습니다 
그리고 기존에 있던 mysql을 mysql2로 변경하였습니다 그 후 서버의 포트번호를 8080으로 변경하였습니다

도커에 mysql 컨테이너와 이미지 설정을 해주었습니다 하지만 해결되지 않았습니다 이유는 DB서버만 연결해준다고 될것이 아니였습니다
WEB과 SERVER번호도 구성 해줘야 되기 때문이라고 생각하였습니다 그래서 검색해보니 yml 파일에 구성해주면 된다고 나와 시도하였으나 시간이 부족하여 마무리하지 못했습니다

https://www.notion.so/1c75c4948306403b86d833247d98c919?pvs=4
참고한 자료 정리

------------------------------------------------------------

#20240520

오전
도커에 데이터베이스 업로드를 하려했지만 기존에 설치해두었던 mysql 이미지가 mysql 버전과 호환되지 않았습니다 그래서 mysql 버전을 수정하였고 이미지를 latest 방식으로 재설치 해주었습니다 그 후 컨테이너와 이미지 볼륨을 언제 사용하는지 추가로 공부하였습니다

이미지 = 저장소 컨테이너 = 목적에 맞는 파일을 모아두는 곳 볼륨 = 컨테이너의 단점(쉽게 삭제가 되며, 그만큼 데이터베이스도 같이 날아간다.)을 방지하기 위해 도커 볼륨을 사용함

https://velog.io/@busybean3%EB%8F%84%EC%BB%A4-%EC%9D%B4%EB%AF%B8%EC%A7%80%EC%99%80-%EC%BB%A8%ED%85%8C%EC%9D%B4%EB%84%88-%EB%B3%BC%EB%A5%A8-%EC%9D%B4%EB%9E%80(도커 공부 자료)

오후
저희가 만들고있는 앱에 대한 아키텍처에 대해 발표하였습니다
제가 발표한 것은 프론트앤드 였는데 대체적으로 설명이 부족하였습니다. 어떤 기능이 구현되어있고 어떤 것들로 구성되어 있는지 설명을 하였습니다. 오늘 발표한 것에서 용상님의 피드백을 정리해보면
1.서로 어떤 식으로 통신이되었는지 설명을 하지 않았습니다
2.css같은 쓸데없는 설명들이 있었습니다.
3.일렬로 리스트화 해서 설명하는 것보다 아키텍쳐는 어느 순서로 동작하고, 어떤 식으로 통신되고 기능이 있는지 등등 이 프로젝트의 구조를 설명하는 것이 더 좋은 설명입니다.
4.데이터베이스에선 어떤 식으로 구성되어있는지 테이블만 설명할 것이 아니라 안에 들어있는 컬럼은 어떻게 구성되어있는지도 설명해준것이 좋습니다.
로 정리할 수 있습니다.

2번째로 저와 정원이가 서로 통신이 될 수 있게 설정하였습니다
문제는 총 3개 있었습니다
1.소켓 주소가 잘못되었다
-이것은 서버의 호스트주소나 IP 주소로 해결할 수 있는 문제라 주소를 서버의 IP 주소로 변경해주었습니다
2.url이 잘못되어 있었다 url은 서버의 주소로 설정이 되어있어야 했지만 api/resisters로 잘못 설정되어 있었습니다
3.서버에서 허용하지 않음

이 3가지 문제점이 있었고 2번까지 해결한 상황입니다 목표는 내일 아침에 3번 문제를 해결하고 다음 과제를 푸는것이 목표입니다

저희가 만들고있는 앱에 대한 아키텍처에 대해 발표하였습니다 그 후 저와 정원이가 서로 웹 소켓으로 통신이 될 수 있게 하였습니다 하지만 실패하였습니다

------------------------------------------------------------

#20240521

오전
정원이의 소켓과 제 소켓이 연결 될 수 있도록 해결하였습니다
문제점 1.정원이 서버에서 나의 라이브서버(127.0.0.1) 포트가 막혀있었다
문제점 2.로그에 CORS정책에 문제가 있다는 것을 발견하였고 CORS 정책 문제를 구글링하여 나온 방법 토대로 해결하였다

오후
HTMl문을 react로 변경하였습니다 문법 위주로 공부하였고 남는 시간에 리액트에 대해 더 찾아보며 공부하엿습니다(깃에 내용 업로드)

------------------------------------------------------------

#20240522

오전
아침에 리액트 서버를 구동하기위해 npm start를 했습니다. 하지만 css를 불러올 수 없다하여 이유를 보니 경로가 맞지 않아서 생긴 오류라 경로를 수정하였습니다. 그리고 메세지를 보내려고 전송버튼을 누르면 오류가 뜹니다. 오류의 원인은 웹 소켓 연결이 열려있지 않다는것이 문제였습니다.

오후
오후에는 오전에 정원이가 구현한 웹에서 파일 주고받기를 테스트하였습니다. 테스트 과정은
1.파일 선택을 하고 전송한다
2.f12를 눌러 콘솔에 뜬 url을 복사하여 채팅창에 보낸다
3.url을 클릭하여 다운받는다

하지만 제가 정원이에게 보내면 다운로드가 되어 finder에 저장이 되었지만 정원이가 저에게 보내는것은 저장이 되지 않는 것이 문제였습니다. 

그리고 url로 받은 사진을 렌더링하려고 어떻게 구현해야할지 공부하였습니다.

------------------------------------------------------------

#20240523

오전
아침에는 어제 react 공부하던것을 정리하였습니다. 아직 다 하지 못해서 이따 집가면서 추가적으로 자료 더 찾아보고 나머지는 내일 아침까지 정리할 계획입니다
https://thread-kick-1ea.notion.site/b3256783ff9d49feb12e5dabe1080f8d?pvs=4

오후
url을 받으면 화면에 바로 뜨게 하려는 코드를 작성하려고 했으나 npm 오류가 생겼서 먼저 해결하려 했습니다
오류 내용은 첫번째로 npm 스타트가 되지 않는 문제가 있었습니다 오류 발생 원인은 npm 버전과 node의 버전이 맞지 않으면서 생긴 문제였습니다. 검색해보니 호환성 문제도 있지만 node를 재설치 하는 것만으로도 해결이 된 사람들이 있다고 하여 재설치를 했더니 스타트는 디버그가 연결되자마자 끊기는 오류가 생겼습니다. 그것은 react-script를 지웠다가 다시 설치하면 문제가 해결된다하여 node_module파일과 package-lockjson파일 삭제 후 json 파일에서 react-script를 지워준 후 다시 설치하니 해결되었습니다. 하지만 이 과정에서 문제가 생겼는지 react 포트의 기본값인 3000번 포트가 아닌 3001번 포트로 실행되면서 사이트가 열리지 않는다던지 채팅이 보내지지 않는다는 문제가 생겼습니다. 포트 문제는 Node를 재설치하면서 생긴 오류일수도 있다 생각해서 내일 json 파일을 찾아보며 확인해보고 채팅을 보냈을때 보내지지 않는 것은 로그에 오류가 있다고 뜬 기록이 있어서 그걸 바탕으로 해결해볼 예정입니다

------------------------------------------------------------

#20240524

오전
오전에는 npm오류를 해결하였습니다
해결 방식으로는 npm 캐시를 지우는것을 택했습니다. 하지만 캐시 지우는것에서도 오류가 나 찾아보니 --force에서 문제가 발생했습니다. 저것을 붙이지 않으면 제 Npm 버전에서는 명령문이 실행되지 않기때문에 저것을 붙였어야 했습니다. 어쩔수 없이 구글링을 하던 중 verify라는 명령문을 알게 되었습니다. verify란 캐시를 싹 지우는 것이 아닌 데이터들을 수집하여 삭제하고 무결성을 확인하는 명령문입니다. 꼬인 부분을 체크하고 해결해주는 명령어라 캐시와 역할은 비슷하였습니다. 그렇게 npm cache verify를 실행해주니 오류가 해결되었습니다. 하지만 채팅 오류는 해결되지 않아 오후에 해결해볼 예정입니다.

오후
리액트 변환한 코드를 분석하였습니다. 이게 어떤 구조이고 어떤 것을 적어 둔 코드인건지 구글링하고 이해한 내용에 맞추어 주석에다 어떤 기능을 수행하는 코드인지 적었습니다(미완)

------------------------------------------------------------

#20240527

오전
리액트로 변환한 코드를 분석하였습니다.

오후
코드 분석하던 것 마무리하고 실행해보려 했으나 노드가 서포트 할 수 없다는 오류가 떳습니다. 이유는 노드 버전이 또 문제라고 합니다. 재설치하면 오류가 해결 됐었으나 오늘은 다운그레이드로 재다운해도 해결되지 않았습니다. 그래서 늘 하던대로 lock.json 파일과 modules파일을 삭제했다 재설치하여 오류를 해결해보려 했으나 실패하였습니다