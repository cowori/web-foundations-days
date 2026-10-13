# School Database Design

## Overview

This database stores students, courses and enrolments for a school. It uses three tables so that student details, course details and enrolment information can be managed separately without unnecessary duplication.

## Students table

The `students` table stores one row for each student.

Its fields are:

- `student_id`: The primary key that uniquely identifies a student.
- `first_name`: The student's first name.
- `last_name`: The student's last name.
- `email`: The student's email address.

The email field is required and unique. This prevents two student records from using the same email address.

## Courses table

The `courses` table stores one row for each course.

Its fields are:

- `course_id`: The primary key that uniquely identifies a course.
- `course_name`: The full name of the course.
- `course_code`: A short, unique code for the course.

The course name and course code are required. The course code is unique so that two courses cannot use the same code.

## Enrolments table

The `enrolments` table records which students are enrolled on which courses.

Its fields are:

- `enrolment_id`: The primary key for an enrolment.
- `student_id`: A foreign key referring to the student.
- `course_id`: A foreign key referring to the course.
- `grade`: The student's grade for that course.

The grade is allowed to be empty because a student may be enrolled before a grade has been awarded.

A unique constraint is placed on the combination of `student_id` and `course_id`. This prevents the same student from being enrolled on the same course more than once.

## Relationships

### Students to enrolments

The relationship between students and enrolments is one-to-many.

One student can have many enrolment records because the student can study several courses. Each individual enrolment record belongs to only one student.

### Courses to enrolments

The relationship between courses and enrolments is also one-to-many.

One course can have many enrolment records because many students can join the course. Each individual enrolment record refers to only one course.

### Students to courses

The overall relationship between students and courses is many-to-many.

A student can enrol on several courses, and a course can contain several students. A direct foreign key in only the students table or only the courses table would not represent this relationship correctly.

The `enrolments` table is therefore needed as a join table between students and courses. It stores one row for each student-course combination. It also stores information that belongs to that particular relationship, such as the student's grade for the course.

## Suggested index

I would add an index on `enrolments.course_id`:

```sql
CREATE INDEX idx_enrolments_course_id
ON enrolments(course_id);