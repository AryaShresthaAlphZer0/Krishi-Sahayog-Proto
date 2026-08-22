from datetime import datetime

from database.db import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(100),
        nullable=False
    )

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False,
        index=True
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    crop_location = db.relationship(
        "CropLocation",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan"
    )

    def to_public_dict(self):
        """Fields that are safe to send to the client — never
        include password_hash or anything else internal."""

        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
        }

    def __repr__(self):
        return f"<User {self.email}>"


class CropLocation(db.Model):
    __tablename__ = "crop_locations"

    # One saved location per user
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True
    )

    province = db.Column(
        db.String(80),
        nullable=False
    )

    district = db.Column(
        db.String(80),
        nullable=False
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    user = db.relationship(
        "User",
        back_populates="crop_location"
    )

    def to_public_dict(self):

        return {
            "province": self.province,
            "district": self.district,
        }

    def __repr__(self):
        return f"<CropLocation user_id={self.user_id}>"