The current Database Model Is as Follows

-Table users 
    - id number primary key
    - username string not null
    - pwd_hash string not null

-Table topic
    - id number primary key
    - user_id number foreign key not null
    - title string not null
    - description string

-Table cards
    - id number primary key
    - topic_id number foreign key not null
    - question string not null
    - answer string not null