USE yaphub;

DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS follows;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  user_id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(150) NOT NULL,
  last_name VARCHAR(150) NOT NULL,
  nickname VARCHAR(100) NOT NULL,
  email VARCHAR(300) NOT NULL,
  password VARCHAR(250) NOT NULL,
  PRIMARY KEY (user_id),
  UNIQUE (nickname),
  UNIQUE (email)
);


CREATE TABLE follows (
  follow_id INT NOT NULL AUTO_INCREMENT,
  follower_id INT NOT NULL,
  following_id INT NOT NULL,
  PRIMARY KEY (follow_id),
  UNIQUE (follower_id, following_id),
  FOREIGN KEY (follower_id) REFERENCES users(user_id),
  FOREIGN KEY (following_id) REFERENCES users(user_id)
);


CREATE TABLE posts (
  post_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  content VARCHAR(1000) NOT NULL,
  created_at DATE NOT NULL,
  expires_at DATE NOT NULL,
  PRIMARY KEY (post_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);


SHOW TABLES;