# Use a specific Ruby version
FROM ruby:3.2-slim

# Install dependencies for Jekyll and native extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /srv/jekyll

# Copy Gemfile and Gemfile.lock (if it exists)
COPY Gemfile* ./

# Install dependencies
RUN bundle install

# Copy the rest of the application
COPY . .

# Expose the port Jekyll runs on
EXPOSE 4000

# Command to run Jekyll
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--incremental", "--force_polling"]
