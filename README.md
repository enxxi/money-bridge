<div align="center">
</div>

# 예산 관리 어플리케이션 : money bridge

<br/>

## 개요

**개인 재무를 관리하고 지출을 추적하는 애플리케이션으로, 예산 설정과 지출 모니터링을 통해 재무 목표를 달성하는 데 도움을 줍니다.**
본 서비스는 개인 재무 관리 및 지출 추적을 위한 애플리케이션입니다.
이 앱은 사용자들이 예산을 설정하고 지출을 모니터링하여 재무 목표를 달성하는 데 도움을 줍니다. 사용자들은 이 앱을 통해 개인 재무 상황을 효과적으로 관리할 수 있으며, 지출 패턴을 파악하여 지출을 조절하고 저축을 증진할 수 있습니다.
또한, 이 앱은 사용자들에게 재무 목표 설정과 관련된 조언과 안내도 제공합니다. 이를 통해 개인 재무 상황을 개선하고 더 나은 재무 목표를 세울 수 있습니다.
<br/>

## Skils

<div align="center">

언어 및 사용 도구 <br/> ![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens) ![Swagger](https://img.shields.io/badge/swagger-%ffffff.svg?style=for-the-badge&logo=swagger&logoColor=white)
<br/>
데이터 베이스 <br/>![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) 

</div>

<br/>

## Directory

<details>
<summary> 파일 구조 보기 </summary>

```
src
│  app.module.ts
│  main.ts
│
├─auth
│  │  auth.controller.spec.ts
│  │  auth.controller.ts
│  │  auth.module.ts
│  │  auth.service.spec.ts
│  │  auth.service.ts
│  │  get-user.decorator.ts
│  │  jwt-refresh.strategy.ts
│  │  jwt.strategy.ts
│  │
│  ├─dto
│  │      authDto.ts
│  │
│  └─entities
│          auth.entity.ts
│
├─budget
│  │  budget.controller.ts
│  │  budget.module.ts
│  │  budget.repository.ts
│  │  budget.service.ts
│  │
│  ├─dto
│  │      budgetDto.ts
│  │
│  └─entities
│          budget.entity.ts
│
├─category
│  │  category.controller.ts
│  │  category.module.ts
│  │  category.service.ts
│  │
│  ├─entities
│  │      category.entity.ts
│  │
│  └─types
│          category.enum.ts
│
├─common
│  └─decorator
│          typeorm-ex.decorator.ts
│          typeorm-ex.module.ts
│
├─config
│      typeorm.config.ts
│
├─expenses
│  │  expenses.controller.ts
│  │  expenses.module.ts
│  │  expenses.repository.ts
│  │  expenses.service.ts
│  │  statistics.service.ts
│  │
│  ├─dto
│  │      expensesDto.ts
│  │
│  └─entities
│          expenses.entity.ts
│
└─user
    │  user.controller.spec.ts
    │  user.controller.ts
    │  user.module.ts
    │  user.repository.ts
    │  user.service.spec.ts
    │  user.service.ts
    │
    └─entities
            refresh.entity.ts
            user.entity.ts
```

</details>
</br>

