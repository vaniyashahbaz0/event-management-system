# Event Manager

A React single-page app for discovering events from the Ticketmaster Discovery API and registering for them. Users can sign up, browse and filter real events, view details, register or cancel, and track their registrations in a **My Events** page that separates upcoming from completed events.

## Features

| Area | What it does |
| --- | --- |
| **Auth** | Register, log in and log out (frontend simulation, see notes below). Session survives a page refresh. Protected routes redirect to `/login` and return you afterwards. Inline form validation. |
| **Events** | Keyword search, category chips, city and date-range filters, "upcoming only" toggle, pagination. Filters live in the URL so results are shareable. Loading skeletons, empty and error states with Retry. |
| **Event details** | Image, date/time, venue, address, category, price range, info, status badge and a link to the official Ticketmaster page. |
| **Registration** | Register for an event, see a "You're registered" badge, cancel with a confirm step. Duplicates are rejected by the reducer itself. Registration is disabled for past, cancelled or off-sale events. Toast feedback (accessible, auto-dismissing). A "Registered" badge shows on event cards. |
| **My Events** | Your registrations split into **Upcoming** (soonest first, with Cancel) and **Completed** (most recent first, no Cancel). Count badge in the navbar and a friendly empty state. |

Registrations are stored per user, so one user never sees another user's registrations on the same browser.

## Tech stack

- React 19, React Router 7
- Redux Toolkit + React Redux (slices, async thunks, listener middleware)
- Vite 8
- Oxlint
- Plain CSS (no UI framework)

## Getting a Ticketmaster API key

1. Create a free account at <https://developer.ticketmaster.com/>.
2. Open **My Apps** and create an app (or use the default one).
3. Copy the **Consumer Key**. That is your API key.

## Setup

```bash
git clone https://github.com/vaniyashahbaz0/event-management-system.git
cd event-management-system
npm install
cp .env.example .env      # then edit .env
```

Put your key in `.env`:

```
VITE_TM_API_KEY=your_ticketmaster_api_key_here
```

Then:

```bash
npm run dev      # start the dev server
npm run build    # production build into dist/
npm run lint     # run Oxlint
```

`.env` is git-ignored. Never commit a real key.

## Folder structure

```
src/
  app/store.js                      Redux store + registrations persistence listener
  features/
    auth/authSlice.js               users, current user, auth errors
    events/eventsSlice.js           list, details, categories, filters + thunks
    registrations/registrationsSlice.js   registrations, selectors
  services/ticketmaster.js          API client + event normalization
  components/                       Navbar, EventCard, RegisterButton, Toast, ErrorBoundary, ...
  hooks/                            useToast, useRegistrationActions, useDebouncedInput
  pages/                            Login, Register, Events, EventDetails, MyEvents, NotFound
  utils/                            storage, format, eventTime, eventParams, validation
```

## Redux store structure

```js
{
  auth: {
    users: [{ id, name, email, password }],   // persisted as "users"
    user: { id, name, email } | null,         // persisted as "currentUser"
    error: string | null,
  },
  events: {
    items, pagination, filters, categories,
    listStatus, listError,                    // 'idle' | 'loading' | 'succeeded' | 'failed'
    selectedEvent, detailsStatus, detailsError, detailsNotFound,
    // plus internal request-tracking keys
  },
  registrations: {
    items: [{
      id, userId, eventId, registeredAt,
      event: { id, name, image, date, time, dateTime, venueName, city, country, category, url },
    }],                                       // all users, persisted as "registrations"
  },
}
```

Each registration keeps a snapshot of the event, so My Events works without refetching, even if the API no longer returns that event. Reducers stay pure: ids and timestamps are generated in `prepare` callbacks, and persistence happens in listener middleware.

## Routes

| Path | Access | Page |
| --- | --- | --- |
| `/` | public | Redirects to `/events` |
| `/login` | public | Login |
| `/register` | public | Sign up |
| `/events` | protected | Event list, search and filters |
| `/events/:id` | protected | Event details and registration |
| `/my-events` | protected | Upcoming and completed registrations |
| `*` | public | 404 page |

## Notes and known limitations

- **Auth is a frontend simulation.** Users and the session are kept in `localStorage`; there is no backend.
- Passwords are stored in **plain text** in `localStorage`. This is acceptable only for this simulation and must never be done in a real app.
- The Ticketmaster API key is bundled into the frontend (`VITE_` variables are public), so anyone can read it from the built app. Use a restricted key and a backend proxy in production.
- Ticketmaster limits deep paging (`size * page` must stay below 1000), so only the first ~1000 results of any query are reachable. Narrow the search to see more.
- Tour events can appear several times with different dates, since each date is a separate event.
- Registrations live in the browser's `localStorage`: clearing site data removes them, and they do not sync across browsers or devices.
