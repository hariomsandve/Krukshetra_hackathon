import os
import logging
from datetime import datetime
from typing import Callable, List, Optional
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from motor.motor_asyncio import AsyncIOMotorDatabase
import firebase_admin
from firebase_admin import auth, credentials

from app.config import get_settings
from app.database import get_database
from app.models.user import UserInDB, UserRole

logger = logging.getLogger("uvicorn.error")

security = HTTPBearer(auto_error=False)

# Initialize Firebase Admin SDK
_firebase_app = None


def init_firebase():
    global _firebase_app
    if _firebase_app is not None or firebase_admin._apps:
        _firebase_app = firebase_admin.get_app()
        return _firebase_app

    settings = get_settings()
    cred_path = settings.firebase_credentials_path

    try:
        if cred_path and os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            _firebase_app = firebase_admin.initialize_app(cred)
            logger.info(f"Firebase Admin SDK initialized using certificate: {cred_path}")
        elif os.environ.get("GOOGLE_APPLICATION_CREDENTIALS") and os.path.exists(os.environ["GOOGLE_APPLICATION_CREDENTIALS"]):
            _firebase_app = firebase_admin.initialize_app()
            logger.info("Firebase Admin SDK initialized using Google Application Default Credentials")
        else:
            logger.warning(
                "No Firebase credentials file found. In development mode, mock tokens 'dev-student', 'dev-trainer', 'dev-evaluator' will be accepted."
            )
            # Try initializing default app without credentials for mock / local environments
            try:
                _firebase_app = firebase_admin.initialize_app()
            except Exception:
                pass
    except Exception as exc:
        logger.warning(f"Firebase Admin initialization warning: {exc}")

    return _firebase_app


init_firebase()


async def verify_token(
    auth_header: Optional[HTTPAuthorizationCredentials] = Security(security)
) -> dict:
    """Verifies Firebase ID token from Authorization: Bearer <token>."""
    if not auth_header or not auth_header.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization token is missing",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = auth_header.credentials
    settings = get_settings()

    # Development convenience mock tokens (disabled in production)
    if settings.environment == "development" and token.startswith("dev-"):
        role_part = token.replace("dev-", "").lower()
        valid_roles = [r.value for r in UserRole]
        role = role_part if role_part in valid_roles else UserRole.STUDENT.value
        return {
            "uid": f"dev_user_{role}",
            "email": f"{role}@adaptiq.io",
            "name": f"Dev {role.capitalize()}",
            "is_dev": True
        }

    # Verify actual Firebase ID token
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as exc:
        logger.error(f"Firebase token verification failed: {exc}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(
    token_payload: dict = Depends(verify_token),
    db: AsyncIOMotorDatabase = Depends(get_database)
) -> dict:
    """Retrieves current user from MongoDB, auto-provisioning as Student if first login."""
    firebase_uid = token_payload.get("uid")
    if not firebase_uid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: missing UID"
        )

    user = await db.users.find_one({"firebase_uid": firebase_uid})

    if not user:
        # Auto-provision new user on first authenticated request
        # New users ALWAYS start with the default Student role
        email = token_payload.get("email", f"{firebase_uid}@adaptiq.io")
        display_name = token_payload.get("name") or token_payload.get("email", "").split("@")[0] or "New Student"

        # Special provision for dev users
        role = UserRole.STUDENT.value
        if token_payload.get("is_dev") and "dev_user_" in firebase_uid:
            role = firebase_uid.replace("dev_user_", "")

        new_user = {
            "firebase_uid": firebase_uid,
            "email": email,
            "display_name": display_name,
            "role": role,
            "branch": None,
            "year": None,
            "skills": [],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        result = await db.users.insert_one(new_user)
        new_user["_id"] = result.inserted_id
        user = new_user

    return user


def require_role(allowed_roles: List[UserRole]) -> Callable:
    """Dependency factory to enforce role-based access control (RBAC).

    Roles are verified against the authoritative database record, never trusting frontend claims.
    """
    allowed_values = [r.value for r in allowed_roles]

    async def role_checker(current_user: dict = Depends(get_current_user)) -> dict:
        user_role = current_user.get("role")
        if user_role not in allowed_values and user_role != UserRole.ADMIN.value:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Forbidden: Action requires one of {allowed_values} roles"
            )
        return current_user

    return role_checker
