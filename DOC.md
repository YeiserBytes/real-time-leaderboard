# Real-Time Leaderboard API Documentation

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Users

#### Register a new user

-**POST** `/api/register` -**Body:**

```json
{
	"username": "string",
	"password": "string" // minimum 6 characters
}
```

-**Response:**

```json
{
	"message": "User registered successfully",
	"id": "number",
	"username": "string",
	"token": "string"
}
```

#### Login

-**POST** `/api/login` -**Body:**

```json
{
	"username": "string",
	"password": "string"
}
```

-**Response:**

```json
{
	"id": "number",
	"username": "string",
	"token": "string"
}
```

#### Get All Users

-**GET** `/api/users`

-**Protected:** Yes

-**Response:** Array of users without passwords

#### Delete User

-**DELETE** `/api/user/:userId`

-**Protected:** Yes

-**Params:** userId (number)

-**Response:**

```json
{
	"message": "User deleted successfully"
}
```

### Games

#### Submit New Game

-**POST** `/api/game`

-**Protected:** Yes

-**Body:**

```json
{
	"name": "string",

	"description": "string"
}
```

-**Response:**

```json
{
	"message": "Game submitted successfully"
}
```

#### Get All Games

-**GET** `/api/games`

-**Protected:** Yes

-**Response:** Array of games

### Leaderboard

#### Submit Score

-**POST** `/api/score`

-**Protected:** Yes

-**Body:**

```json
{
	"gameId": "string",

	"score": "number"
}
```

-**Response:**

```json
{
	"message": "Score submitted successfully"
}
```

#### Get Leaderboard

-**GET** `/api/leaderboard/:gameId`

-**Protected:** Yes

-**Params:** gameId (string)

-**Response:**

```json
[
	{
		"username": "string",

		"score": "number",

		"rank": "number"
	}
]
```

#### Get User Rank

-**GET** `/api/rank/:gameId`

-**Protected:** Yes

-**Params:**

-   gameId (string)
-   days (query parameter, optional, default: 7)

-**Response:** Array of top scores with ranks

#### Get Top Players Report

-**GET** `/api/reports/top-players`

-**Protected:** Yes

-**Query Parameters:**

-   days (optional, default: 7)
-   gameId (required)

-**Response:**

```json
[
	{
		"username": "string",

		"score": "number",

		"date": "string"
	}
]
```

## Error Responses

All endpoints may return the following error responses:

-**400** Bad Request

-**401** Unauthorized

-**404** Not Found

-**500** Internal Server Error

Example error response:

```json
{
	"message": "Error message description"
}
```
