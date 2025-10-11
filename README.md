# Gold Digger 🟡

A real-time gold investment tracking application built with Node.js. Get live gold price updates and log your investments with an intuitive web interface.

## Features

- 📈 **Real-time Price Updates**: Live gold prices via Server-Sent Events (SSE)
- 💰 **Investment Logging**: Record your gold investments with timestamps
- 📝 **File Logging**: All investments saved to `investments.txt`

## Prerequisites

Before running this application, make sure you have:

- **Node.js** (version 14 or higher) installed on your machine
- **npm** (comes with Node.js)

## Installation & Setup

1. **Clone or download** this repository to your local machine

2. **Navigate to the project directory**:
   ```bash
   cd Gold-Digger
   ```

3. **Install dependencies** (if package.json exists):
   ```bash
   npm install
   ```

4. **Ensure project structure** looks like this:
   ```
   Gold-Digger/
   ├── server.js
   ├── public/
   │   ├── index.html
   │   ├── index.js
   │   ├── index.css
   │   ├── generateNumber.js
   │   └── 404.html
   └── README.md
   ```

## Running the Application

1. **Start the server**:
   ```bash
   node server.js
   ```

2. **Look for this confirmation message**:
   ```
   Server running on port 3000
   ```

3. **Open your web browser** and navigate to:
   ```
   http://localhost:3000
   ```

4. **You should see**:
   - Live gold price updates every 2 seconds
   - Green status indicator (🟢) showing active connection
   - Investment input field and "Invest Now!" button

## How to Use

### Viewing Live Prices
- Gold prices update automatically every 2 seconds
- Green dot (🟢) = Connected to server
- Red dot (🔴) = Connection issues

### Making an Investment
1. Enter your investment amount in the input field
2. Click **"Invest Now!"** button
3. View your investment summary in the modal
4. Click **"OK"** to close the modal
5. Your investment is automatically logged to `investments.txt`

### Viewing Investment History
Check the `investments.txt` file in your project directory. Each entry contains:
```
2025-10-11T14:30:25.123Z, amount paid: $1000, price per Oz: $45
```

## Troubleshooting

### Server Won't Start
- **Check if port 3000 is already in use**:
  ```bash
  netstat -ano | findstr :3000  # Windows
  lsof -i :3000                 # Mac/Linux
  ```
- **Kill any process using port 3000** and try again

### Red Status Indicator
- Make sure `node server.js` is still running
- Check the terminal for any error messages
- Refresh the browser page

### Investments Not Saving
- Check terminal for error messages
- Ensure the application has write permissions in the project directory
- Verify `investments.txt` is being created in the root directory

### Browser Shows "Cannot GET /"
- Ensure the server is running (`node server.js`)
- Check that all files are in the correct `public/` folder structure
- Verify you're visiting `http://localhost:3000` (not `localhost:5500` or similar)

## Technical Details

- **Backend**: Node.js with built-in `http` module
- **Real-time Updates**: Server-Sent Events (SSE)
- **File Operations**: Node.js `fs/promises` for investment logging
- **Price Generation**: Random number generation simulating live prices
- **Memory Management**: Prevents memory leaks with shared intervals

## Stopping the Application

To stop the server:
- Press `Ctrl + C` in the terminal where the server is running

## File Structure

- **`server.js`** - Main Node.js server handling routes and SSE
- **`public/index.html`** - Main HTML interface
- **`public/index.js`** - Client-side JavaScript for UI interactions
- **`public/index.css`** - Styling for the application
- **`public/generateNumber.js`** - Price generation logic
- **`public/404.html`** - Custom 404 error page
- **`investments.txt`** - Auto-generated file storing investment logs

## Development

This is a learning project demonstrating:
- Node.js server creation
- Server-Sent Events for real-time data
- File system operations
- DOM manipulation
- Error handling and user feedback

---

**Happy gold digging! 🏆**