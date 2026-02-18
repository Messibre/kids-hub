🎹 Kids Hub

Kids Hub is an interactive, educational, and fun-filled mobile application designed to engage children through music, art, and learning activities. Built using React, Capacitor, and Android Studio, this app offers a seamless and responsive experience across devices.

✨ Features
Interactive Piano: A virtual piano that allows kids to play notes, enhancing their musical skills.

Drawing Pad: A canvas for children to express their creativity through drawing. Educational Quizzes: Engaging quizzes to promote learning in a fun way.

User-Friendly Interface: Designed with children in mind, ensuring easy navigation and interaction.

🚀 Getting Started To run this project locally, follow these steps:

Prerequisites

Node.js (v14 or higher)

npm (v6 or higher)

Android Studio

Capacitor CLI

Installation

Clone the repository:

git clone https://github.com/Messibre/kids-hub.git cd kids-hub

Install dependencies:

npm install

Build the project:

npm run build

Add Android platform:

npx cap add android

Open in Android Studio:

npx cap open android

Run the app:

Use Android Studio to build and run the app on an emulator or connected device.

🤝 Contributing

Contributions are welcome!
If you'd like to contribute to Kids Hub, please fork the repository and submit a pull request.

License

This project is licensed under the MIT License. See the LICENSE file for details.

Contact

For any inquiries or feedback, please contact me at messibre21@gmail.com.

## Vercel Deploy Notes

1. Frontend (this root app):
- Set `VITE_API_BASE_URL` in Vercel Project Environment Variables.
- Example:
  - If backend is deployed separately: `https://your-backend-domain.vercel.app`
  - If same-origin proxy exists: leave it empty.

2. Backend:
- Must be deployed and reachable from the frontend URL.
- Set backend env vars:
  - `MONGODB_URI`
  - `JWT_SECRET`
- If deploying backend on Vercel, create a separate Vercel project with Root Directory set to `back-endd/server`.

3. Login persistence:
- Auth token is stored in `localStorage` (`jwtToken`).
- Logged-in state remains after refresh/reopen until user logs out or storage is cleared.
