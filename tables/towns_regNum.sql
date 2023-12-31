CREATE TABLE towns (
	id SERIAL NOT NULL PRIMARY KEY,
    towns_name TEXT NOT NULL,
    start_town TEXT NOT NULL
);
CREATE TABLE registration (
	id SERIAL NOT NULL PRIMARY KEY,
	registration_number TEXT NOT NULL,
	towns_id INT NOT NULL,
	foreign key (towns_id) references towns(id) ON DELETE CASCADE
);