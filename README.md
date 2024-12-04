# Youthopia MVP

A modern web application built with Next.js, TypeScript, and Tailwind CSS, featuring a beautiful UI and in-memory authentication system.

## Features

### Authentication
- In-memory user management system
- User registration with unique username and email validation
- Secure login with email and password
- Demo account for testing
- Persistent session until page refresh
- User avatar with dropdown menu
- Profile and settings pages

### UI/UX
- Modern, clean interface
- Responsive design for all devices
- Beautiful gradients and animations
- Loading states and error handling
- Seamless navigation
- Mobile-friendly navigation menu

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd youthopiaMVP
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing the Authentication System

### Demo Account
You can use the pre-configured demo account:
- Email: demo@example.com
- Password: demo123

### Creating a New Account
1. Click "Sign Up" in the navigation bar
2. Fill in the registration form:
   - Username (unique)
   - Email (unique)
   - Password
   - Confirm Password
3. Submit the form

Note: Since this is using in-memory storage, all registered accounts will be reset when you refresh the page.

### Authentication Features
- Sign up with unique username and email
- Sign in with email and password
- User avatar display in navbar when signed in
- Dropdown menu with:
  - Profile link
  - Settings link
  - Sign out option
- Protected routes (coming soon)

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Shadcn/ui](https://ui.shadcn.com/) - UI components
- [Lucide Icons](https://lucide.dev/) - Icons

## Project Structure

```
youthopiaMVP/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   │   ├── signin/        # Sign in page
│   │   └── signup/        # Sign up page
│   ├── profile/           # User profile page
│   └── settings/          # User settings page
├─�� components/            # React components
│   ├── layout/           # Layout components
│   └── ui/               # UI components
├── lib/                  # Utilities and helpers
│   ├── auth.ts          # Authentication logic
│   └── types.ts         # TypeScript types
└── public/              # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 