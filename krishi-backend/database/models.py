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


class CropRecommendation(db.Model):
    __tablename__ = "crop_recommendations"

    # One saved recommendation per user — the latest one.
    # (A future version could switch this to a history table by
    # dropping the primary-key-on-user_id constraint below.)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True
    )

    crop = db.Column(
        db.String(50),
        nullable=False
    )

    confidence = db.Column(
        db.Float,
        nullable=False
    )

    # Top-3 predictions as JSON: [{"crop": "rice", "confidence": 0.8}, ...]
    top_predictions = db.Column(
        db.JSON,
        nullable=False
    )

    # Inputs used to make the prediction — kept so the dashboard
    # (or the user) can see what the recommendation was based on
    nitrogen = db.Column(db.Float, nullable=False)
    phosphorus = db.Column(db.Float, nullable=False)
    potassium = db.Column(db.Float, nullable=False)
    ph = db.Column(db.Float, nullable=False)
    temperature = db.Column(db.Float, nullable=False)
    humidity = db.Column(db.Float, nullable=False)
    rainfall = db.Column(db.Float, nullable=False)

    province = db.Column(db.String(80), nullable=True)
    district = db.Column(db.String(80), nullable=True)

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    user = db.relationship("User")

    def to_public_dict(self):

        return {
            "crop": self.crop,
            "confidence": self.confidence,
            "top_predictions": self.top_predictions,
            "inputs": {
                "nitrogen": self.nitrogen,
                "phosphorus": self.phosphorus,
                "potassium": self.potassium,
                "ph": self.ph,
                "temperature": self.temperature,
                "humidity": self.humidity,
                "rainfall": self.rainfall,
            },
            "province": self.province,
            "district": self.district,
            "created_at": self.created_at.isoformat(),
        }

    def __repr__(self):
        return f"<CropRecommendation user_id={self.user_id} crop={self.crop}>"


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