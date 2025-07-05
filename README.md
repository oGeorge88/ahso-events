
# 🎉 AHSO Events App

A modern, responsive event management platform built for the **AHS Organization** using [Next.js](https://nextjs.org). Designed for both mobile and desktop users, it offers an intuitive interface to explore events and manage them efficiently.

Browse **upcoming**, **past**, or **all** events with dynamic filtering, smart search, smooth animations, and calendar integration. Admins or authorized users can update event data in real time, while general users enjoy a fast, seamless experience.

---

## 🚀 Features

* 🔍 **Event Browsing** – Instantly filter upcoming, past, or all events with real-time data from MongoDB.
* 🔦 **Smart Search** – Quickly find events by name using a responsive, real-time search input.
* 🎨 **Theme-Ready UI** – Fully styled with TailwindCSS including **dark mode** support and smooth transitions.
* 🔐 **Secure Admin Authentication** – Admin signup requires a secure passcode (`adminispowerful`) for registration; login with email and passcode.
* 📅 **Dynamic Date Filtering** – Backend logic cleanly separates events by date.
* 🧭 **Sidebar Navigation** – Persistent sidebar for seamless navigation on desktop and mobile.
* ⚙️ **Settings Page** – Dark mode toggle, language switch (English ↔ Igbo), and notification preferences.
* 📆 **Google Calendar Integration** – Sync and view events seamlessly with Google Calendar API support.
* 💨 **Framer Motion Animations** – Smooth transitions and interactive UX using Framer Motion.
* ☁️ **Vercel-Optimized** – Deployed and tested on [Vercel](https://vercel.com) for best-in-class performance.

---

## 🛠️ Tech Stack

* **Frontend**: [Next.js](https://nextjs.org), [React](https://react.dev), [TailwindCSS](https://tailwindcss.com)
* **Animation**: [Framer Motion](https://www.framer.com/motion/)
* **Backend API**: Next.js API Routes with MongoDB integration
* **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
* **Calendar**: Google Calendar API
* **Deployment**: [Vercel](https://vercel.com)

---

## 📦 Getting Started

### Prerequisites

* Node.js ≥ 16.x
* MongoDB Atlas URI
* Google API credentials for Calendar integration
* (Optional) Firebase Auth or other auth providers

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/ahso-events.git
   cd ahso-events
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   # or
   yarn install
   ```

3. **Create environment file**:

   Create a `.env.local` file and add the following (replace placeholders):

   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/AHSO_Event?retryWrites=true&w=majority
   GOOGLE_CLIENT_ID=<your-google-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-client-secret>
   GOOGLE_REFRESH_TOKEN=<your-google-refresh-token>
   GOOGLE_CALENDAR_ID=<your-google-calendar-id>
   ```

4. **Start development server**:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Folder Structure

```
pages/
  ├── api/
  │   ├── eventsUpcoming.js
  │   ├── eventsPast.js
  │   ├── eventsAll.js
  │   ├── updateEvent.js
  │   ├── calendar.js            # API route for Google Calendar events
  │   ├── admin/
  │       ├── login.js          # Admin login page (email + passcode)
  │       └── signup.js         # Admin signup page (requires secure passcode)
  ├── index.js
  └── home.js
components/
  ├── Sidebar.js
  ├── Header.js
  ├── EventCard.js
  └── CalendarView.js           # Component to display Google Calendar events
lib/
  ├── mongodb.js
  └── googleCalendar.js         # Helper to integrate Google Calendar API
styles/
  └── globals.css               # Tailwind + CSS variables + dark mode support
```

---

## 🔧 API Routes

* `GET /api/eventsUpcoming` – Fetch upcoming events from MongoDB
* `GET /api/eventsPast` – Fetch past events from MongoDB
* `GET /api/eventsAll` – Fetch all events from MongoDB
* `POST /api/updateEvent` – Update event details by `_id`
* `GET /api/calendar` – Fetch events from Google Calendar API
* `POST /api/admin/signup` – Register new admin (requires passcode verification)
* `POST /api/admin/login` – Admin login (email + passcode)

---

## 🌐 Deployment (Vercel)

1. Push your project to GitHub or GitLab
2. Import the repository into [Vercel](https://vercel.com/import)
3. Add your environment variables (`MONGODB_URI`, Google API keys, etc.) in Vercel's dashboard
4. Deploy and share your live site!

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository, create a branch, and submit a pull request with improvements, bug fixes, or new features.

---

## 📄 License

Licensed under the **MIT License** – free to use and modify for personal and organizational projects.

---

## 👋 Acknowledgements

Built with ❤️ using [Next.js](https://nextjs.org), [TailwindCSS](https://tailwindcss.com), [MongoDB](https://mongodb.com), and Google Calendar API. Inspired by the need to modernize event engagement for students, parents, staff, and the general public.

---

