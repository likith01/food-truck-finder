# Food Truck Finder

A full-stack Food Truck Finder application that allows users to search food trucks, discover nearby trucks using their current location, filter results by distance, and view trucks interactively on a map.

## Features

- Search food trucks by name / food information
- Browser-based current location detection
- Radius-based nearby search
- Paginated food truck results with Load More
- Interactive Leaflet map
- Food truck markers and popups
- List-to-map navigation
- Loading, empty, and error states
- REST API built with FastAPI
- External DataSF API integration using async HTTP calls
- Unit-testable service and client layers
- Environment-based configuration

---

## Architecture

The application follows a layered architecture. The frontend communicates only with the FastAPI backend, while the backend is responsible for communicating with the external DataSF API.

```text
┌──────────────────────────────────────────────────────────────┐
│                         Angular UI                           │
│                                                              │
│  Search  │  Location  │  Radius  │  Food Truck List  │ Map   │
└─────────────────────────────┬────────────────────────────────┘
                              │
                              │ HTTP / REST
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                        FastAPI API                           │
│                                                              │
│                     API / Router Layer                       │
│          /api/v1/food-trucks                                 │
└─────────────────────────────┬────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Service Layer                         │
│                                                             │
│                  FoodTruckService                           │
│                                                             │
│  Validation │ Business Logic │ Pagination │ Filtering       │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     External API Client                     │
│                                                             │
│                    DataSFClient                             │
│                     httpx.AsyncClient                       │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     San Francisco DataSF                    │
│                    Food Truck Dataset                       │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow

```text
User Action
    │
    ▼
Angular Component
    │
    ▼
Angular FoodTruckService
    │
    │ HTTP
    ▼
FastAPI Router
    │
    ▼
FoodTruckService
    │
    ▼
DataSFClient
    │
    │ Async HTTP
    ▼
DataSF API
    │
    ▼
Response
    │
    ▼
Angular
    │
    ├── Food Truck List
    └── Leaflet Map
```

## Technology Stack

### Frontend
- Angular
- TypeScript
- HttpClient
- Leaflet
- RxJS
- HTML / CSS

### Backend
- Python
- FastAPI
- Pydantic
- httpx
- Uvicorn

### External Service
- San Francisco DataSF Food Truck API

## Project Structure

```text
food-truck-finder/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── __init__.py
│   │   │       ├── food_trucks.py
│   │   │       └── health.py
│   │   │
│   │   ├── clients/
│   │   │   ├── __init__.py
│   │   │   └── datasf_client.py
│   │   │
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py
│   │   │   └── logging.py
│   │   │
│   │   ├── schemas/
│   │   │
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── food_truck_service.py
│   │   │   └── geo_service.py
│   │   │
│   │   ├── __init__.py
│   │   ├── dependencies.py
│   │   └── main.py
│   │
│   ├── .env.example
│   └── requirements.txt
│
├── frontend/
│   ├── .angular/
│   ├── .vscode/
│   ├── public/
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   └── app/
│   │       ├── core/
│   │       │   ├── models/
│   │       │   └── services/
│   │       │
│   │       ├── features/
│   │       │   └── food-trucks/
│   │       │       ├── food-truck-card/
│   │       │       ├── food-truck-list/
│   │       │       ├── food-truck-map/
│   │       │       ├── food-truck-page/
│   │       │       └── food-truck-search/
│   │       │
│   │       ├── app.config.ts
│   │       ├── app.css
│   │       ├── app.html
│   │       ├── app.routes.ts
│   │       ├── app.spec.ts
│   │       ├── app.ts
│   │       ├── index.html
│   │       ├── main.ts
│   │       ├── material-theme.scss
│   │       └── styles.css
│   │
│   ├── .editorconfig
│   ├── .gitignore
│   ├── .prettierrc
│   ├── angular.json
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   └── tsconfig.spec.json
│
├── README.md
└── .gitignore
```

## Backend Design

The backend separates responsibilities into three main layers.

### API / Router Layer

Responsible for:

- HTTP endpoints
- Query parameters
- Request validation
- HTTP response handling

Example:

```
GET /api/v1/food-trucks
```

Supported parameters:

- search
- latitude
- longitude
- radius
- limit
- offset

### Service Layer

Responsible for application/business logic.

`FoodTruckService` and `GeoService`

The service layer does not directly manage HTTP communication with DataSF.

### Client Layer

Responsible for communication with the external DataSF API.

```text
DataSFClient
       │
       └── httpx.AsyncClient
