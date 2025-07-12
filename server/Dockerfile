# Build stage
FROM rust:1.70 as builder

# Set working directory
WORKDIR /usr/src/app

# Copy manifests
COPY Cargo.toml Cargo.lock ./

# Create a dummy main.rs to build dependencies
RUN mkdir src && echo "fn main() {}" > src/main.rs

# Build dependencies
RUN cargo build --release

# Remove dummy main.rs and copy real source code
RUN rm src/main.rs
COPY src ./src

# Build the application
RUN cargo build --release

# Runtime stage
FROM debian:bullseye-slim

# Install ca-certificates for HTTPS requests
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Create app user
RUN useradd -r -s /bin/false app

# Set working directory
WORKDIR /usr/local/bin

# Copy the binary from builder stage
COPY --from=builder /usr/src/app/target/release/cyborgtech-server .

# Change ownership to app user
RUN chown app:app cyborgtech-server

# Switch to app user
USER app

# Expose port
EXPOSE 3000

# Run the binary
CMD ["cyborgtech-server"] 