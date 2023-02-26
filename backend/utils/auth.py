from datetime import datetime, timedelta

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from utils.env import env
from utils.logger import logger

# Create a security scheme for the API
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Create a password context for hashing and verifying passwords
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create a custom exception for invalid credentials
credentials_exception = HTTPException(
    status_code=401,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


def verify_password(plain_password, hashed_password):
    """Verify a plain password against a hashed password

    Args:
        plain_password (str): plain password
        hashed_password (str): hashed password

    Returns:
        bool: True if the password is correct, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    """Hash a password

    Args:
        password (str): plain password

    Returns:
        str: hashed password
    """
    return pwd_context.hash(password)


def create_access_token(user_id: int) -> str:
    """Create an access token for a user

    Args:
        user_id (int): user id

    Returns:
        str: access token
    """
    now = datetime.utcnow()
    duration_time = timedelta(minutes=env.AUTH_TOKEN_DURATION)
    to_encode = {
        "id": user_id,
        "issue_date": datetime.utcnow().isoformat(),
        "valid_until": (now + duration_time).isoformat(),
    }
    # Encode the payload with the secret key
    encoded_jwt = jwt.encode(to_encode, env.JWT_SECRET_KEY, algorithm="HS256")
    return encoded_jwt


async def is_valid_user(token: str = Depends(oauth2_scheme)) -> bool:
    """Check if the user is valid

    Args:
        token (str, optional): user token. Defaults to Depends(oauth2_scheme).

    Returns:
        bool: True if the user is valid, False otherwise
    """
    try:
        # Decode the token
        payload = jwt.decode(token, env.JWT_SECRET_KEY, algorithms="HS256")
        id: int = payload.get("id")
        valid_until = payload.get("valid_until")
        logger.info(valid_until)
        # Try if payload is complete
        if id and valid_until:
            # Try if token is still valid
            if datetime.utcnow() > datetime.fromisoformat(valid_until):
                logger.info("Invalid jwt : expired")
                raise credentials_exception
        else:
            logger.warning("Invalid jwt : missing value.")
            raise credentials_exception

    except JWTError:
        logger.info("Invalid jwt")
        raise credentials_exception