```

This separation makes the external API easy to mock during testing.

## API

### Get Food Trucks

```
GET /api/v1/food-trucks
```

#### Query Parameters

| Parameter | Type    | Description             |
|-----------|---------|--------------------------|
| search    | string  | Search food trucks       |
| latitude  | float   | User latitude            |
| longitude | float   | User longitude           |
| radius    | float   | Search radius in km      |
| limit     | integer | Number of records        |
| offset    | integer | Pagination offset        |

#### Example

```
GET /api/v1/food-trucks?search=taco&limit=50&offset=0
```

Nearby search:

```
GET /api/v1/food-trucks?latitude=37.7749&longitude=-122.4194&radius=5&limit=50&offset=0
```

## Location-Based Search

The browser provides the user's coordinates through the Geolocation API.

```text
Browser
   │
   │ latitude / longitude
   ▼
Angular
   │
   │ latitude + longitude + radius
   ▼
FastAPI
   │
   ▼
DataSF
```

The selected radius is sent as part of the API request.

Example:

```
latitude=37.7749
longitude=-122.4194
radius=5
```

## Pagination

The application uses offset-based pagination.

```text
First request

limit=50
offset=0

        ↓

Next request

limit=50
offset=50

        ↓

Next request

limit=50
offset=100
```

The frontend appends newly retrieved trucks to the existing list instead of replacing the previous results.

## Map

Leaflet is used for map rendering.

Each valid food truck coordinate is represented as a marker.

```text
FoodTruck
    │
    ├── latitude
    └── longitude
          │
          ▼
     Leaflet Marker
          │
          ▼
       Popup
```

Selecting **View on Map** moves the map to the selected truck and opens its popup.

## Environment Configuration

Environment-specific values should not be hardcoded in application services.

### Backend

Example:

```
DATASF_API_URL=https://data.sfgov.org/resource/...
```

### Frontend

Example:

```ts
export const environment = {
  apiBaseUrl: 'http://localhost:8000/api/v1',
};
```

This allows development, testing, and production environments to use different configuration values without changing application logic.

> **Note:** This section describes the target configuration approach. It should only be treated as implemented once the corresponding config files actually exist in the repository.

## Error Handling

Errors are handled at different application boundaries.

```text
External API Failure
        │
        ▼
DataSFClient
        │
        ▼
Service Layer
        │
        ▼
FastAPI Error Response
        │
        ▼
Angular Error State
```

The UI provides appropriate states for:

- API failure
- Empty search results
- Location permission denied
- Location unavailable
- Location timeout
- Loading state

External API errors are not exposed directly to the user.

## Logging

The backend uses application logging for operational visibility.

Important events include:

- Incoming food truck requests
- External API calls
- External API failures
- Validation failures
- Unexpected exceptions

Logging is preferred over `print()` because it supports log levels and production monitoring.

Example levels:

- INFO
- WARNING
- ERROR

> **Note:** This describes the intended logging approach. It should only be treated as implemented once logging is actually wired into the codebase.

## Testing

The project uses unit tests to verify application behavior without depending on the real external API.

### Backend

Important test cases include:

- Successful food truck retrieval
- Search filtering
- Pagination
- Radius filtering
- Invalid parameters
- External API failure
- Service/client behavior

External API calls should be mocked in unit tests.

```text
Test
 │
 ▼
