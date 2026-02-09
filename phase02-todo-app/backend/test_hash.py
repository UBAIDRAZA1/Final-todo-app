"""
Test bcrypt password hashing with passlib
"""
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

try:
    password = "password123"
    print(f"Hashing '{password}'...")

    hashed = pwd_context.hash(password)
    print(f"✅ Hash generated: {hashed}")

    # Verify the password
    if pwd_context.verify(password, hashed):
        print("✅ Password verified successfully")
    else:
        print("❌ Password verification failed")

except Exception as e:
    print(f"❌ Error: {e}")
