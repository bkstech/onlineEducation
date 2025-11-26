# Teacher Management Features

This document describes the teacher management features implemented for the Online Education platform.

## Features Implemented

### 1. Course Management
Teachers can create and manage their courses with the following capabilities:
- Create new courses with name, description, start/end dates, and pricing
- View all courses they teach
- Update course information
- Soft delete courses (IsDeleted flag)

**API Endpoints:**
- `GET /api/Courses/teacher/{teacherId}` - Get all courses by teacher
- `POST /api/Courses?teacherId={id}` - Create a new course
- `PUT /api/Courses/{id}` - Update course
- `DELETE /api/Courses/{id}` - Delete course (soft delete)

### 2. Student Management
Teachers can view and manage their students:
- View all students enrolled in their courses
- See active vs inactive students
- Track enrollment dates and status
- Filter students by status

**API Endpoints:**
- `GET /api/Enrollments/teacher/{teacherId}/students` - Get all students taught by teacher
- `GET /api/Enrollments/teacher/{teacherId}/students?status=Active` - Filter by status
- `GET /api/Enrollments/course/{courseId}` - Get enrollments by course

### 3. Student Invitations
Teachers can invite students to join their courses:
- Send invitations via email
- Generate unique invite tokens
- Set expiry dates for invitations
- Track invitation status (Pending, Accepted, Expired)
- Students can accept invitations using invite tokens

**API Endpoints:**
- `POST /api/Invites?teacherId={id}` - Send invitations
- `GET /api/Invites/course/{courseId}` - Get invitations for a course
- `GET /api/Invites/teacher/{teacherId}` - Get all invitations sent by teacher
- `POST /api/Invites/accept/{token}?candidateId={id}` - Accept invitation

**Request Format:**
```json
{
  "courseId": 1,
  "candidateEmails": ["student1@example.com", "student2@example.com"]
}
```

### 4. Payment Tracking
Teachers can track payments from students:
- Create payment records for enrollments
- View pending and received payments
- Track payment amounts, due dates, and paid dates
- Filter payments by status
- Mark payments as paid with payment method and transaction ID

**API Endpoints:**
- `POST /api/Payments` - Create payment record
- `GET /api/Payments/teacher/{teacherId}` - Get all payments for teacher's courses
- `GET /api/Payments/teacher/{teacherId}?status=Pending` - Filter by status
- `GET /api/Payments/course/{courseId}` - Get payments by course
- `PUT /api/Payments/{id}/mark-paid` - Mark payment as paid

**Summary Response:**
```json
{
  "totalPayments": 10,
  "totalPending": 500.00,
  "totalReceived": 1500.00,
  "payments": [...]
}
```

### 5. Topics/Curriculum Management
Teachers can organize course content into topics:
- Create topics for courses
- Order topics with OrderIndex
- View topics by course
- Track which topics were taught to students
- Update and delete topics

**API Endpoints:**
- `POST /api/Topics` - Create topic
- `GET /api/Topics/course/{courseId}` - Get topics by course
- `GET /api/Topics/teacher/{teacherId}/student/{candidateId}` - Get topics taught to specific student
- `PUT /api/Topics/{id}` - Update topic
- `DELETE /api/Topics/{id}` - Delete topic (soft delete)

### 6. Student Performance Tracking
Teachers can track student progress and performance:
- Record progress for each topic
- Track completion status (Not Started, In Progress, Completed)
- Record scores for topics
- Add notes about student progress
- View overall performance metrics

**API Endpoints:**
- `POST /api/StudentProgress` - Create progress record
- `GET /api/StudentProgress/enrollment/{enrollmentId}` - Get progress by enrollment
- `GET /api/StudentProgress/teacher/{teacherId}/student/{candidateId}` - Get student performance
- `PUT /api/StudentProgress/{id}` - Update progress

**Performance Summary Response:**
```json
{
  "totalTopics": 20,
  "completedTopics": 15,
  "inProgressTopics": 3,
  "averageScore": 85.5,
  "performance": [...]
}
```

## Database Schema

The following tables are used for teacher management features:

### courses
- Stores course information
- Links to teacher via TeacherId
- Tracks course status and soft deletes

### enrollments
- Links students (candidates) to courses
- Tracks enrollment status and dates
- Unique constraint on (CourseId, CandidateId)

### payments
- Tracks payment information for enrollments
- Links to course, enrollment, and candidate
- Stores payment status, amounts, and dates

### topics
- Stores course curriculum/topics
- Ordered by OrderIndex
- Links to courses

### student_progress
- Tracks student progress on topics
- Stores status, scores, and completion dates
- Links to enrollment, candidate, and topic

### course_invites
- Stores course invitations sent to students
- Tracks invitation status and tokens
- Links to course, teacher, and candidate (optional)

## Frontend Dashboard

The teacher dashboard (`/teacher-dashboard`) provides:

### Overview Tab
- Total courses count
- Active students count
- Total received payments
- Pending payments amount

### Students Tab
- List of all students with their course enrollments
- Student details (name, email, course)
- Enrollment dates and status
- Active/Inactive indicators

### Payments Tab
- List of all payments
- Student and course information
- Payment amounts, due dates, paid dates
- Status indicators (Pending/Paid)
- Summary of total received and pending amounts

### Courses Tab
- Grid view of all courses
- Course details (name, description, dates, price)
- Course status
- Create new course button

## Setup Instructions

### 1. Database Setup
Run the migration script to create the necessary tables:
```bash
mysql -u root -p estudydb < database/migration_teacher_management.sql
```

### 2. Backend Setup
The API is already configured. Just build and run:
```bash
cd api/API
dotnet build
dotnet run --urls "https://localhost:5000"
```

### 3. Frontend Setup
```bash
npm install
npm run dev
```

### 4. Access Teacher Dashboard
1. Register or login as a teacher
2. Navigate to `/teacher-dashboard`
3. The dashboard will load your courses, students, and payment information

## Authentication

Teachers must be logged in with role "teacher" to access:
- Teacher dashboard
- Teacher-specific API endpoints

The authentication is handled by:
- JWT tokens stored in httpOnly cookies (backend)
- User info in localStorage (frontend)
- Role-based access control

## Usage Examples

### Create a Course
```bash
curl -X POST https://localhost:5000/api/Courses?teacherId=1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Introduction to Programming",
    "description": "Learn the basics of programming",
    "startDate": "2024-01-01T00:00:00Z",
    "price": 99.99
  }'
```

### Send Course Invitations
```bash
curl -X POST https://localhost:5000/api/Invites?teacherId=1 \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": 1,
    "candidateEmails": ["student@example.com"]
  }'
```

### Track Payment
```bash
curl -X POST https://localhost:5000/api/Payments \
  -H "Content-Type: application/json" \
  -d '{
    "enrollmentId": 1,
    "amount": 99.99,
    "dueDate": "2024-02-01T00:00:00Z"
  }'
```

## Future Enhancements

Potential improvements:
- Email notification service for invitations
- Bulk payment import/export
- Advanced analytics and reporting
- Student progress charts and visualizations
- Course templates and duplication
- Discussion forums per course
- Assignment and quiz management
