import requests

from flask import Blueprint, request, jsonify


weather_bp = Blueprint("weather", __name__)


# =========================================================
# OPEN-METEO
# Free weather + geocoding APIs, no API key required.
# https://open-meteo.com
# =========================================================

GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
FORECAST_URL = "https://api.open-meteo.com/v1/forecast"


def geocode(query):
    """Look up latitude/longitude for a place name."""

    params = {
        "name": query,
        "count": 5,
        "language": "en",
        "format": "json",
    }

    response = requests.get(GEOCODING_URL, params=params, timeout=8)
    response.raise_for_status()

    results = response.json().get("results") or []

    # Prefer results that are actually in Nepal
    nepal_results = [
        r for r in results if r.get("country_code") == "NP"
    ]

    candidates = nepal_results or results

    return candidates[0] if candidates else None


def resolve_district(district):
    """Try a couple of query variants to find the best match."""

    return (
        geocode(f"{district}, Nepal")
        or geocode(f"{district} District, Nepal")
        or geocode(district)
    )


# =========================================================
# GET /api/weather?province=X&district=Y
# =========================================================

@weather_bp.route("", methods=["GET"])
def get_weather():

    province = request.args.get("province", "").strip()
    district = request.args.get("district", "").strip()

    if not district:
        return jsonify({
            "success": False,
            "message": "district is required."
        }), 400

    try:

        location = resolve_district(district)

        if not location:
            return jsonify({
                "success": False,
                "message": f"Couldn't find location data for {district}."
            }), 404

        lat = location["latitude"]
        lon = location["longitude"]

        forecast_params = {
            "latitude": lat,
            "longitude": lon,
            "daily": ",".join([
                "weathercode",
                "temperature_2m_max",
                "temperature_2m_min",
                "precipitation_sum",
                "precipitation_probability_max",
                "windspeed_10m_max",
                "relative_humidity_2m_mean",
            ]),
            "current_weather": True,
            "timezone": "Asia/Kathmandu",
            "forecast_days": 7,
        }

        forecast_response = requests.get(
            FORECAST_URL,
            params=forecast_params,
            timeout=8
        )
        forecast_response.raise_for_status()

        forecast_data = forecast_response.json()
        daily = forecast_data.get("daily", {})

        dates = daily.get("time", [])

        days = []

        for i, date in enumerate(dates):
            days.append({
                "date": date,
                "weather_code": daily["weathercode"][i],
                "temp_max": daily["temperature_2m_max"][i],
                "temp_min": daily["temperature_2m_min"][i],
                "precipitation_sum": daily["precipitation_sum"][i],
                "precipitation_probability":
                    daily["precipitation_probability_max"][i],
                "wind_max": daily["windspeed_10m_max"][i],
                "humidity": daily["relative_humidity_2m_mean"][i],
            })

        current = forecast_data.get("current_weather", {})

        return jsonify({
            "success": True,
            "location": {
                "district": district,
                "province": province,
                "resolved_name": location.get("name"),
                "admin1": location.get("admin1"),
                "latitude": lat,
                "longitude": lon,
            },
            "current": {
                "temperature": current.get("temperature"),
                "windspeed": current.get("windspeed"),
                "weather_code": current.get("weathercode"),
                "time": current.get("time"),
            },
            "days": days,
        }), 200

    except requests.exceptions.RequestException as error:

        print("WEATHER FETCH ERROR:", error)

        return jsonify({
            "success": False,
            "message": "Unable to reach the weather service. Please try again."
        }), 502

    except Exception as error:

        print("WEATHER ERROR:", error)

        return jsonify({
            "success": False,
            "message": "Something went wrong fetching the weather."
        }), 500