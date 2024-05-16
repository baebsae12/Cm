#20240516 오늘 한 것
오늘은 데이터베이스 구성을 하고 express와 연결하려 했습니다 결과는 DB쿼리문은 문제없이 잘 작성되었습니다
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nickname VARCHAR(255) NOT NULL
);

그리고 익스프레스와 연결하는 과정에서 문제가 생겼습니다
첫번째 오류 연결은 되지만 호스트를 찾을 수 없었습니다 이게 무슨 소리냐면 DB에 접속을 성공한 후 입력된 호스트 주소에 접속을 해야하는데 호스트 주소를 찾을 수 없다는 뜻 입니다. 이것으로 해결 방법을 찾아본 결과 로컬호스트에 연결하면 된다고 하여서 로컬호스트로 변경해보았지만 오류가 해결되지 않았습니다

두번째 오류는 호스트 이름을 IP주소로 변환하는 과정에서 생긴 오류였습니다 그래서 앞에 문제와 연결되는 오류라 생각하여 호스트 이름을 해결한 후에 시도를 다시 해보아야 한다 생각되어 앞선 문제를 해결하다 실패하여 이것도 해결하지 못했습니다.
