from flask_limiter import Limiter
from flask_limiter.util import get_remote_address


# Created here (unbound) so route files can import `limiter` and
# use @limiter.limit(...) without a circular import back to app.py.
# app.py calls limiter.init_app(app) once the app exists.
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per minute"],
)