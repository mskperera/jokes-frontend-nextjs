interface DecodedToken {
    exp: number; // Expiration time as Unix timestamp (seconds)
    iat: number; // Issued at time as Unix timestamp (seconds)
    // Include other fields based on the JWT structure
  }