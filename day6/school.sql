-- Enable foreign-key enforcement in SQLite.
PRAGMA foreign_keys = ON;

-- Drop the tables in dependency order so the script can be run again.
DROP TABLE IF EXISTS enrolments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS students;

-- ==================================================
-- CREATE TABLES
-- ==================================================

CREATE TABLE students (
    student_id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

CREATE TABLE courses (
    course_id INTEGER PRIMARY KEY,
    course_name TEXT NOT NULL,
    course_code TEXT NOT NULL UNIQUE
);

CREATE TABLE enrolments (
    enrolment_id INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,

    FOREIGN KEY (student_id)
        REFERENCES students(student_id),

    FOREIGN KEY (course_id)
        REFERENCES courses(course_id),

    UNIQUE (student_id, course_id)
);

-- ==================================================
-- INSERT SAMPLE DATA
-- ==================================================

INSERT INTO students (
    student_id,
    first_name,
    last_name,
    email
)
VALUES
    (
        1,
        'Amina',
        'Kamau',
        'amina.kamau@example.com'
    ),
    (
        2,
        'Brian',
        'Otieno',
        'brian.otieno@example.com'
    ),
    (
        3,
        'Chloe',
        'Wanjiku',
        'chloe.wanjiku@example.com'
    ),
    (
        4,
        'David',
        'Mwangi',
        'david.mwangi@example.com'
    );

INSERT INTO courses (
    course_id,
    course_name,
    course_code
)
VALUES
    (
        1,
        'Web Foundations',
        'WEB101'
    ),
    (
        2,
        'Database Basics',
        'DB101'
    ),
    (
        3,
        'JavaScript Essentials',
        'JS101'
    );

INSERT INTO enrolments (
    enrolment_id,
    student_id,
    course_id,
    grade
)
VALUES
    (1, 1, 1, 'A'),
    (2, 1, 2, 'B+'),
    (3, 2, 1, 'B'),
    (4, 2, 3, 'A-'),
    (5, 3, 2, 'B');

-- ==================================================
-- QUERY 1
-- All courses for one student, found by name.
-- ==================================================

SELECT
    s.first_name || ' ' || s.last_name AS student_name,
    c.course_code,
    c.course_name,
    e.grade
FROM students AS s
JOIN enrolments AS e
    ON e.student_id = s.student_id
JOIN courses AS c
    ON c.course_id = e.course_id
WHERE
    s.first_name = 'Amina'
    AND s.last_name = 'Kamau'
ORDER BY c.course_name;

-- ==================================================
-- QUERY 2
-- All students enrolled on one course.
-- ==================================================

SELECT
    c.course_name,
    s.student_id,
    s.first_name,
    s.last_name,
    s.email,
    e.grade
FROM courses AS c
JOIN enrolments AS e
    ON e.course_id = c.course_id
JOIN students AS s
    ON s.student_id = e.student_id
WHERE c.course_name = 'Web Foundations'
ORDER BY
    s.last_name,
    s.first_name;

-- ==================================================
-- QUERY 3
-- Number of students per course.
-- LEFT JOIN includes courses with no students.
-- ==================================================

SELECT
    c.course_id,
    c.course_code,
    c.course_name,
    COUNT(e.student_id) AS student_count
FROM courses AS c
LEFT JOIN enrolments AS e
    ON e.course_id = c.course_id
GROUP BY
    c.course_id,
    c.course_code,
    c.course_name
ORDER BY c.course_name;

-- ==================================================
-- QUERY 4
-- Students who have no enrolments.
-- ==================================================

SELECT
    s.student_id,
    s.first_name,
    s.last_name,
    s.email
FROM students AS s
LEFT JOIN enrolments AS e
    ON e.student_id = s.student_id
WHERE e.enrolment_id IS NULL
ORDER BY
    s.last_name,
    s.first_name;

-- ==================================================
-- QUERY 5
-- Update one enrolment's grade.
-- ==================================================

UPDATE enrolments
SET grade = 'A-'
WHERE
    student_id = 1
    AND course_id = 2;

-- Verify that the grade was updated.
SELECT
    enrolment_id,
    student_id,
    course_id,
    grade
FROM enrolments
WHERE
    student_id = 1
    AND course_id = 2;