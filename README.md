# LLM Chat Assistant

A modern, feature-rich LLM chat application built with Next.js 15, featuring multi-theme support, internationalization, and multiple LLM model integration.

## Features

### 🎨 Multi-Theme Support
- **Tokyo Night**: Dark theme with beautiful purple/blue color palette
- **Tokyo Night Light**: Light theme with complementary colors
- Smooth theme transitions with system-level dark mode support

### 🌍 Internationalization
- **Chinese (中文)**: Default language
- **English**: Secondary language option
- Seamless language switching without page reload

### 🤖 Multi-Model Support
- **DeepSeek Chat**: Standard conversational AI model
- **DeepSeek Reasoner**: Advanced reasoning model for complex tasks
- **ChatGPT**: OpenAI's GPT model (optional)
- Easy model switching in settings panel
- Real-time streaming responses

### 📝 Advanced Markdown Support
- Full GitHub Flavored Markdown (GFM) support
- Syntax highlighting for code blocks
- Theme-aware styling for all markdown elements
- Support for tables, lists, blockquotes, and more

### 🚀 Performance & Development
- Built with Next.js 15 App Router
- Turbopack for ultra-fast development builds
- TypeScript for type safety
- Tailwind CSS for styling
- Responsive design for all devices

### 🐳 Docker Ready
- Production-ready Docker configuration
- Docker Compose setup for easy deployment
- Optimized multi-stage builds

## Getting Started

### Prerequisites
- Node.js 20+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd llm-chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```bash
   # DeepSeek API Configuration
   DEEPSEEK_API_KEY=your_deepseek_api_key_here
   
   # OpenAI API Configuration (optional)
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   
   **Getting API Keys:**
   - **DeepSeek**: Visit [https://platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys) to get your API key
   - **OpenAI**: Visit [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys) to get your API key (optional)

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# DeepSeek API Key
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# OpenAI API Key (for ChatGPT)
OPENAI_API_KEY=your_openai_api_key_here

# Next.js Configuration
NEXT_TELEMETRY_DISABLED=1
```

## Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Build and run the application
docker-compose up --build

# Run in detached mode
docker-compose up -d --build
```

### Using Docker directly

```bash
# Build the image
docker build -t llm-chat .

# Run the container
docker run -p 3000:3000 --env-file .env.local llm-chat
```

## Project Structure

```
src/
├── app/                    # Next.js 15 App Router
│   ├── globals.css        # Global styles with theme support
│   ├── layout.tsx         # Root layout with theme provider
│   └── page.tsx           # Main chat page
├── components/            # React components
│   ├── chat-interface.tsx # Main chat interface
│   ├── header.tsx         # Application header
│   ├── settings-panel.tsx # Settings modal
│   └── theme-provider.tsx # Theme context provider
├── contexts/              # React contexts
│   └── chat-context.tsx   # Chat state management
├── i18n/                  # Internationalization
│   ├── request.ts         # i18n configuration
│   └── routing.ts         # Route localization
├── lib/                   # Utility libraries
│   ├── llm-service.ts     # LLM provider services
│   └── utils.ts           # Utility functions
└── messages/              # Translation files
    ├── en.json            # English translations
    └── zh.json            # Chinese translations
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

## API Integration

The application is designed to work with multiple LLM providers:

### DeepSeek Integration
- Endpoint: `https://api.deepseek.com/v1/chat/completions`
- Supports streaming responses
- Full chat completion API compatibility

### ChatGPT Integration
- Endpoint: `https://api.openai.com/v1/chat/completions`
- Compatible with OpenAI API
- Ready for future activation

## Theme System

The application uses a custom theme system built on Tailwind CSS:

### Tokyo Night Theme
```css
--bg: #1a1b26          /* Main background */
--bg-alt: #16161e       /* Alternative background */
--bg-dark: #24283b      /* Darker background */
--fg: #c0caf5           /* Main foreground */
--blue: #7aa2f7         /* Accent blue */
--green: #9ece6a        /* Success green */
/* ... and more */
```

### Tokyo Night Light Theme
```css
--bg: #d5d6db           /* Main background */
--bg-alt: #e9e9ec       /* Alternative background */
--fg: #565a6e           /* Main foreground */
--blue: #34548a         /* Accent blue */
/* ... and more */
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React
- **Markdown**: React Markdown with GFM and syntax highlighting
- **Themes**: next-themes
- **Internationalization**: next-intl
- **Build Tool**: Turbopack
- **Deployment**: Docker with multi-stage builds

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Tokyo Night theme colors inspired by the popular VS Code theme
- Built with modern React patterns and Next.js best practices
- Designed for scalability and maintainability
