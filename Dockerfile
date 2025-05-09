# Dockerfile

# ---- Stage 1: Build React Frontend ----
# Use an official Node.js LTS (Long Term Support) version as a parent image
# Alpine images are smaller, good for build stages
FROM node:18-alpine AS client-builder

# Set the working directory in the container for the client app
WORKDIR /app/client

# Copy package.json and package-lock.json (or yarn.lock)
# This is done first to leverage Docker's layer caching.
# If these files don't change, Docker won't re-run npm install.
COPY client/package.json client/package-lock.json* ./
# If using yarn:
# COPY client/yarn.lock ./

# Install client dependencies
# Use 'npm ci' for cleaner installs based on package-lock.json
RUN npm ci
# If using yarn:
# RUN yarn install --frozen-lockfile

# Copy the rest of the client application code
COPY client/ ./

# Build the React application for production
# This command should match the build script in your client/package.json
RUN npm run build
# The build output will typically be in /app/client/build (or /app/client/dist)

# ---- Stage 2: Setup Python Backend and Final Image ----
# Use an official Python slim image for a smaller final image size
FROM python:3.10-slim

# Set environment variables for Python
# Prevents python from writing .pyc files
ENV PYTHONDONTWRITEBYTECODE=1
# Prevents python from buffering stdout and stderr  
ENV PYTHONUNBUFFERED=1         

# Set the working directory for the entire application in the final image
WORKDIR /app

# Copy Python backend requirements file
COPY server/requirements.txt ./server/

# Install Python dependencies
# --no-cache-dir reduces image size
RUN pip install --no-cache-dir -r ./server/requirements.txt

# Copy the backend Flask application code into the container
COPY server/ ./server/

# Copy the built frontend static assets from the 'client-builder' stage
# The source path '/app/client/build' must match the output directory of 'npm run build'
# The destination './client_build' will place these files in '/app/client_build'
# This path is referenced by Flask's 'static_folder' configuration.
COPY --from=client-builder /app/client/dist ./client_build

# Expose the port the Flask app (via Gunicorn) will run on
# This should match the port Gunicorn is configured to bind to.
EXPOSE 8000

# Command to run the application using Gunicorn (a production-grade WSGI server)
# 'server.app:app' means:
#   - 'server' is the directory containing your Flask app (or the Python module name)
#   - 'app.py' (or __init__.py if 'server' is a package) is the file
#   - ':app' is the Flask application instance variable within that file.
# Adjust 'server.app:app' if your main Flask file or app instance is named differently.
#   Example: if your file is 'main.py' and app instance is 'my_flask_app', use 'server.main:my_flask_app'
# Bind to 0.0.0.0 to make it accessible from outside the container.
# Use a reasonable number orkers. A common recommendation is (2 * number_of_cores) + 1.

CMD ["waitress-serve", "--host=0.0.0.0", "--port=8000", "server.app:app"]

# Temporary Debugging CMD
# CMD ["sh", "-c", "cd /app/server && waitress-serve --host=0.0.0.0 --port=8000 app:app"]



# Alternatively, for Windows or simpler setups, you might use Waitress:
# CMD ["waitress-serve", "--host=0.0.0.0", "--port=8000", "server.app:app"]
# Ensure 'gunicorn' or 'waitress' is listed in your server/requirements.txt