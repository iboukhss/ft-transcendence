```mermaid
erDiagram
    USERS {
        serial id PK
        text email UK
        text password
        accountTypeEnum account_type
        roleEnum role
        timestamp created_at
        timestamp updated_at
    }

    FREELANCER_PROFILES {
        serial id PK
        integer user_id FK, UK
        text first_name
        text last_name
        countryEnum country
        text avatar
        text bio
        text_array skills
        languageEnum_array languages
        real hourly_rate
        timestamp created_at
        timestamp updated_at
    }

    COMPANY_PROFILES {
        serial id PK
        integer user_id FK, UK
        text contact_first_name
        text contact_last_name
        text company_name
        countryEnum country
        text logo
        text description
        timestamp created_at
        timestamp updated_at
    }

    JOBS {
        serial id PK
        integer user_id FK
        text title
        text description
        categoryEnum category
        text_array skills
        real hourly_rate
        integer duration
        workPlaceEnum workplace
        countryEnum location
        jobStatusEnum status
        timestamp created_at
        timestamp updated_at
    }

    OFFERS {
        serial id PK
        integer job_id FK "UK: job_id + seller_id"
        integer buyer_id FK
        integer seller_id FK "UK: job_id + seller_id"
        offerStatusEnum status
        text motivation_letter
        real proposed_hourly_rate
        timestamp created_at
        timestamp updated_at
    }

    BOOKINGS {
        serial id PK
        integer offer_id FK, UK
        integer job_id FK
        integer buyer_id FK
        integer seller_id FK
        real price
        real hourly_rate
        integer duration
        bookingStatusEnum status
        timestamp created_at
        timestamp updated_at
    }

    API_KEYS {
        serial id PK
        integer user_id FK
        text key UK
        text name
        boolean is_active
        timestamp last_used_at
        timestamp expires_at
        timestamp created_at
        timestamp updated_at
    }

    USERS ||--|| FREELANCER_PROFILES : "has profile"
    USERS ||--|| COMPANY_PROFILES : "has profile"
    USERS ||--o{ JOBS : "creates"
    USERS ||--o{ API_KEYS : "owns"
    
    JOBS ||--o{ OFFERS : "receives"
    USERS ||--o{ OFFERS : "buys (buyer_id)"
    USERS ||--o{ OFFERS : "sells (seller_id)"
    
    OFFERS ||--|| BOOKINGS : "turns into"
    JOBS ||--o{ BOOKINGS : "references"
    USERS ||--o{ BOOKINGS : "pays (buyer_id)"
    USERS ||--o{ BOOKINGS : "works (seller_id)"
```
