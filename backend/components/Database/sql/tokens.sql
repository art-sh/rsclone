create table tokens
(
    id      int auto_increment,
    token   varchar(255) not null,
    expiry  int          not null,
    user_id int          not null,
    constraint `pk:tokens.id`
        primary key (id),
    constraint `fk:tokens.user_id-users.id`
        foreign key (user_id) references users (id)
            on update cascade on delete cascade
);

create index `idx:tokens.token`
    on tokens (token);
