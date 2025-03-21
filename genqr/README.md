# anwhubxyz Monorepo

This monorepo contains various projects that are deployed to Vercel using the Vercel Monorepo + Separate Projects configuration.

## Projects

- [QR Code Generator](./projects/qr-generator) - A modern QR code generator web application built with Next.js, allowing users to create customizable QR codes.

## Features of QR Code Generator

- Generate QR codes from URLs, text, or other content
- Customize QR code appearance and style
- Download generated QR codes in various formats
- Responsive design for mobile and desktop

## Tech Stack of QR Code Generator

- Next.js 14
- React 18
- Tailwind CSS
- Shadcn UI Components
- QR Code Styling Library

## Getting Started with QR Code Generator

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/anwhubxyz/qr-gen.git
   cd qr-gen
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file with required environment variables.

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Development

This monorepo uses Turborepo for build orchestration. To develop all applications:

```bash
# Install dependencies for all projects
npm install

# Run all projects in development mode
npm run dev
```

## Deployment

This repository is configured for deployment on Vercel using the Monorepo + Separate Projects feature. Each project within the `projects` directory is deployed as a separate project on Vercel while sharing the same repository.

## License

MIT
