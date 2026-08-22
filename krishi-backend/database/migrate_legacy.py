import sqlite3


def migrate_legacy_users_table(db_path):
    """
    Older versions of this app used a hand-written sqlite3 table
    that didn't match the current SQLAlchemy User model:
      - it had a `password` column instead of `password_hash`
      - it had no `created_at` column at all

    This brings an existing table up to date in place so existing
    accounts keep working, instead of silently losing them when we
    switch to the ORM.

    Safe to run every time the app starts — each step is a no-op
    once it has already been applied.
    """

    try:

        connection = sqlite3.connect(db_path)

        columns = [
            row[1]
            for row in connection.execute(
                "PRAGMA table_info(users)"
            ).fetchall()
        ]

        if not columns:
            # Table doesn't exist yet — nothing to migrate,
            # SQLAlchemy's create_all() will create it fresh.
            connection.close()
            return

        # ---- Rename password -> password_hash ----

        if "password" in columns and "password_hash" not in columns:

            connection.execute(
                "ALTER TABLE users RENAME COLUMN password TO password_hash"
            )

            print("[migration] Renamed users.password -> "
                  "users.password_hash")

        # ---- Add created_at if missing ----

        columns = [
            row[1]
            for row in connection.execute(
                "PRAGMA table_info(users)"
            ).fetchall()
        ]

        if "created_at" not in columns:

            # SQLite doesn't allow a non-constant default (like
            # CURRENT_TIMESTAMP) in ALTER TABLE ADD COLUMN, so add
            # it with a constant default first, then backfill.

            connection.execute(
                "ALTER TABLE users ADD COLUMN created_at TEXT DEFAULT ''"
            )

            connection.execute(
                "UPDATE users SET created_at = CURRENT_TIMESTAMP "
                "WHERE created_at IS NULL OR created_at = ''"
            )

            print("[migration] Added users.created_at")

        connection.commit()
        connection.close()

    except Exception as error:

        # Don't crash app startup over a migration hiccup — log it
        # loudly so it isn't missed, since a bad migration would
        # cause every login/signup to fail with a clear error.
        print("[migration] WARNING: legacy users table migration "
              f"failed: {error}")