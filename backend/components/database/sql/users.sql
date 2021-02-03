create table users
(
    id          int auto_increment,
    login       varchar(255) not null,
    name        varchar(255) null,
    password    varchar(255) not null,
    date_create int          not null,
    constraint users_id_primary
        primary key (id)
);

create
unique index idx:users.login
	on users (login);
