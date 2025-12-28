# Candidate Invitation Feature

## Overview
This feature allows teachers to send invitations to candidates by email. The invitations are stored in a new `InvitedCandidate` table.

## Database Migration
Before using this feature, you need to create the `invitedcandidate` table in your database.

Run the migration script located at:
```
api/API/Migrations/001_Create_InvitedCandidate_Table.sql
```

You can run it using MySQL CLI:
```bash
mysql -u root -p estudydb < api/API/Migrations/001_Create_InvitedCandidate_Table.sql
```

## API Endpoint

### POST `/api/teachercandidates/addcandidateemails`

This endpoint allows teachers to invite candidates by email.

**Request Body:**
```json
{
  "teacherId": 1,
  "emails": [
    "candidate1@example.com",
    "candidate2@example.com"
  ]
}
```

**Success Response:**
```json
{
  "message": "Candidate emails invited successfully."
}
```

**Error Response (if emails array is empty):**
```json
{
  "message": "Emails array is required."
}
```

## Frontend Integration

When the teacher clicks on "Send Invitations" button on `/teacher/invite` page, the frontend should call this API endpoint with the list of email addresses.

Example using fetch:
```javascript
const response = await fetch('http://localhost:5000/api/teachercandidates/addcandidateemails', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    teacherId: 1, // Get from logged-in teacher's session
    emails: ['candidate1@example.com', 'candidate2@example.com']
  })
});

const result = await response.json();
console.log(result.message);
```

## Database Schema

The `invitedcandidate` table has the following structure:

| Column | Type | Description |
|--------|------|-------------|
| Id | int (Primary Key) | Auto-incrementing ID |
| TeacherId | int (nullable) | ID of the teacher who sent the invitation |
| Email | varchar(255) | Email address of the invited candidate |
| CreatedAt | datetime | Timestamp when the invitation was created |

## Notes

- The emails are stored as-is without validation in the database. Consider adding email format validation in the future.
- The feature does not send actual email invitations; it only stores the invitation records.
- To implement actual email sending, you would need to integrate an email service provider.