FoodTruckService
 │
 ▼
Mock DataSFClient
```

This keeps tests:

- Fast
- Deterministic
- Independent of network availability

> **Note:** This describes the intended test coverage. It should only be treated as implemented once these tests actually exist and pass in the repository.

### Running Tests

```
pytest
```

## Running the Backend

Navigate to the backend:

```
cd backend
```

Create and activate a virtual environment:

```
python -m venv .venv
```

Windows:

```
.venv\Scripts\activate
```

Linux / macOS:

```
source .venv/bin/activate
```

Install dependencies:

```
pip install -r requirements.txt
```

Start the server:

```
uvicorn app.main:app --reload
```

Backend:

```
http://localhost:8000
```

Swagger:

```
http://localhost:8000/docs
```

## Running the Frontend

Navigate to the frontend:

```
cd frontend
```

Install dependencies:

```
npm install
```

Start Angular:

```
ng serve
```

Application:

```
http://localhost:4200
```

## Development Flow

```text
1. Start FastAPI
        ↓
2. Start Angular
        ↓
3. Angular calls FastAPI
        ↓
4. FastAPI calls DataSF
        ↓
5. DataSF response mapped to application model
        ↓
6. Angular displays list + map
```

## Design Decisions

### Why a separate DataSF client?

The external API integration is isolated from business logic.

Benefits:

- Easier testing
- Easier mocking
- Easier API replacement
- Clear separation of responsibilities

### Why async HTTP?

The backend uses `httpx.AsyncClient` so external network calls do not unnecessarily block the FastAPI event loop.

### Why pagination?

The external dataset can contain many records. Pagination prevents loading an unnecessarily large dataset into the frontend at once.

### Why radius filtering?

Location search should return relevant nearby food trucks rather than the entire dataset.

### Why Leaflet?

Leaflet provides lightweight interactive maps and marker/popup functionality without requiring a proprietary map SDK.

## Code Quality

The project follows these principles:

- Separation of concerns
- Dependency injection
- Typed interfaces/models
- Reusable services
- Small focused components
- Centralized external API communication
- Explicit error handling
- Environment-based configuration

## Future Improvements

Possible production improvements include:

- Caching frequently requested locations
- Redis-based caching
- Rate limiting
- Authentication/Authorization if required
- Automated CI/CD
- Production monitoring
- Distributed tracing
- More comprehensive frontend tests
- Database persistence if application-owned data is introduced

## Demo Flow

The application can be demonstrated using the following flow:

```text
Open Application
       ↓
View Food Trucks + Map
       ↓
Search Food Trucks
       ↓
Load More Results
       ↓
Use My Location
       ↓
Select Search Radius
       ↓
View Nearby Trucks
       ↓
Click "View on Map"
       ↓
Map Moves to Selected Truck
       ↓
Truck Popup Opens
```

## Summary

Food Truck Finder is structured as a layered full-stack application:

```text
Angular
   ↓
FastAPI
   ↓
Service Layer
   ↓
DataSF Client
   ↓
DataSF API
```

The architecture keeps UI logic, business logic, and external API communication separated, making the application easier to test, maintain, and extend.

---

## Author

**Likith S**

- 📧 Email: [likiths2501@gmail.com](mailto:likiths2501@gmail.com)
- 📱 Phone: +91 97417 52107
- 💻 GitHub: [github.com/likith01](https://github.com/likith01)
- 💼 LinkedIn: [linkedin.com/in/likith-s-452315226](https://www.linkedin.com/in/likith-s-452315226/)

## Acknowledgements

This project was built with the assistance of **ChatGPT**, which helped with design discussions, code structuring, and documentation.

---

### Next Steps

Before merging this README, make sure the implementation actually matches it — in particular:


1. **Authentication** — Adding a Auth layer for the user authentication.
2. **Auorization** — Adding a Authorization for user and handle permission.
3. **Tests** — add the backend unit tests described above (I dont have experience in writing the tests)
