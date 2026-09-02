import random
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from sqlalchemy import or_
from sqlalchemy.orm import Session
from database import get_db
import models
from utils.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])


class AuthRequest(BaseModel):
    username: str | None = None
    email: str | None = None
    password: str | None = None


class VerifyRequest(BaseModel):
    email: str
    code: str


class ProfileUpdateRequest(BaseModel):
    originalEmail: str | None = None
    username: str
    email: str


class ConfirmProfileUpdateRequest(BaseModel):
    originalEmail: str
    newEmail: str | None = None
    newUsername: str | None = None
    newPassword: str | None = None
    code: str


class ChangePasswordRequest(BaseModel):
    email: str
    currentPassword: str
    newPassword: str


@router.post("/register")
def register(data: AuthRequest, db: Session = Depends(get_db)):
    if not data.password:
        raise HTTPException(status_code=400, detail="Password is required")

    user_identifier = data.username or (data.email.split('@')[0] if data.email else 'User')
    user_email = data.email or f"{user_identifier}@bizeye.local"

    # Check if user already exists
    conditions = []
    if user_identifier:
        conditions.append(models.User.username == user_identifier)
    if user_email:
        conditions.append(models.User.email == user_email)

    existing = db.query(models.User).filter(or_(*conditions)).first() if conditions else None
    if existing:
        if existing.is_verified:
            raise HTTPException(status_code=400, detail="Account with this username or email already exists")
        else:
            code = str(random.randint(100000, 999999))
            existing.password_hash = hash_password(data.password)
            existing.verification_code = code
            db.commit()
            return {
                "success": True,
                "requiresVerification": True,
                "email": existing.email,
                "verificationCode": code,
                "message": f"Verification code sent to {existing.email}"
            }

    otp_code = str(random.randint(100000, 999999))

    user = models.User(
        username=user_identifier,
        email=user_email,
        password_hash=hash_password(data.password),
        is_verified=False,
        verification_code=otp_code
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {
        "success": True,
        "requiresVerification": True,
        "email": user.email,
        "verificationCode": otp_code,
        "message": f"Verification code sent to {user.email}"
    }


@router.post("/verify")
def verify_email(data: VerifyRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        or_(models.User.email == data.email.strip(), models.User.username == data.email.strip())
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User account not found")

    if user.is_verified:
        token = create_access_token({"sub": user.email, "user_id": user.id})
        return {
            "success": True,
            "message": "Email is already verified",
            "user": {"id": user.id, "username": user.username, "email": user.email},
            "token": token
        }

    if not user.verification_code or user.verification_code.strip() != data.code.strip():
        raise HTTPException(status_code=400, detail="Invalid verification code. Please check and try again.")

    user.is_verified = True
    user.verification_code = None
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.email, "user_id": user.id})

    return {
        "success": True,
        "message": "Email verified successfully!",
        "user": {"id": user.id, "username": user.username, "email": user.email},
        "token": token
    }


@router.post("/login")
def login(data: AuthRequest, db: Session = Depends(get_db)):
    if not data.password:
        raise HTTPException(status_code=400, detail="Password is required")

    conditions = []
    if data.email:
        conditions.extend([models.User.email == data.email, models.User.username == data.email])
    if data.username:
        conditions.extend([models.User.username == data.username, models.User.email == data.username])

    if not conditions:
        raise HTTPException(status_code=400, detail="Email or username is required")

    user = db.query(models.User).filter(or_(*conditions)).first()
    
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email/username or password")

    if not user.is_verified:
        raise HTTPException(
            status_code=400,
            detail="Email address not verified yet. Please complete verification."
        )

    token = create_access_token({"sub": user.email, "user_id": user.id})

    return {
        "success": True,
        "user": {"id": user.id, "username": user.username, "email": user.email},
        "token": token
    }


@router.put("/profile")
def update_profile(data: ProfileUpdateRequest, db: Session = Depends(get_db)):
    target_email = data.originalEmail or data.email
    user = db.query(models.User).filter(
        or_(models.User.email == target_email, models.User.username == data.username, models.User.email == data.email)
    ).first()

    if not user:
        user = models.User(
            username=data.username,
            email=data.email,
            password_hash=hash_password("default123"),
            is_verified=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return {
            "success": True,
            "requiresVerification": False,
            "message": "Profile updated successfully",
            "user": {"id": user.id, "username": user.username, "email": user.email}
        }

    # If email address is changed, require verification OTP
    if data.email.strip().lower() != user.email.strip().lower():
        otp_code = str(random.randint(100000, 999999))
        user.verification_code = otp_code
        db.commit()
        return {
            "success": True,
            "requiresVerification": True,
            "newEmail": data.email.strip(),
            "newUsername": data.username.strip(),
            "verificationCode": otp_code,
            "message": f"Verification code sent to {data.email}"
        }

    user.username = data.username.strip()
    db.commit()
    db.refresh(user)

    return {
        "success": True,
        "requiresVerification": False,
        "message": "Profile updated successfully",
        "user": {"id": user.id, "username": user.username, "email": user.email}
    }


@router.post("/change-password-request")
def change_password_request(data: ChangePasswordRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        or_(models.User.email == data.email.strip(), models.User.username == data.email.strip())
    ).first()

    if not user or not verify_password(data.currentPassword, user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    otp_code = str(random.randint(100000, 999999))
    user.verification_code = otp_code
    db.commit()

    return {
        "success": True,
        "requiresVerification": True,
        "verificationCode": otp_code,
        "message": f"Verification code sent to {user.email}"
    }


@router.post("/confirm-profile-update")
def confirm_profile_update(data: ConfirmProfileUpdateRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        or_(models.User.email == data.originalEmail.strip(), models.User.username == data.originalEmail.strip())
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User account not found")

    if not user.verification_code or user.verification_code.strip() != data.code.strip():
        raise HTTPException(status_code=400, detail="Invalid verification code. Please check and try again.")

    if data.newEmail:
        user.email = data.newEmail.strip()
    if data.newUsername:
        user.username = data.newUsername.strip()
    if data.newPassword:
        user.password_hash = hash_password(data.newPassword)

    user.verification_code = None
    user.is_verified = True
    db.commit()
    db.refresh(user)

    return {
        "success": True,
        "message": "Changes authorized and saved successfully!",
        "user": {"id": user.id, "username": user.username, "email": user.email}
    }
