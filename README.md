# TestGen Frontend

A modern React application for AI-powered test case generation with GitHub integration. Built with React 18, Tailwind CSS, and Framer Motion for a beautiful and responsive user experience.

## Features

- 🎨 **Modern UI/UX**: Clean, responsive design with smooth animations
- 🔗 **GitHub Integration**: Browse repositories and select files for testing
- 🤖 **AI-Powered Generation**: Generate test cases using Google's Gemini AI
- 📋 **Multiple Frameworks**: Support for JUnit, PyTest, Jest, Mocha, Selenium, and Cypress
- 📊 **Test Management**: Save, organize, and manage generated test cases
- 🔄 **Pull Request Creation**: Automatically create PRs with generated test cases
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- ⚡ **Real-time Updates**: Live status updates and notifications

## Tech Stack

- **React 18** - Modern React with hooks and concurrent features
- **React Router 6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Query** - Data fetching and caching
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications
- **React Syntax Highlighter** - Code syntax highlighting
- **Axios** - HTTP client

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running (see Backend README)

### Installation

1. **Navigate to the frontend directory**
   ```bash
   cd Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.js       # Main layout with navigation
├── pages/              # Page components
│   ├── Dashboard.js    # Main dashboard
│   ├── RepositoryBrowser.js  # GitHub repo browser
│   ├── TestGenerator.js      # AI test generation
│   ├── TestCases.js          # Test case management
│   ├── Settings.js           # Application settings
│   └── NotFound.js           # 404 page
├── services/           # API services
│   └── api.js         # API client and endpoints
├── utils/              # Utility functions
│   └── helpers.js     # Helper functions
├── App.js              # Main app component
├── index.js            # App entry point
└── index.css           # Global styles
```

## Key Features

### 1. Dashboard
- Overview statistics and metrics
- Quick action cards
- Recent activity feed
- Framework usage analytics
- System health status

### 2. Repository Browser
- Browse GitHub repositories
- Navigate file structure
- Search and filter files
- View file contents
- Select files for testing

### 3. Test Generator
- Multi-step test generation process
- Framework selection
- AI-powered test case summaries
- Detailed test case generation
- Code preview with syntax highlighting
- Pull request creation

### 4. Test Cases Management
- View all generated test cases
- Search and filter functionality
- Code preview and download
- Delete test cases
- Framework and type filtering

### 5. Settings
- API configuration
- Application preferences
- System status monitoring
- Theme selection

## API Integration

The frontend communicates with the backend through a comprehensive API layer:

- **GitHub API**: Repository browsing, file access, PR creation
- **AI API**: Test case generation and summaries
- **Test Cases API**: CRUD operations for test cases
- **Health API**: System status monitoring

## Styling

The application uses Tailwind CSS with custom components:

- **Custom Components**: Buttons, cards, inputs, badges
- **Color System**: Primary, secondary, success, warning, error colors
- **Animations**: Framer Motion for smooth transitions
- **Responsive Design**: Mobile-first approach
- **Dark Mode Ready**: Theme system in place

## Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Code Style

- Use functional components with hooks
- Follow React best practices
- Use TypeScript-like prop validation
- Consistent naming conventions
- Component composition over inheritance

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Netlify/Vercel

1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables

### Environment Variables for Production

```env
REACT_APP_API_URL=https://your-backend-domain.com/api
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Troubleshooting

### Common Issues

1. **Backend Connection Error**
   - Ensure backend server is running
   - Check API URL in environment variables
   - Verify CORS configuration

2. **GitHub API Errors**
   - Check GitHub token configuration
   - Verify token permissions
   - Ensure repository access

3. **AI Generation Failures**
   - Verify Gemini API key
   - Check API quota limits
   - Review error messages in console

### Performance Optimization

- Use React.memo for expensive components
- Implement proper loading states
- Optimize bundle size with code splitting
- Use React Query for efficient data fetching

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Check the documentation
- Review the API documentation
- Create an issue in the repository 