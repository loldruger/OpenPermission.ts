# OpenPermission.ts - Discord 역할 관리 봇

디스코드 유저에게 역할을 부여하거나 제거할 수 있는 봇입니다.

## 기능

- `/addrole` - 유저에게 역할 부여
- `/removerole` - 유저의 역할 제거

## 설치 방법

1. 의존성 설치:
```bash
npm install
```

2. `.env` 파일 생성:
```bash
cp .env.example .env
```

3. `.env` 파일에 봇 정보 입력:
```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here
```

## Discord Bot 설정

1. [Discord Developer Portal](https://discord.com/developers/applications)에 접속
2. "New Application" 클릭하여 새 애플리케이션 생성
3. "Bot" 탭에서 봇 생성
4. "TOKEN" 복사 → `.env`의 `DISCORD_TOKEN`에 입력
5. "OAuth2" → "General"에서 `CLIENT_ID` 복사 → `.env`에 입력
6. "OAuth2" → "URL Generator"에서:
   - Scopes: `bot`, `applications.commands` 선택
   - Bot Permissions: `Manage Roles` 선택
   - 생성된 URL로 봇을 서버에 초대

7. 서버 ID 가져오기:
   - Discord 설정에서 "고급" → "개발자 모드" 활성화
   - 서버 우클릭 → "ID 복사" → `.env`의 `GUILD_ID`에 입력

## 실행 방법

### 개발 모드
```bash
npm run dev
```

### 프로덕션
```bash
npm run build
npm start
```

## 사용 방법

1. `/addrole @유저 @역할` - 유저에게 역할 부여
2. `/removerole @유저 @역할` - 유저의 역할 제거

## 필요 권한

- 봇 실행자: "역할 관리" 권한 필요
- 봇: "역할 관리" 권한 필요 (관리하려는 역할보다 높은 위치에 있어야 함)

## 주의사항

- 봇의 역할이 관리하려는 역할보다 위에 있어야 합니다
- 서버 소유자의 역할은 관리할 수 없습니다
