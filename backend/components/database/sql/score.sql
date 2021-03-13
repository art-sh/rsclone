create table score
(
    id      int auto_increment,
    game_id varchar(255) not null,
    user_id int          not null,
    score   int          not null,
    constraint `pk:score.id`
        primary key (id),
    constraint `fk:score.user_id-users.id`
        foreign key (user_id) references users (id)
            on update cascade on delete cascade
);

create index `idx:score.game_id-user_id`
    on score (game_id, user_id);
