"""
Test Argon2 password hashing with passlib
"""
try:
    import argon2
    print(f"✅ Argon2 version: {argon2.__version__}")

    from passlib.hash import argon2 as argon2_hash
    print("✅ Passlib argon2 handler loaded")

    # Generate a hash for testing
    password = "password123"
    hashed = argon2_hash.hash(password)
    print(f"Generated hash: {hashed}")

    # Optional: verify the hash
    if argon2_hash.verify(password, hashed):
        print("✅ Password verified successfully")
    else:
        print("❌ Password verification failed")

except ImportError as e:
    print(f"❌ ImportError: {e}")
except Exception as e:
    print(f"❌ Error: {e}")
