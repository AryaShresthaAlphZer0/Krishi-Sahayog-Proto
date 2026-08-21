from flask import Flask
from flask_cors import CORS

from routes.auth import auth_bp
from routes.crop_location import crop_location_bp
from routes.weather import weather_bp


app = Flask(__name__)

# Allow React frontend to communicate with Flask
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [
                "http://localhost:5173",
                "http://127.0.0.1:5173"
            ]
        }
    },
    supports_credentials=True
)

# Register authentication routes
app.register_blueprint(
    auth_bp,
    url_prefix="/api/auth"
)

# Register crop location routes
app.register_blueprint(
    crop_location_bp,
    url_prefix="/api/crop-location"
)

# Register weather routes
app.register_blueprint(
    weather_bp,
    url_prefix="/api/weather"
)


@app.route("/")
def home():
    return {
        "success": True,
        "message": "Krishi Sahayog API is running"
    }


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )